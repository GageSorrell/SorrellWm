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
import * as OverlaySession from "../Overlay/Session.ts";
import type * as Ui from "./Ui.ts";
import { Box, IntPoint } from "@sorrell/math";
import { Console, Context, Data, Effect, Layer, Number, Option, Result, Stream, pipe } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import type { OverlayCommandId, OverlayScreenDto } from "../../Shared/OverlayCommand.ts";
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

const GetActivationTarget = (
    TargetWindow: Handle.HWND
): Option.Option<OverlayActivationTarget> => pipe(
    Window.GetWindowRect(TargetWindow),
    Option.map((ForegroundBox: Box.Box): OverlayActivationTarget =>
    {
        const Width = ClampOverlayWidth(Box.Width(ForegroundBox));
        const Height = ClampOverlayHeight(Box.Height(ForegroundBox));

        return {
            ForegroundBounds: ForegroundBox,
            OverlayBounds: BoxUtility.Center(
                IntPoint.IntPoint(Width, Height),
                ForegroundBox
            ),
            Window: TargetWindow
        };
    })
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
        return yield* new WindowFocusRestorationError({
            Message: FocusResult.failure.Message,
            Window: Target.value
        });
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
        case "NoOpOverlayCommand":
            return Command.Id.startsWith("FocusMove")
                ? FocusDirection(BrowserWindows, Session, Command.Id)
                : Effect.void;
    }
};

const MakeExecute = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service,
    Session: OverlaySession.OverlaySessionImpl
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
        const Execute = MakeExecute(BrowserWindows, Settings, Session);

        yield* pipe(
            BrowserWindows.Events,
            Stream.filter((Event: BrowserWindow.Event) =>
                (Event._tag === "Closed" || Event._tag === "Hidden")
                && Event.Key === BrowserWindow.Key.Overlay
            ),
            Stream.runForEach(() => Session.ClearFocusPreview),
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
