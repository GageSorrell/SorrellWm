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
    OverlayScreenId
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

const AnimateMoveWindow = (
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

    if (Unit === undefined)
    {
        return;
    }

    yield* Effect.sleep(Duration.millis(MoveAnimationInitialDelayMillis));

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
    let CarryPixelsX = 0;
    let CarryPixelsY = 0;

    yield* pipe(
        Effect.gen(function*()
        {
            const PixelsPerSecond = yield* GetActiveMovePixelsPerSecond(Settings, Session);
            const PixelsPerFrame = PixelsPerSecond * (FrameIntervalMillis / 1000);

            CarryPixelsX += Unit.X * PixelsPerFrame;
            CarryPixelsY += Unit.Y * PixelsPerFrame;

            const StepX = Math.trunc(CarryPixelsX);
            const StepY = Math.trunc(CarryPixelsY);

            CarryPixelsX -= StepX;
            CarryPixelsY -= StepY;

            const CurrentActivationWindow = yield* Session.GetActivationWindow;

            if (Option.isNone(CurrentActivationWindow))
            {
                return;
            }

            yield* MoveWindowByOffset(
                BrowserWindows,
                Session,
                TilingManager,
                CurrentActivationWindow.value,
                StepX,
                StepY
            );
        }),
        Effect.andThen(Effect.sleep(Duration.millis(FrameIntervalMillis))),
        Effect.forever
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
        case "NoOpOverlayCommand":
            if (Command.Id.startsWith("FocusMove"))
            {
                return FocusDirection(BrowserWindows, Session, Command.Id);
            }

            if (Command.Id.startsWith("MoveWindow"))
            {
                return MoveWindowDirection(BrowserWindows, Settings, Session, TilingManager, Command.Id);
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

        // Smoothly animate a held Move-direction key instead of relying on the
        // resolved single-press commands above, which only fire once per
        // physical key-down.
        const AnimationScope = yield* Effect.scope;
        const ActiveMoveAnimations = new Map<Hotkey.Id, Fiber.Fiber<void, Error>>();

        const StopMoveAnimation = (KeybindId: Hotkey.Id): Effect.Effect<void> =>
            Effect.suspend(() =>
            {
                const ExistingFiber = ActiveMoveAnimations.get(KeybindId);

                if (ExistingFiber === undefined)
                {
                    return Effect.void;
                }

                ActiveMoveAnimations.delete(KeybindId);
                return Fiber.interrupt(ExistingFiber);
            });

        yield* pipe(
            Hotkeys.Matches,
            Stream.runForEach((Activation: Hotkey.Match) => Effect.gen(function*()
            {
                if (Activation.Phase === Hotkey.Phase.Released)
                {
                    yield* StopMoveAnimation(Activation.Keybind.Id);
                    return;
                }

                if (Activation.Phase !== Hotkey.Phase.Pressed)
                {
                    return;
                }

                const Screen = yield* Session.Current;

                if (Screen !== OverlayScreenId.Move)
                {
                    return;
                }

                const Definition = GetOverlayCommandDefinitions(OverlayScreenId.Move).find(
                    (Candidate: OverlayCommandDefinition) =>
                        Candidate.HotkeyId === Activation.Keybind.Id
                );

                if (Definition === undefined)
                {
                    return;
                }

                yield* StopMoveAnimation(Activation.Keybind.Id);

                const AnimationFiber = yield* Effect.forkIn(
                    AnimateMoveWindow(BrowserWindows, Settings, Session, TilingManager, Definition.Id),
                    AnimationScope
                );
                ActiveMoveAnimations.set(Activation.Keybind.Id, AnimationFiber);
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
