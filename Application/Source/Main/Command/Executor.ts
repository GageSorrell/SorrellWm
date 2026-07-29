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
import * as OverlaySession from "../Overlay/Session.ts";
import * as Tiling from "../Tiling/index.ts";
import type * as Ui from "./Ui.ts";
import { Box, IntPoint } from "@sorrell/math";
import {
    Console,
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
    MoveDistance,
    type OverlayCommandDefinition,
    type OverlayCommandId,
    type OverlayScreenDto,
    OverlayScreenId,
    ResizeMode
} from "../../Shared/OverlayCommand.ts";
import { type Handle, Window } from "@sorrell/windows";
import { AppApiChannel } from "../../Shared/Api.ts";
import type { BackdropPresentation } from "../../Shared/Backdrop.ts";
import { DevFeatures } from "../Development/DevFeatures.ts";

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

const OnActivate = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl
) => Effect.gen(function* ()
{
    yield* Session.ClearActivationWindow;
    yield* Session.ClearFocusPreview;

    if ((yield* DevFeatures).StaticOverlay)
    {
        yield* PublishOverlayScreen(BrowserWindows, Session);
        return yield* Effect.void;
    }

    const ActivationTarget: Option.Option<OverlayActivationTarget> = pipe(
        Window.GetForegroundWindow(),
        Option.flatMap(GetActivationTarget)
    );

    if (Option.isSome(ActivationTarget))
    {
        yield* Session.SetActivationWindow(ActivationTarget.value.Window);
        yield* PublishOverlayScreen(BrowserWindows, Session);
        yield* Console.log("Overlay activated successfully.");
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
        yield* Console.log(
            "Overlay activation was attempted, but there was no foreground window to overlay."
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

const FocusDirection = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl,
    Id: OverlayCommandId
) => Effect.gen(function*()
{
    const Target = yield* Session.ResolveFocusTarget(Id);

    if (Option.isNone(Target))
    {
        return;
    }

    const FocusResult = Window.SetForegroundWindow(Target.value);
    if (Result.isFailure(FocusResult))
    {
        yield* Effect.log(FocusResult.failure.Message);
        yield* Effect.log(Target.value);

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

const MoveWindowDirection = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Id: OverlayCommandId
) => Effect.gen(function*()
{
    const UnitsByCommandId = MoveDirectionUnits as
        Readonly<Partial<Record<string, { readonly X: number; readonly Y: number; }>>>;
    const Unit = UnitsByCommandId[Id];
    const ActivationWindow = yield* Session.GetActivationWindow;

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

    // Only floating windows resize directly; tiled windows are resized by the
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
    ) => Effect.Effect<void, BrowserWindow.Error>
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

const ExecuteUi = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl,
    Command: Ui.UiCommand
) =>
{
    switch (Command._tag)
    {
        case "Activate":
            return Effect.gen(function*()
            {
                yield* Session.Reset;
                yield* OnActivate(BrowserWindows, Settings, Session);
            });
        case "Deactivate":
            return pipe(Session.ClearFocusPreview,
                Effect.andThen(Session.Reset),
                Effect.andThen(IsBackdropEnabled
                    ? Effect.all([
                        BrowserWindows.Hide(BrowserWindow.Key.Overlay),
                        CloseBackdrop(BrowserWindows)
                    ], { concurrency: "unbounded", discard: true })
                    : BrowserWindows.Hide(BrowserWindow.Key.Overlay)),
                Effect.andThen(RestoreActivationWindowFocus(Session))
            );
        case "BackOverlayScreen":
            return pipe(
                Session.ClearFocusPreview,
                Effect.andThen(Session.Back),
                Effect.andThen(Console.log("BackOverlayScreen")),
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
        case "NoOpOverlayCommand":
            if (Command.Id.startsWith("FocusMove"))
            {
                return FocusDirection(BrowserWindows, Session, Command.Id);
            }

            if (Command.Id.startsWith("MoveWindow"))
            {
                return MoveWindowDirection(BrowserWindows, Settings, Session, TilingManager, Command.Id);
            }

            if (Command.Id.startsWith("ResizeWindow"))
            {
                return ResizeWindowDirection(BrowserWindows, Settings, Session, TilingManager, Command.Id);
            }

            return Effect.void;
    }
};

const MakeExecute = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl,
    TilingManager: Tiling.Manager.TilingManagerImpl
): CommandExecutorImpl["Execute"] => Effect.fn("CommandExecutor.Execute")(
    function* (Command: CommandResolver.Resolved)
    {
        switch (Command.Category)
        {
            case "Ui":
                return yield* ExecuteUi(
                    BrowserWindows,
                    Settings,
                    Session,
                    TilingManager,
                    Command
                );

            case "Wm":
                return yield* new UnsupportedCommandError({ Command });
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
        const Execute = MakeExecute(BrowserWindows, Settings, Session, TilingManager);

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
            readonly Fiber: Fiber.Fiber<void, Error>;
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
            Resolver.Commands,
            Stream.runForEach((Command: CommandResolver.Resolved) => pipe(
                Execute(Command),
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
