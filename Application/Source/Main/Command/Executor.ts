/**
 * Execute application commands and supervise command-stream processing.
 *
 * @module @sorrell/wm/Main/Command/Executor
 *
 * @file      Executor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "../AppSettings/AppSettings.ts";
import * as BoxUtility from "../Utility/Math/Box.ts";
import * as BrowserWindow from "../BrowserWindow.ts";
import * as CommandResolver from "./Resolver.ts";
import * as Hotkey from "../Input/Hotkey.ts";
import * as Logging from "../Log.ts";
import * as OverlaySession from "../Overlay/Session.ts";
import * as Tiling from "../Tiling/index.ts";
import type * as Ui from "./Ui.ts";
import { Box, IntPoint } from "@sorrell/math";
import {
    Context,
    Data,
    Duration,
    Effect,
    Fiber,
    Layer,
    Number,
    Option,
    Result,
    Stream,
    pipe
} from "effect";
import {
    GetOverlayCommandDefinitions,
    IsFocusMonitorCommandId,
    MoveDistance,
    type OverlayCommandDefinition,
    type OverlayCommandId,
    type OverlayScreenDto,
    OverlayScreenId,
    ResizeMode
} from "../../Shared/OverlayCommand.ts";
import { type Handle, Screen, Window } from "@sorrell/windows";
import { AppApiChannel } from "../../Shared/Api.ts";
import type { BackdropPresentation } from "../../Shared/Backdrop.ts";
import { DevFeatures } from "../Development/DevFeatures.ts";
import type { InsertTargetPresentation } from "../../Shared/InsertTarget.ts";

export/** The service identifier for command execution. */
const TypeId = "~sorrell/wm/Main/Command/Executor" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

const BackdropFadeDurationMilliseconds = 200;
const IsBackdropEnabled: boolean = false;

interface OverlayActivationTarget
{
    readonly ForegroundBounds: Box.Box;
    readonly OverlayBounds: Box.Box;
    readonly Window: Handle.HWND;
}

interface TiledInsertRuntimeState
{
    readonly KnownWindows: Set<Handle.HWND>;
    LastMovingBounds: Option.Option<Box.Box>;
    LastMovingWindow: Option.Option<Handle.HWND>;
    SuppressNextTargetClose: boolean;
}

/** A recognized command has no executor implementation yet. */
export class UnsupportedCommandError extends
    Data.TaggedError("UnsupportedCommandError")<{
        readonly Command: CommandResolver.Resolved;
    }> { }

/** Windows rejected restoration of the window active before the overlay opened. */
export class WindowFocusRestorationError extends
    Data.TaggedError("WindowFocusRestorationError")<{
        readonly Message: string;
        readonly Window: Handle.HWND;
    }> { }

/** Any expected failure produced while executing a command directly. */
export type Error =
    | BrowserWindow.Error
    | Tiling.Manager.WindowEnumerationError
    | Tiling.Manager.WindowLayoutError
    | Tiling.Manager.WindowMetadataUnavailableError
    | Tiling.Manager.WindowNotManagedError
    | UnsupportedCommandError
    | WindowFocusRestorationError;

/** Operations exposed by the scoped command executor. */
export interface CommandExecutorImpl
{
    /** Execute one command and report its expected failure to the caller. */
    readonly Execute: (
        Command: CommandResolver.Resolved
    ) => Effect.Effect<void, Error>;
}

/** Execute commands directly and consume the resolver's command stream. */
export class CommandExecutor extends
    Context.Service<CommandExecutor, CommandExecutorImpl>()(TypeId) { }

const CloseBackdrop = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl
) => pipe(
    BrowserWindows.ForceClose(BrowserWindow.Key.Backdrop),
    Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
);

const ShowBackdrop = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Bounds: Box.Box,
    Intensity: number
) => pipe(
    Effect.gen(function*()
    {
        yield* CloseBackdrop(BrowserWindows);

        if (Intensity === 0)
        {
            return;
        }

        const Presentation: BackdropPresentation = Object.freeze({
            DurationMilliseconds: BackdropFadeDurationMilliseconds,
            Intensity
        });

        yield* BrowserWindows.Open(BrowserWindow.GetBackdropWindowSpec());
        yield* BrowserWindows.SetBounds(BrowserWindow.Key.Backdrop, Bounds);
        yield* BrowserWindows.ShowInactive(BrowserWindow.Key.Backdrop);
        yield* BrowserWindows.Send(
            BrowserWindow.Key.Backdrop,
            AppApiChannel.BackdropShow,
            Presentation
        );
    }),
    Effect.onError(() => pipe(CloseBackdrop(BrowserWindows), Effect.ignore))
);

// @TODO Verify that these min/max values are sensible.
const ClampOverlayWidth = Number.clamp({ maximum: 800, minimum: 320 });
const ClampOverlayHeight = Number.clamp({ maximum: 1024, minimum: 160 });

const GetOverlayBoundsFor = (ForegroundBox: Box.Box): Box.Box =>
{
    const Width = ClampOverlayWidth(Box.Width(ForegroundBox));
    const Height = ClampOverlayHeight(Box.Height(ForegroundBox));

    return BoxUtility.Center(IntPoint.IntPoint(Width, Height), ForegroundBox);
};

const GetActivationTarget = (
    TargetWindow: Handle.HWND
): Option.Option<OverlayActivationTarget> => pipe(
    Window.GetWindowRect(TargetWindow),
    Option.map((ForegroundBox: Box.Box): OverlayActivationTarget => ({
        ForegroundBounds: ForegroundBox,
        OverlayBounds: GetOverlayBoundsFor(ForegroundBox),
        Window: TargetWindow
    }))
);

const IsFullscreenActivationTarget = (
    Target: OverlayActivationTarget
): boolean =>
{
    const Monitors = Screen.GetMonitors();
    if (Result.isFailure(Monitors))
    {
        return false;
    }

    return Monitors.success.some((Monitor: Screen.MonitorInfo): boolean =>
        Target.ForegroundBounds.Left <= Monitor.Monitor.Left
        && Target.ForegroundBounds.Top <= Monitor.Monitor.Top
        && Target.ForegroundBounds.Right >= Monitor.Monitor.Right
        && Target.ForegroundBounds.Bottom >= Monitor.Monitor.Bottom
    );
};

const OnActivate = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl
) => Effect.gen(function*()
{
    const StaticOverlay = (yield* DevFeatures).StaticOverlay;
    const ActivationTarget: Option.Option<OverlayActivationTarget> = pipe(
        Window.GetForegroundWindow(),
        Option.flatMap(GetActivationTarget)
    );
    const IgnoreInFullscreen = StaticOverlay
        ? false
        : yield* Settings.GetSetting("IgnoreActivationKeybindInFullscreen");

    if (
        IgnoreInFullscreen
        && Option.isSome(ActivationTarget)
        && IsFullscreenActivationTarget(ActivationTarget.value)
    )
    {
        yield* Logging.LogInfo(
            "Overlay",
            "Ignored the activation keybind because the foreground window is fullscreen.",
            { Window: ActivationTarget.value.Window }
        );
        return;
    }

    yield* Session.Reset;
    yield* Session.ClearActivationWindow;
    yield* Session.ClearFocusPreview;

    if (StaticOverlay)
    {
        yield* PublishOverlayScreen(BrowserWindows, Session);
        return yield* Effect.void;
    }

    if (Option.isSome(ActivationTarget))
    {
        const TilingSnapshot = yield* TilingManager.Snapshot;
        const IsStacked = Tiling.Tree.StackWindowOrders(TilingSnapshot).some(
            (Order: Tiling.Tree.StackWindowOrder): boolean =>
                Order.Windows.includes(ActivationTarget.value.Window)
        );

        if (IsStacked)
        {
            yield* TilingManager.BringStackWindowToFront(
                ActivationTarget.value.Window
            );
        }

        yield* Session.SetActivationWindow(ActivationTarget.value.Window);
        yield* PublishOverlayScreen(BrowserWindows, Session);
        yield* Logging.LogInfo("Overlay", "Command overlay activated.", {
            Window: ActivationTarget.value.Window
        });
        yield* BrowserWindows.SetBounds(
            BrowserWindow.Key.Overlay,
            ActivationTarget.value.OverlayBounds
        );

        if (IsBackdropEnabled)
        {
            const BackdropIntensity = yield* Settings.GetSetting("OverlayBackdropIntensity");

            yield* ShowBackdrop(
                BrowserWindows,
                ActivationTarget.value.ForegroundBounds,
                BackdropIntensity
            );
        }

        yield* BrowserWindows.Show(BrowserWindow.Key.Overlay);
    }
    else
    {
        yield* PublishOverlayScreen(BrowserWindows, Session);
        yield* Logging.LogWarning(
            "Overlay",
            "Could not activate the command overlay because no foreground window was available."
        );
        return yield* Effect.void;
    }
});

const RestoreActivationWindowFocus = (
    Session: OverlaySession.OverlaySessionImpl
) => pipe(
    Session.TakeActivationWindow,
    Effect.flatMap(Option.match({
        onNone: () => Effect.void,
        onSome: (WindowHandle: Handle.HWND) => pipe(
            Effect.sync(() => Window.SetForegroundWindow(WindowHandle)),
            Effect.flatMap(Effect.fromResult),
            Effect.mapError((Cause: { readonly Message: string; }) =>
                new WindowFocusRestorationError({
                    Message: Cause.Message,
                    Window: WindowHandle
                })
            )
        )
    }))
);

const ApplyTiledFocusSelection = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Selection: OverlaySession.TiledFocusSelection
) => Effect.gen(function*()
{
    if (Selection.Node._tag === "Panel")
    {
        const StackTarget = Selection.Node.Orientation
            === Tiling.Tree.Orientation.Stack
            ? Selection.StackWindows?.[Selection.StackActiveIndex ?? 0]
            : undefined;

        if (StackTarget !== undefined)
        {
            yield* TilingManager.BringStackWindowToFront(StackTarget);
            const FocusResult = Window.SetForegroundWindow(StackTarget);

            if (Result.isFailure(FocusResult))
            {
                yield* Logging.LogWarning(
                    "Command.Focus",
                    "Windows rejected a stacked-window focus request.",
                    FocusResult.failure,
                    { Window: StackTarget }
                );

                const WindowTitle = Option.getOrElse(
                    Option.filter(
                        Window.GetWindowText(StackTarget),
                        (Value: string) => Value.trim().length > 0
                    ),
                    () => "Untitled window"
                );

                yield* Session.RecordFocusFailure({
                    Window: StackTarget,
                    WindowTitle
                });
                yield* PublishOverlayScreen(BrowserWindows, Session);
                return;
            }

            yield* Session.SetActivationWindow(StackTarget);
        }

        yield* Session.SetTiledFocusSelection(Selection);
        yield* Session.ClearFocusPreview;
        const Snapshot = yield* TilingManager.Snapshot;
        const Workspace = Snapshot.Workspaces.find(
            (Candidate: Tiling.Tree.Workspace): boolean =>
                Candidate.Id === Selection.WorkspaceId
        );
        const Gap = yield* TilingManager.Gap;
        const PanelBounds = Workspace === undefined
            ? undefined
            : Tiling.Tree.GetNodeBoundsAtPath(
                Workspace.Root,
                Workspace.Bounds,
                Selection.Path,
                Gap
            );

        if (PanelBounds !== undefined)
        {
            yield* BrowserWindows.SetBounds(
                BrowserWindow.Key.Overlay,
                GetOverlayBoundsFor(PanelBounds)
            );
        }

        yield* PublishOverlayScreen(BrowserWindows, Session);
        return;
    }

    const TargetWindow = Selection.Node.Value.Window;
    const FocusResult = Window.SetForegroundWindow(TargetWindow);

    if (Result.isFailure(FocusResult))
    {
        yield* Logging.LogWarning(
            "Command.Focus",
            "Windows rejected a tiled-window focus request.",
            FocusResult.failure,
            { Window: TargetWindow }
        );

        const WindowTitle = Option.getOrElse(
            Option.filter(
                Window.GetWindowText(TargetWindow),
                (Value: string) => Value.trim().length > 0
            ),
            () => "Untitled window"
        );

        yield* Session.RecordFocusFailure({ Window: TargetWindow, WindowTitle });
        yield* Session.ClearFocusPreview;
        yield* PublishOverlayScreen(BrowserWindows, Session);
        return;
    }

    yield* Session.SetTiledFocusSelection(Selection);
    yield* Session.ClearFocusPreview;
    yield* Session.SetActivationWindow(TargetWindow);

    const ActivationTarget = GetActivationTarget(TargetWindow);

    if (Option.isSome(ActivationTarget))
    {
        yield* BrowserWindows.SetBounds(
            BrowserWindow.Key.Overlay,
            ActivationTarget.value.OverlayBounds
        );
    }

    yield* PublishOverlayScreen(BrowserWindows, Session);
});

const FocusDirection = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Id: OverlayCommandId
) => Effect.gen(function*()
{
    if ((yield* Session.Current) === OverlayScreenId.TiledFocus)
    {
        const Selection = yield* Session.ResolveTiledFocusTarget(Id);
        if (Option.isSome(Selection))
        {
            yield* ApplyTiledFocusSelection(
                BrowserWindows,
                Session,
                TilingManager,
                Selection.value
            );
        }

        return;
    }

    const Target = yield* Session.ResolveFocusTarget(Id);

    if (Option.isNone(Target))
    {
        return;
    }

    const FocusResult = Window.SetForegroundWindow(Target.value);
    if (Result.isFailure(FocusResult))
    {
        yield* Logging.LogWarning(
            "Command.Focus",
            "Windows rejected a floating-window focus request.",
            FocusResult.failure,
            { Window: Target.value }
        );

        const WindowTitle = Option.getOrElse(
            Option.filter(
                Window.GetWindowText(Target.value),
                (Value: string) => Value.trim().length > 0
            ),
            () => "Untitled window"
        );

        yield* Session.RecordFocusFailure({ Window: Target.value, WindowTitle });
        yield* Session.ClearFocusPreview;
        yield* PublishOverlayScreen(BrowserWindows, Session);
        return;
    }

    // Keep the overlay open on the Focus screen, repainted over the newly-focused
    // window, with its direction choices recomputed relative to that window.
    yield* Session.ClearFocusPreview;
    yield* Session.SetActivationWindow(Target.value);

    const ActivationTarget = GetActivationTarget(Target.value);

    if (Option.isSome(ActivationTarget))
    {
        yield* BrowserWindows.SetBounds(
            BrowserWindow.Key.Overlay,
            ActivationTarget.value.OverlayBounds
        );
    }

    yield* PublishOverlayScreen(BrowserWindows, Session);
});

const MoveDirectionUnits: Readonly<Record<
    "MoveWindowDown" | "MoveWindowLeft" | "MoveWindowRight" | "MoveWindowUp",
    { readonly X: number; readonly Y: number; }
>> = {
    MoveWindowDown: { X: 0, Y: 1 },
    MoveWindowLeft: { X: -1, Y: 0 },
    MoveWindowRight: { X: 1, Y: 0 },
    MoveWindowUp: { X: 0, Y: -1 }
};

const IsWindowTiled = (
    Snapshot: Tiling.Tree.State,
    WindowValue: Handle.HWND
): boolean => Snapshot.Workspaces.some((Workspace: Tiling.Tree.Workspace) =>
    Tiling.Tree.HasWindow(Workspace.Root, WindowValue));

const MoveWindowByOffset = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    ActivationWindow: Handle.HWND,
    OffsetX: number,
    OffsetY: number
) => Effect.gen(function*()
{
    if (OffsetX === 0 && OffsetY === 0)
    {
        return;
    }

    // Only floating windows move directly; tiled windows are repositioned by the
    // tiling manager instead.
    const Snapshot = yield* TilingManager.Snapshot;

    if (IsWindowTiled(Snapshot, ActivationWindow))
    {
        return;
    }

    const CurrentBounds = Window.GetWindowRect(ActivationWindow);

    if (Option.isNone(CurrentBounds))
    {
        return;
    }

    const NewBounds = Box.Box(
        CurrentBounds.value.Top + OffsetY,
        CurrentBounds.value.Right + OffsetX,
        CurrentBounds.value.Bottom + OffsetY,
        CurrentBounds.value.Left + OffsetX
    );
    const MoveResult = Window.SetWindowRect(ActivationWindow, NewBounds);

    if (Result.isFailure(MoveResult))
    {
        yield* Logging.LogWarning(
            "Command.Move",
            "Windows rejected a floating-window move request.",
            MoveResult.failure,
            { Window: ActivationWindow }
        );
        return;
    }

    // Center the overlay on the bounds we just moved the window to, rather than
    // re-querying the OS: `SetWindowRect` posts the move asynchronously, so an
    // immediate `GetWindowRect` can still race and return the pre-move bounds.
    yield* BrowserWindows.SetBounds(
        BrowserWindow.Key.Overlay,
        GetOverlayBoundsFor(NewBounds)
    );

    yield* PublishOverlayScreen(BrowserWindows, Session);
});

// Alt (FineModifier) forces the 1px fine step regardless of whether Shift
// (PrimaryModifier) is also held, taking precedence over it.
const GetActiveMoveDistance = (
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl
) => Effect.gen(function*()
{
    const FineHeld = yield* Session.FineModifierHeld;

    if (FineHeld)
    {
        return MoveDistance.Fine;
    }

    const Held = yield* Session.PrimaryModifierHeld;
    return Held
        ? yield* Settings.GetSetting("MoveStepSecondary")
        : yield* Settings.GetSetting("MoveStepPrimary");
});

const CenterOverlayOnTiledWindow = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    WindowValue: Handle.HWND
) => Effect.gen(function*()
{
    const Gap = yield* TilingManager.Gap;
    const Placement = Tiling.Tree.Layout(
        yield* TilingManager.Snapshot,
        Gap
    ).find((Candidate: Tiling.Tree.Placement): boolean =>
        Candidate.Window === WindowValue);

    if (Placement !== undefined)
    {
        yield* BrowserWindows.SetBounds(
            BrowserWindow.Key.Overlay,
            GetOverlayBoundsFor(Placement.Bounds)
        );
    }
});

const MoveTiledWindow = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    ActivationWindow: Handle.HWND,
    Id: OverlayCommandId
) => Effect.gen(function*()
{
    const Action = yield* Session.ResolveTiledMoveAction(Id);
    if (Option.isNone(Action))
    {
        return;
    }

    switch (Action.value._tag)
    {
        case "SelectPanel":
            yield* Session.SetTiledMovePanelTarget(Action.value);
            yield* PublishOverlayScreen(BrowserWindows, Session);
            return;
        case "MoveIntoPanel":
            yield* TilingManager.MoveIntoPanel(
                ActivationWindow,
                Action.value.TargetPanelPath
            );
            break;
        case "MoveToContainingPanel":
            yield* TilingManager.MoveToContainingPanel(ActivationWindow);
            break;
        case "MoveToIndex":
            yield* TilingManager.MoveToIndex(
                ActivationWindow,
                Action.value.TargetIndex
            );
            break;
    }

    yield* Session.ClearTiledMovePanelTarget;
    yield* CenterOverlayOnTiledWindow(
        BrowserWindows,
        TilingManager,
        ActivationWindow
    );
    yield* PublishOverlayScreen(BrowserWindows, Session);
});

const MoveWindowDirection = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Id: OverlayCommandId
) => Effect.gen(function*()
{
    const CurrentScreen = yield* Session.Current;
    const ActivationWindow = yield* Session.GetActivationWindow;

    if (CurrentScreen === OverlayScreenId.TiledMove)
    {
        if (Option.isSome(ActivationWindow))
        {
            yield* MoveTiledWindow(
                BrowserWindows,
                Session,
                TilingManager,
                ActivationWindow.value,
                Id
            );
        }

        return;
    }

    const UnitsByCommandId = MoveDirectionUnits as
        Readonly<Partial<Record<string, { readonly X: number; readonly Y: number; }>>>;
    const Unit = UnitsByCommandId[Id];

    if (Unit === undefined || Option.isNone(ActivationWindow))
    {
        return;
    }

    const Distance = yield* GetActiveMoveDistance(Settings, Session);

    yield* MoveWindowByOffset(
        BrowserWindows,
        Session,
        TilingManager,
        ActivationWindow.value,
        Unit.X * Distance,
        Unit.Y * Distance
    );
});

/** One edge of a floating window, adjustable independently by the Resize screen. */
type ResizeEdge = "Bottom" | "Left" | "Right" | "Top";

const ResizeDirectionEdges: Readonly<Record<
    "ResizeWindowDown" | "ResizeWindowLeft" | "ResizeWindowRight" | "ResizeWindowUp",
    ResizeEdge
>> = {
    ResizeWindowDown: "Bottom",
    ResizeWindowLeft: "Left",
    ResizeWindowRight: "Right",
    ResizeWindowUp: "Top"
};

// The sign an edge's coordinate must change by for that edge to move outward
// (away from the window's own center), i.e. for the window to grow.
const EdgeOutwardSign: Readonly<Record<ResizeEdge, number>> = {
    Bottom: 1,
    Left: -1,
    Right: 1,
    Top: -1
};

const ResizeDirectionByEdge: Readonly<Record<
    ResizeEdge,
    Tiling.Tree.FocusDirection
>> = {
    Bottom: Tiling.Tree.FocusDirection.Down,
    Left: Tiling.Tree.FocusDirection.Left,
    Right: Tiling.Tree.FocusDirection.Right,
    Top: Tiling.Tree.FocusDirection.Up
};

// Guards against a held/settling resize inverting or degenerating the window's bounds.
const MinimumWindowSize = 40;

const ResizeWindowByEdge = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    ActivationWindow: Handle.HWND,
    Edge: ResizeEdge,
    DeltaPixels: number
) => Effect.gen(function*()
{
    if (DeltaPixels === 0)
    {
        return;
    }

    const Snapshot = yield* TilingManager.Snapshot;

    if (IsWindowTiled(Snapshot, ActivationWindow))
    {
        const Behavior = yield* Session.TiledResizeBehavior;
        yield* TilingManager.Resize(
            ActivationWindow,
            ResizeDirectionByEdge[Edge],
            EdgeOutwardSign[Edge] * DeltaPixels,
            Behavior
        );
        yield* CenterOverlayOnTiledWindow(
            BrowserWindows,
            TilingManager,
            ActivationWindow
        );
        yield* PublishOverlayScreen(BrowserWindows, Session);
        return;
    }

    const CurrentBounds = Window.GetWindowRect(ActivationWindow);

    if (Option.isNone(CurrentBounds))
    {
        return;
    }

    const Current = CurrentBounds.value;
    const NewBounds = Box.Box(
        Edge === "Top" ? Current.Top + DeltaPixels : Current.Top,
        Edge === "Right" ? Current.Right + DeltaPixels : Current.Right,
        Edge === "Bottom" ? Current.Bottom + DeltaPixels : Current.Bottom,
        Edge === "Left" ? Current.Left + DeltaPixels : Current.Left
    );

    if (Box.Width(NewBounds) < MinimumWindowSize || Box.Height(NewBounds) < MinimumWindowSize)
    {
        return;
    }

    const ResizeResult = Window.SetWindowRect(ActivationWindow, NewBounds);

    if (Result.isFailure(ResizeResult))
    {
        yield* Logging.LogWarning(
            "Command.Resize",
            "Windows rejected a floating-window resize request.",
            ResizeResult.failure,
            { Window: ActivationWindow }
        );
        return;
    }

    // Center the overlay on the bounds we just resized the window to, rather
    // than re-querying the OS: `SetWindowRect` posts the resize asynchronously,
    // so an immediate `GetWindowRect` can still race and return stale bounds.
    yield* BrowserWindows.SetBounds(
        BrowserWindow.Key.Overlay,
        GetOverlayBoundsFor(NewBounds)
    );

    yield* PublishOverlayScreen(BrowserWindows, Session);
});

// Grow always moves an edge outward; Shrink always moves it inward. The sign
// is fixed for the whole gesture (a single press or a full hold-to-settle
// animation), since it depends only on which edge and which mode are active.
const GetResizeSign = (Edge: ResizeEdge, Mode: ResizeMode): number =>
    Mode === ResizeMode.Grow ? EdgeOutwardSign[Edge] : -EdgeOutwardSign[Edge];

const ResizeWindowDirection = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Id: OverlayCommandId
) => Effect.gen(function*()
{
    const EdgesByCommandId = ResizeDirectionEdges as Readonly<Partial<Record<string, ResizeEdge>>>;
    const Edge = EdgesByCommandId[Id];
    const ActivationWindow = yield* Session.GetActivationWindow;
    const Mode = yield* Session.ResizeMode;

    if (Edge === undefined || Option.isNone(ActivationWindow))
    {
        return;
    }

    const Distance = yield* GetActiveMoveDistance(Settings, Session);

    yield* ResizeWindowByEdge(
        BrowserWindows,
        Session,
        TilingManager,
        ActivationWindow.value,
        Edge,
        GetResizeSign(Edge, Mode) * Distance
    );
});

// Mirrors conventional Windows key-repeat behavior: an initial pause before
// holding a direction key starts moving the window continuously.
const MoveAnimationInitialDelayMillis = 500;
const DefaultRefreshRateHz = 60;

// Alt (FineModifier) forces the fine step's own configured speed regardless of
// whether Shift (PrimaryModifier) is also held, taking precedence over it. The
// primary/secondary speeds are configured as multiples of their step size
// rather than as their own fixed pixel/second value.
const GetActiveMovePixelsPerSecond = (
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl
) => Effect.gen(function*()
{
    const FineHeld = yield* Session.FineModifierHeld;

    if (FineHeld)
    {
        return yield* Settings.GetSetting("MoveFineSpeed");
    }

    const Held = yield* Session.PrimaryModifierHeld;

    return Held
        ? (yield* Settings.GetSetting("MoveStepSecondary"))
            * (yield* Settings.GetSetting("MoveStepSecondarySpeedFactor"))
        : (yield* Settings.GetSetting("MoveStepPrimary"))
            * (yield* Settings.GetSetting("MoveStepPrimarySpeedFactor"));
});

/** A mutable flag shared between a directional animation fiber and the watcher that started it. */
interface MoveAnimationHeldBox
{
    Held: boolean;
}

/**
 * Drive a held direction key's continuous animation: an initial delay, then
 * per-frame steps at the configured speed, applied via `ApplyDelta`. Releasing
 * the key (`HeldBox.Held` flips to `false`) doesn't stop the animation
 * outright — it keeps running until the accumulated signed distance passed to
 * `ApplyDelta` settles on the nearest multiple of the active step size,
 * continuing in the *opposite* direction first if it already overshot one.
 * Shared verbatim by window movement and window resizing: both are just a
 * single scalar quantity animated over time, differing only in what
 * `ApplyDelta` does with each frame's delta.
 */
const AnimateDirectionalHold = (
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    HeldBox: MoveAnimationHeldBox,
    ApplyDelta: (
        ActivationWindow: Handle.HWND,
        DeltaPixels: number
    ) => Effect.Effect<void, unknown>
) => Effect.gen(function*()
{
    yield* Effect.sleep(Duration.millis(MoveAnimationInitialDelayMillis));

    // Released again during the initial delay, before any continuous movement
    // ever started: nothing traveled yet, so there is nothing to settle.
    if (!HeldBox.Held)
    {
        return;
    }

    const ActivationWindow = yield* Session.GetActivationWindow;

    if (Option.isNone(ActivationWindow))
    {
        return;
    }

    const RefreshRateHz = Option.getOrElse(
        Window.GetRefreshRate(ActivationWindow.value),
        () => DefaultRefreshRateHz
    );
    const FrameIntervalMillis = 1000 / RefreshRateHz;

    // Sub-pixel travel per frame is common at high refresh rates or low
    // speeds; carrying the fractional remainder forward keeps the average
    // speed correct instead of stalling until a whole pixel accumulates.
    let CarryPixels = 0;

    // The signed distance passed to ApplyDelta so far, in pixels. Once the
    // key is released, animation continues (possibly in the *opposite*
    // direction) until this reaches the nearest multiple of the active step size.
    let TotalMoved = 0;

    // Set once, the first frame after release, to the nearest multiple of the
    // step size in effect at that moment. `null` while still held, or once
    // released with the fine (1px) step active, which needs no correction.
    let SettleTarget: number | null = null;

    while (true)
    {
        if (!HeldBox.Held && SettleTarget === null)
        {
            const FineHeld = yield* Session.FineModifierHeld;

            if (!FineHeld)
            {
                const SecondaryHeld = yield* Session.PrimaryModifierHeld;
                const StepSize = yield* Settings.GetSetting(
                    SecondaryHeld ? "MoveStepSecondary" : "MoveStepPrimary"
                );

                if (StepSize > 0)
                {
                    SettleTarget = Math.round(TotalMoved / StepSize) * StepSize;
                }
            }

            if (SettleTarget === null || SettleTarget === TotalMoved)
            {
                break;
            }
        }

        const PixelsPerSecond = yield* GetActiveMovePixelsPerSecond(Settings, Session);
        const MaxPixelsThisFrame = PixelsPerSecond * (FrameIntervalMillis / 1000);
        const RemainingDistance = SettleTarget === null ? undefined : SettleTarget - TotalMoved;
        const Direction = RemainingDistance === undefined ? 1 : Math.sign(RemainingDistance);
        const FrameBudget = RemainingDistance === undefined
            ? MaxPixelsThisFrame
            : Math.min(MaxPixelsThisFrame, Math.abs(RemainingDistance));

        CarryPixels += Direction * FrameBudget;

        const Step = Math.trunc(CarryPixels);

        CarryPixels -= Step;

        if (Step !== 0)
        {
            const CurrentActivationWindow = yield* Session.GetActivationWindow;

            if (Option.isSome(CurrentActivationWindow))
            {
                yield* ApplyDelta(CurrentActivationWindow.value, Step);
            }

            TotalMoved += Step;
        }

        if (SettleTarget !== null && TotalMoved === SettleTarget)
        {
            break;
        }

        yield* Effect.sleep(Duration.millis(FrameIntervalMillis));
    }
});

const AnimateMoveWindow = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Id: OverlayCommandId,
    HeldBox: MoveAnimationHeldBox
) => Effect.gen(function*()
{
    const UnitsByCommandId = MoveDirectionUnits as
        Readonly<Partial<Record<string, { readonly X: number; readonly Y: number; }>>>;
    const Unit = UnitsByCommandId[Id];

    if (Unit === undefined)
    {
        return;
    }

    yield* AnimateDirectionalHold(
        Settings,
        Session,
        HeldBox,
        (ActivationWindow: Handle.HWND, DeltaPixels: number) => MoveWindowByOffset(
            BrowserWindows,
            Session,
            TilingManager,
            ActivationWindow,
            Unit.X * DeltaPixels,
            Unit.Y * DeltaPixels
        )
    );
});

const AnimateResizeWindow = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Id: OverlayCommandId,
    HeldBox: MoveAnimationHeldBox
) => Effect.gen(function*()
{
    const EdgesByCommandId = ResizeDirectionEdges as Readonly<Partial<Record<string, ResizeEdge>>>;
    const Edge = EdgesByCommandId[Id];
    const Mode = yield* Session.ResizeMode;

    if (Edge === undefined)
    {
        return;
    }

    const Sign = GetResizeSign(Edge, Mode);

    yield* AnimateDirectionalHold(
        Settings,
        Session,
        HeldBox,
        (ActivationWindow: Handle.HWND, DeltaPixels: number) => ResizeWindowByEdge(
            BrowserWindows,
            Session,
            TilingManager,
            ActivationWindow,
            Edge,
            Sign * DeltaPixels
        )
    );
});

const PublishOverlayScreen = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl
) => pipe(
    Session.Snapshot,
    Effect.flatMap((Screen: OverlayScreenDto) => BrowserWindows.Send(
        BrowserWindow.Key.Overlay,
        AppApiChannel.OverlayScreenChanged,
        Screen
    ))
);

const InsertDirectionByCommand: Readonly<Partial<Record<
    OverlayCommandId,
    Tiling.Tree.FocusDirection
>>> = {
    ChooseInsertDown: Tiling.Tree.FocusDirection.Down,
    ChooseInsertLeft: Tiling.Tree.FocusDirection.Left,
    ChooseInsertRight: Tiling.Tree.FocusDirection.Right,
    ChooseInsertUp: Tiling.Tree.FocusDirection.Up
};

const IgnoreMissingBrowserWindow = <Value, ErrorType>(
    EffectValue: Effect.Effect<Value, ErrorType>
): Effect.Effect<void> => EffectValue.pipe(Effect.ignore);

const GetInsertTargetPresentation = (
    Session: OverlaySession.OverlaySessionImpl
): Effect.Effect<InsertTargetPresentation> => Effect.all({
    CaptureNextWindow: Session.TiledInsertCaptureNext,
    DragActive: Session.TiledInsertDragActive
});

const PublishInsertTarget = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl
) => GetInsertTargetPresentation(Session).pipe(
    Effect.flatMap((Presentation: InsertTargetPresentation) =>
        BrowserWindows.Send(
            BrowserWindow.Key.InsertTarget,
            AppApiChannel.InsertTargetChanged,
            Presentation
        ))
);

const GetManageableWindowSet = (): ReadonlySet<Handle.HWND> =>
{
    const Windows = Window.GetManageableTopLevelWindows();
    return Result.isSuccess(Windows)
        ? new Set(Windows.success)
        : new Set();
};

const IsPointInBox = (
    Point: IntPoint.IntPoint,
    Bounds: Box.Box
): boolean =>
    Bounds.Left <= Point.X
    && Point.X < Bounds.Right
    && Bounds.Top <= Point.Y
    && Point.Y < Bounds.Bottom;

const CompleteTiledInsert = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    WindowValue: Handle.HWND
) => Effect.gen(function*()
{
    const Target = yield* Session.TiledInsertTarget;
    if (Option.isNone(Target))
    {
        return;
    }

    yield* TilingManager.Insert(
        WindowValue,
        Target.value.TargetWindow,
        Target.value.Direction
    );
    yield* Session.ClearTiledInsert;
    yield* Session.Reset;
    yield* IgnoreMissingBrowserWindow(
        BrowserWindows.ForceClose(BrowserWindow.Key.InsertTarget)
    );
    yield* IgnoreMissingBrowserWindow(
        BrowserWindows.Hide(BrowserWindow.Key.Overlay)
    );
    yield* CloseBackdrop(BrowserWindows).pipe(Effect.ignore);
    yield* Effect.sync(() => Window.SetForegroundWindow(WindowValue)).pipe(
        Effect.flatMap(Effect.fromResult),
        Effect.ignore
    );
    yield* Logging.LogInfo("Overlay.Insert", "Completed a tiled Insert flow.", {
        Direction: Target.value.Direction,
        Target: Target.value.TargetWindow,
        Window: WindowValue
    });
});

const CancelTiledInsert = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl
) => Effect.gen(function*()
{
    const HadTarget = Option.isSome(yield* Session.TiledInsertTarget);
    if (HadTarget)
    {
        yield* TilingManager.Reconcile;
    }

    yield* Session.ClearTiledInsert;
    yield* Session.Reset;
    yield* IgnoreMissingBrowserWindow(
        BrowserWindows.ForceClose(BrowserWindow.Key.InsertTarget)
    );
    yield* IgnoreMissingBrowserWindow(
        BrowserWindows.Hide(BrowserWindow.Key.Overlay)
    );
    yield* CloseBackdrop(BrowserWindows).pipe(Effect.ignore);
    yield* RestoreActivationWindowFocus(Session);
    yield* Logging.LogInfo("Overlay.Insert", "Cancelled the tiled Insert flow.");
});

const ReturnToTiledInsertList = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    RuntimeState: TiledInsertRuntimeState
) => Effect.gen(function*()
{
    const Target = yield* Session.TiledInsertTarget;
    if (Option.isNone(Target))
    {
        return;
    }

    yield* Session.SetTiledInsertCaptureNext(false);
    yield* Session.SetTiledInsertDragActive(false);
    yield* Session.RefreshTiledInsertWindows;
    RuntimeState.SuppressNextTargetClose = true;
    yield* IgnoreMissingBrowserWindow(
        BrowserWindows.ForceClose(BrowserWindow.Key.InsertTarget)
    );
    yield* BrowserWindows.SetBounds(
        BrowserWindow.Key.Overlay,
        Target.value.Bounds
    );
    yield* BrowserWindows.Show(BrowserWindow.Key.Overlay);
    yield* BrowserWindows.Focus(BrowserWindow.Key.Overlay);
    yield* PublishOverlayScreen(BrowserWindows, Session);
});

const ShowTiledInsertTarget = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    RuntimeState: TiledInsertRuntimeState,
    CaptureNextWindow: boolean
) => Effect.gen(function*()
{
    const Target = yield* Session.TiledInsertTarget;
    if (Option.isNone(Target))
    {
        return;
    }

    RuntimeState.KnownWindows.clear();
    for (const WindowValue of GetManageableWindowSet())
    {
        RuntimeState.KnownWindows.add(WindowValue);
    }
    RuntimeState.LastMovingWindow = Option.none();
    RuntimeState.LastMovingBounds = Option.none();

    yield* Session.SetTiledInsertCaptureNext(CaptureNextWindow);
    yield* Session.SetTiledInsertDragActive(false);
    yield* BrowserWindows.Ensure(
        BrowserWindow.GetInsertTargetWindowSpec(Target.value.Bounds)
    );
    yield* BrowserWindows.Hide(BrowserWindow.Key.Overlay);
    yield* BrowserWindows.Focus(BrowserWindow.Key.InsertTarget);
    yield* PublishInsertTarget(BrowserWindows, Session);
    yield* Logging.LogInfo(
        "Overlay.Insert",
        "Opened the temporary tiled Insert target.",
        { CaptureNextWindow }
    );
});

const ChooseTiledInsertDirection = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Direction: Tiling.Tree.FocusDirection
) => Effect.gen(function*()
{
    const ActivationWindow = yield* Session.GetActivationWindow;
    if (Option.isNone(ActivationWindow))
    {
        return;
    }

    const Bounds = yield* TilingManager.PreviewInsert(
        ActivationWindow.value,
        Direction
    );
    yield* Session.SetTiledInsertTarget({
        Bounds,
        Direction,
        TargetWindow: ActivationWindow.value
    });
    yield* Session.RefreshTiledInsertWindows;
    yield* Session.Navigate(OverlayScreenId.TiledInsertWindow);
    yield* BrowserWindows.SetBounds(BrowserWindow.Key.Overlay, Bounds);
    yield* PublishOverlayScreen(BrowserWindows, Session);
});

const PollTiledInsertTarget = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    RuntimeState: TiledInsertRuntimeState
) => Effect.gen(function*()
{
    const Target = yield* Session.TiledInsertTarget;
    if (Option.isNone(Target))
    {
        RuntimeState.LastMovingBounds = Option.none();
        RuntimeState.LastMovingWindow = Option.none();
        return;
    }

    const IsTargetVisible = yield* BrowserWindows.IsVisible(
        BrowserWindow.Key.InsertTarget
    ).pipe(Effect.match({
        onFailure: () => false,
        onSuccess: (Visible: boolean) => Visible
    }));
    if (!IsTargetVisible)
    {
        RuntimeState.LastMovingBounds = Option.none();
        RuntimeState.LastMovingWindow = Option.none();
        return;
    }

    const Snapshot = yield* TilingManager.Snapshot;
    const MovingWindow = Window.GetMovingWindow().pipe(
        Option.filter((WindowValue: Handle.HWND): boolean =>
            !IsWindowTiled(Snapshot, WindowValue)),
        Option.filter((WindowValue: Handle.HWND): boolean =>
            GetManageableWindowSet().has(WindowValue))
    );

    if (Option.isSome(MovingWindow))
    {
        if (
            Option.isNone(RuntimeState.LastMovingWindow)
            || RuntimeState.LastMovingWindow.value !== MovingWindow.value
        )
        {
            RuntimeState.LastMovingBounds =
                Window.GetWindowRect(MovingWindow.value);
        }
        RuntimeState.LastMovingWindow = MovingWindow;
        if (!(yield* Session.TiledInsertDragActive))
        {
            yield* Session.SetTiledInsertDragActive(true);
            yield* PublishInsertTarget(BrowserWindows, Session).pipe(Effect.ignore);
        }
        return;
    }

    const LastMovingWindow = RuntimeState.LastMovingWindow;
    const LastMovingBounds = RuntimeState.LastMovingBounds;
    RuntimeState.LastMovingBounds = Option.none();
    RuntimeState.LastMovingWindow = Option.none();
    if (yield* Session.TiledInsertDragActive)
    {
        yield* Session.SetTiledInsertDragActive(false);
        yield* PublishInsertTarget(BrowserWindows, Session).pipe(Effect.ignore);
    }

    if (Option.isSome(LastMovingWindow))
    {
        const Cursor = Window.GetCursorPosition();
        const ReleasedBounds = Window.GetWindowRect(LastMovingWindow.value);
        const WasMoved = Option.isSome(LastMovingBounds)
            && Option.isSome(ReleasedBounds)
            && Box.Width(LastMovingBounds.value) === Box.Width(ReleasedBounds.value)
            && Box.Height(LastMovingBounds.value) === Box.Height(ReleasedBounds.value);
        if (
            WasMoved
            && Option.isSome(Cursor)
            && IsPointInBox(Cursor.value, Target.value.Bounds)
        )
        {
            yield* CompleteTiledInsert(
                BrowserWindows,
                Session,
                TilingManager,
                LastMovingWindow.value
            );
            return;
        }
    }

    if (!(yield* Session.TiledInsertCaptureNext))
    {
        return;
    }

    const CurrentWindows = Window.GetManageableTopLevelWindows();
    if (Result.isFailure(CurrentWindows))
    {
        return;
    }

    const NewWindow = CurrentWindows.success.find(
        (WindowValue: Handle.HWND): boolean =>
            !RuntimeState.KnownWindows.has(WindowValue)
            && !IsWindowTiled(Snapshot, WindowValue)
    );
    for (const WindowValue of CurrentWindows.success)
    {
        RuntimeState.KnownWindows.add(WindowValue);
    }

    if (NewWindow !== undefined)
    {
        yield* CompleteTiledInsert(
            BrowserWindows,
            Session,
            TilingManager,
            NewWindow
        );
    }
});

const ExecuteUi = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    InsertRuntime: TiledInsertRuntimeState,
    Command: Ui.UiCommand
) =>
{
    switch (Command._tag)
    {
        case "Activate":
            return Effect.gen(function*()
            {
                yield* Logging.LogInfo("Overlay", "Activating the command overlay.");
                yield* OnActivate(
                    BrowserWindows,
                    Settings,
                    Session,
                    TilingManager
                );
            });
        case "Deactivate":
            return Effect.gen(function*()
            {
                yield* Logging.LogInfo("Overlay", "Deactivating the command overlay.");
                yield* Session.ClearFocusPreview;
                if (Option.isSome(yield* Session.TiledInsertTarget))
                {
                    yield* TilingManager.Reconcile;
                    yield* Session.ClearTiledInsert;
                }
                yield* Session.Reset;
                yield* (IsBackdropEnabled
                    ? Effect.all([
                        BrowserWindows.Hide(BrowserWindow.Key.Overlay),
                        CloseBackdrop(BrowserWindows)
                    ], { concurrency: "unbounded", discard: true })
                    : BrowserWindows.Hide(BrowserWindow.Key.Overlay));
                yield* RestoreActivationWindowFocus(Session);
            });
        case "BackOverlayScreen":
            return Effect.gen(function*()
            {
                const CurrentScreen = yield* Session.Current;
                yield* Session.ClearFocusPreview;

                if (CurrentScreen === OverlayScreenId.TiledInsertWindow)
                {
                    const ActivationWindow = yield* Session.GetActivationWindow;
                    yield* TilingManager.Reconcile;
                    yield* Session.ClearTiledInsert;
                    yield* Session.Back;
                    if (Option.isSome(ActivationWindow))
                    {
                        yield* CenterOverlayOnTiledWindow(
                            BrowserWindows,
                            TilingManager,
                            ActivationWindow.value
                        );
                    }
                }
                else
                {
                    yield* Session.Back;
                }

                yield* Logging.LogDebug(
                    "Overlay",
                    "Navigated back one overlay screen."
                );
                yield* PublishOverlayScreen(BrowserWindows, Session);
            });
        case "CancelTiledInsert":
            InsertRuntime.KnownWindows.clear();
            InsertRuntime.LastMovingBounds = Option.none();
            InsertRuntime.LastMovingWindow = Option.none();
            return CancelTiledInsert(
                BrowserWindows,
                Session,
                TilingManager
            );
        case "CommitTiledFocus":
            return Effect.gen(function*()
            {
                const Selection = yield* Session.ResolveTiledFocusCommit;
                if (Option.isSome(Selection))
                {
                    yield* ApplyTiledFocusSelection(
                        BrowserWindows,
                        Session,
                        TilingManager,
                        Selection.value
                    );
                }
            });
        case "TileAll":
            return pipe(
                TilingManager.TileExistingWindows,
                Effect.andThen(Session.Reset),
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "ToggleTiledResizeBehavior":
            return pipe(
                Session.ToggleTiledResizeBehavior,
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "NavigateOverlayScreen":
            return pipe(
                Session.ClearFocusPreview,
                Effect.andThen(Session.Navigate(Command.ScreenId)),
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "OpenSettings":
            return Effect.gen(function*()
            {
                yield* BrowserWindows.Ensure(yield* BrowserWindow.SettingsWindowSpec);
                // yield* BrowserWindows.Focus(BrowserWindow.Key.Overlay);
                yield* BrowserWindows.Show(BrowserWindow.Key.Settings);
                yield* BrowserWindows.Focus(BrowserWindow.Key.Settings);
                yield* BrowserWindows.Hide(BrowserWindow.Key.Overlay);
                yield* BrowserWindows.Send(
                    BrowserWindow.Key.Settings,
                    AppApiChannel.SettingsNavigate,
                    Option.getOrNull(Command.Path)
                );
            });
        case "ReturnToTiledInsertList":
            InsertRuntime.KnownWindows.clear();
            InsertRuntime.LastMovingBounds = Option.none();
            InsertRuntime.LastMovingWindow = Option.none();
            return ReturnToTiledInsertList(
                BrowserWindows,
                Session,
                InsertRuntime
            );
        case "SetPrimaryModifierHeld":
            return pipe(
                Session.SetPrimaryModifierHeld(Command.Held),
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "SetFineModifierHeld":
            return pipe(
                Session.SetFineModifierHeld(Command.Held),
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "SetResizeMode":
            return pipe(
                Session.SetResizeMode(Command.Mode),
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "SelectTiledStackWindow":
            return Session.ResolveTiledStackWindow(Command.Index).pipe(
                Effect.flatMap(Option.match({
                    onNone: () => Effect.void,
                    onSome: (Selection: OverlaySession.TiledFocusSelection) =>
                        ApplyTiledFocusSelection(
                            BrowserWindows,
                            Session,
                            TilingManager,
                            Selection
                        )
                }))
            );
        case "SetTiledInsertCaptureNext":
            return Effect.gen(function*()
            {
                InsertRuntime.KnownWindows.clear();
                for (const WindowValue of GetManageableWindowSet())
                {
                    InsertRuntime.KnownWindows.add(WindowValue);
                }
                yield* Session.SetTiledInsertCaptureNext(Command.Enabled);
                yield* PublishInsertTarget(BrowserWindows, Session);
            });
        case "NoOpOverlayCommand":
            if (
                Command.Id.startsWith("FocusMove")
                || IsFocusMonitorCommandId(Command.Id)
            )
            {
                return FocusDirection(
                    BrowserWindows,
                    Session,
                    TilingManager,
                    Command.Id
                );
            }

            if (Command.Id.startsWith("MoveWindow"))
            {
                return MoveWindowDirection(BrowserWindows, Settings, Session, TilingManager, Command.Id);
            }

            if (Command.Id.startsWith("ResizeWindow"))
            {
                return ResizeWindowDirection(BrowserWindows, Settings, Session, TilingManager, Command.Id);
            }

            if (Command.Id in InsertDirectionByCommand)
            {
                const Direction = InsertDirectionByCommand[Command.Id];
                return Direction === undefined
                    ? Effect.void
                    : ChooseTiledInsertDirection(
                        BrowserWindows,
                        Session,
                        TilingManager,
                        Direction
                    );
            }

            if (Command.Id === "SelectInsertWindowUp")
            {
                return Session.MoveTiledInsertSelection(-1).pipe(
                    Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
                );
            }

            if (Command.Id === "SelectInsertWindowDown")
            {
                return Session.MoveTiledInsertSelection(1).pipe(
                    Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
                );
            }

            if (Command.Id === "CommitInsertWindow")
            {
                return Session.SelectedTiledInsertWindow.pipe(
                    Effect.flatMap(Option.match({
                        onNone: () => Effect.void,
                        onSome: (WindowValue: Handle.HWND) => CompleteTiledInsert(
                            BrowserWindows,
                            Session,
                            TilingManager,
                            WindowValue
                        )
                    }))
                );
            }

            if (
                Command.Id === "OpenInsertTarget"
                || Command.Id === "OpenInsertTargetForNextWindow"
            )
            {
                return ShowTiledInsertTarget(
                    BrowserWindows,
                    Session,
                    InsertRuntime,
                    Command.Id === "OpenInsertTargetForNextWindow"
                );
            }

            return Effect.void;
    }
};

const MakeExecute = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    InsertRuntime: TiledInsertRuntimeState
): CommandExecutorImpl["Execute"] => Effect.fn("CommandExecutor.Execute")(
    function* (Command: CommandResolver.Resolved)
    {
        const Annotations = {
            Category: Command.Category,
            Command: Command._tag
        };
        yield* Logging.LogDebug("Command", "Executing application command.", Annotations);

        switch (Command.Category)
        {
            case "Ui":
                return yield* ExecuteUi(
                    BrowserWindows,
                    Settings,
                    Session,
                    TilingManager,
                    InsertRuntime,
                    Command
                );
            case "Wm":
            {
                const Cause = new UnsupportedCommandError({ Command });
                yield* Logging.LogError(
                    "Command",
                    "Application command execution failed.",
                    Cause,
                    Annotations
                );
                return yield* Cause;
            }
        }

    }
);

export/** Live scoped command execution using the application services. */
const Live = Layer.effect(
    CommandExecutor,
    Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        const Resolver = yield* CommandResolver.CommandResolver;
        const Settings = yield* AppSettings.AppSettings;
        const Session = yield* OverlaySession.OverlaySession;
        const TilingManager = yield* Tiling.Manager.TilingManager;
        const Hotkeys = yield* Hotkey.Hotkey;
        const InsertRuntime: TiledInsertRuntimeState = {
            KnownWindows: new Set(),
            LastMovingBounds: Option.none(),
            LastMovingWindow: Option.none(),
            SuppressNextTargetClose: false
        };
        const Execute = MakeExecute(
            BrowserWindows,
            Settings,
            Session,
            TilingManager,
            InsertRuntime
        );

        yield* pipe(
            BrowserWindows.Events,
            Stream.filter((Event: BrowserWindow.Event) =>
                (Event._tag === "Closed" || Event._tag === "Hidden")
                && Event.Key === BrowserWindow.Key.Overlay
            ),
            Stream.runForEach(() => Session.ClearFocusPreview),
            Effect.forkScoped({ startImmediately: true })
        );

        // The overlay's own keys (Cancel/Escape, the directional keys, etc.)
        // should only be withheld from other applications while the overlay is
        // actually visible; the Activate keybind stays reserved unconditionally
        // so the overlay can still be summoned.
        yield* pipe(
            BrowserWindows.Events,
            Stream.filter((Event: BrowserWindow.Event) =>
                (Event._tag === "Closed" || Event._tag === "Hidden" || Event._tag === "Shown")
                && Event.Key === BrowserWindow.Key.Overlay
            ),
            Stream.runForEach((Event: BrowserWindow.Event) =>
                Hotkeys.SetOverlayActive(Event._tag === "Shown")),
            Effect.forkScoped({ startImmediately: true })
        );

        // Smoothly animate a held Move- or Resize-direction key instead of
        // relying on the resolved single-press commands above, which only
        // fire once per physical key-down. Releasing the key doesn't
        // interrupt the fiber outright: it flips `Held` to false, and the
        // animation itself keeps running until it settles on the nearest
        // step-size multiple (see AnimateDirectionalHold) before exiting on
        // its own.
        const AnimationScope = yield* Effect.scope;
        const ActiveDirectionalAnimations = new Map<Hotkey.Id, {
            readonly Fiber: Fiber.Fiber<void, unknown>;
            readonly HeldBox: MoveAnimationHeldBox;
        }>();

        const ForceStopDirectionalAnimation = (KeybindId: Hotkey.Id): Effect.Effect<void> =>
            Effect.suspend(() =>
            {
                const Existing = ActiveDirectionalAnimations.get(KeybindId);

                if (Existing === undefined)
                {
                    return Effect.void;
                }

                ActiveDirectionalAnimations.delete(KeybindId);
                return Fiber.interrupt(Existing.Fiber);
            });

        yield* pipe(
            Hotkeys.Matches,
            Stream.runForEach((Activation: Hotkey.Match) => Effect.gen(function*()
            {
                if (Activation.Phase === Hotkey.Phase.Released)
                {
                    const Existing = ActiveDirectionalAnimations.get(Activation.Keybind.Id);

                    if (Existing !== undefined)
                    {
                        Existing.HeldBox.Held = false;
                    }

                    return;
                }

                if (Activation.Phase !== Hotkey.Phase.Pressed)
                {
                    return;
                }

                const Screen = yield* Session.Current;

                if (
                    Screen !== OverlayScreenId.FloatingMove
                    && Screen !== OverlayScreenId.FloatingResize
                    && Screen !== OverlayScreenId.TiledResize
                )
                {
                    return;
                }

                const Definition = GetOverlayCommandDefinitions(Screen).find(
                    (Candidate: OverlayCommandDefinition) =>
                        Candidate.HotkeyId === Activation.Keybind.Id
                );

                if (Definition === undefined)
                {
                    return;
                }

                // A fresh press supersedes any still-settling animation for the
                // same physical key outright, rather than letting it finish.
                yield* ForceStopDirectionalAnimation(Activation.Keybind.Id);

                const HeldBox: MoveAnimationHeldBox = { Held: true };
                const CleanupIfCurrent = Effect.sync(() =>
                {
                    const Current = ActiveDirectionalAnimations.get(Activation.Keybind.Id);

                    if (Current !== undefined && Current.HeldBox === HeldBox)
                    {
                        ActiveDirectionalAnimations.delete(Activation.Keybind.Id);
                    }
                });

                const Animation = Screen === OverlayScreenId.FloatingMove
                    ? AnimateMoveWindow(
                        BrowserWindows,
                        Settings,
                        Session,
                        TilingManager,
                        Definition.Id,
                        HeldBox
                    )
                    : AnimateResizeWindow(
                        BrowserWindows,
                        Settings,
                        Session,
                        TilingManager,
                        Definition.Id,
                        HeldBox
                    );

                const AnimationFiber = yield* Effect.forkIn(
                    Effect.ensuring(Animation, CleanupIfCurrent),
                    AnimationScope
                );
                ActiveDirectionalAnimations.set(Activation.Keybind.Id, { Fiber: AnimationFiber, HeldBox });
            })),
            Effect.forkScoped({ startImmediately: true })
        );

        yield* pipe(
            BrowserWindows.Events,
            Stream.filter((Event: BrowserWindow.Event) =>
                IsBackdropEnabled
                && (Event._tag === "Opened" ? Event.Handle.Key : Event.Key)
                    === BrowserWindow.Key.Overlay
                && Event._tag === "Closed"
            ),
            Stream.runForEach(() => pipe(
                CloseBackdrop(BrowserWindows),
                Effect.ignore({
                    log: "Error",
                    message: "Could not close the overlay backdrop."
                })
            )),
            Effect.forkScoped({ startImmediately: true })
        );

        yield* pipe(
            BrowserWindows.Events,
            Stream.filter((Event: BrowserWindow.Event) =>
                Event._tag === "Closed"
                && Event.Key === BrowserWindow.Key.InsertTarget
            ),
            Stream.runForEach(() =>
            {
                if (InsertRuntime.SuppressNextTargetClose)
                {
                    InsertRuntime.SuppressNextTargetClose = false;
                    return Effect.void;
                }

                return Session.TiledInsertTarget.pipe(
                    Effect.flatMap(Option.match({
                        onNone: () => Effect.void,
                        onSome: () => CancelTiledInsert(
                            BrowserWindows,
                            Session,
                            TilingManager
                        )
                    }))
                );
            }),
            Effect.forkScoped({ startImmediately: true })
        );

        yield* pipe(
            PollTiledInsertTarget(
                BrowserWindows,
                Session,
                TilingManager,
                InsertRuntime
            ),
            Effect.catch((Cause: unknown) => Logging.LogWarning(
                "Overlay.Insert",
                "Could not update the temporary tiled Insert target.",
                Cause
            )),
            Effect.andThen(Effect.sleep("50 millis")),
            Effect.forever,
            Effect.forkScoped({ startImmediately: true })
        );

        yield* pipe(
            Resolver.Commands,
            Stream.runForEach((Command: CommandResolver.Resolved) => pipe(
                Execute(Command),
                Effect.tap(() => Logging.LogDebug(
                    "Command",
                    "Application command completed.",
                    {
                        Category: Command.Category,
                        Command: Command._tag
                    }
                )),
                Effect.ignore({
                    log: "Error",
                    message: `Could not execute ${ Command.Category }.${ Command._tag }.`
                })
            )),
            Effect.forkScoped({ startImmediately: true })
        );

        return { Execute } as const;
    })
);
