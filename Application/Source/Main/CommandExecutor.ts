/**
 * Execute application commands and supervise command-stream processing.
 *
 * @module @sorrell/wm/Main/CommandExecutor
 *
 * @file      CommandExecutor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings.js";
import * as BoxUtility from "./Utility/Math/Box.ts";
import * as BrowserWindow from "./BrowserWindow.js";
import * as CommandResolver from "./CommandResolver.js";
import * as OverlaySession from "./OverlaySession.js";
import type * as Ui from "./Command/Ui.js";
import { Box, IntPoint } from "@sorrell/math";
import { Console, Context, Data, Effect, Layer, Number, Option, Ref, Stream, pipe } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import { AppApiChannel } from "../Shared/Api.js";
import type { BackdropPresentation } from "../Shared/Backdrop.js";
import type { OverlayScreenDto } from "../Shared/OverlayCommand.js";

export/** The service identifier for command execution. */
const TypeId = "~sorrell/wm/Main/CommandExecutor" as const;
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
) => BrowserWindows.ForceClose(BrowserWindow.Key.Backdrop).pipe(
    Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
);

const ShowBackdrop = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Bounds: Box.Box,
    Intensity: number
) => Effect.gen(function*()
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
}).pipe(
    Effect.onError(() => CloseBackdrop(BrowserWindows).pipe(Effect.ignore))
);

const OnActivate = (
    ActivationWindow: Ref.Ref<Option.Option<Handle.HWND>>,
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Settings: AppSettings.Service
) => Effect.gen(function* ()
{
    yield* Ref.set(ActivationWindow, Option.none());

    if (process.env?.["STATIC_OVERLAY"]?.toLowerCase() === "true")
    {
        return yield* Effect.void;
    }

    // @TODO Verify that these min/max values are sensible.
    const ClampWidth = Number.clamp({ maximum: 800, minimum: 320 });
    const ClampHeight = Number.clamp({ maximum: 1024, minimum: 160 });

    const ActivationTarget: Option.Option<OverlayActivationTarget> = pipe(
        Window.GetForegroundWindow(),
        Option.flatMap((ForegroundWindow: Handle.HWND) => pipe(
            Window.GetWindowRect(ForegroundWindow),
            Option.map((ForegroundBox: Box.Box): OverlayActivationTarget =>
            {
                const Width = ClampWidth(Box.Width(ForegroundBox));
                const Height = ClampHeight(Box.Height(ForegroundBox));

                return {
                    ForegroundBounds: ForegroundBox,
                    OverlayBounds: BoxUtility.Center(
                        IntPoint.IntPoint(Width, Height),
                        ForegroundBox
                    ),
                    Window: ForegroundWindow
                };
            })
        ))
    );

    if (Option.isSome(ActivationTarget))
    {
        yield* Ref.set(ActivationWindow, Option.some(ActivationTarget.value.Window));
        yield* Console.log("Overlay activated successfully.");
        yield* BrowserWindows.SetBounds(
            BrowserWindow.Key.Overlay,
            ActivationTarget.value.OverlayBounds
        );

        if (IsBackdropEnabled)
        {
            const BackdropIntensity = yield* Settings.getSetting("OverlayBackdropIntensity");

            yield* ShowBackdrop(
                BrowserWindows,
                ActivationTarget.value.ForegroundBounds,
                BackdropIntensity
            );
        }

        yield* BrowserWindows.Show(BrowserWindow.Key.Overlay);
        // return yield* BrowserWindows.Focus(BrowserWindow.Key.Overlay);
    }
    else
    {
        yield* Console.log(
            "Overlay activation was attempted, but there was no foreground window to overlay."
        );
        return yield* Effect.void;
    }
});

const RestoreActivationWindowFocus = (
    ActivationWindow: Ref.Ref<Option.Option<Handle.HWND>>
) => Ref.getAndSet(ActivationWindow, Option.none()).pipe(
    Effect.flatMap(Option.match({
        onNone: () => Effect.void,
        onSome: (WindowHandle: Handle.HWND) => Effect.sync(() =>
            Window.SetForegroundWindow(WindowHandle)
        ).pipe(
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

const PublishOverlayScreen = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Session: OverlaySession.OverlaySessionImpl
) => Session.Snapshot.pipe(
    Effect.flatMap((Screen: OverlayScreenDto) => BrowserWindows.Send(
        BrowserWindow.Key.Overlay,
        AppApiChannel.OverlayScreenChanged,
        Screen
    ))
);

const ExecuteUi = (
    ActivationWindow: Ref.Ref<Option.Option<Handle.HWND>>,
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
                yield* PublishOverlayScreen(BrowserWindows, Session);
                yield* OnActivate(ActivationWindow, BrowserWindows, Settings);
            });
        case "Deactivate":
            return Session.Reset.pipe(
                Effect.andThen(IsBackdropEnabled
                    ? Effect.all([
                        BrowserWindows.Hide(BrowserWindow.Key.Overlay),
                        CloseBackdrop(BrowserWindows)
                    ], { concurrency: "unbounded", discard: true })
                    : BrowserWindows.Hide(BrowserWindow.Key.Overlay)),
                Effect.andThen(RestoreActivationWindowFocus(ActivationWindow))
            );
        case "BackOverlayScreen":
            return Session.Back.pipe(
                Effect.andThen(Console.log("BackOverlayScreen")),
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "NavigateOverlayScreen":
            return Session.Navigate(Command.ScreenId).pipe(
                Effect.andThen(PublishOverlayScreen(BrowserWindows, Session))
            );
        case "NoOpOverlayCommand":
            return Effect.void;
    }
};

const MakeExecute = (
    ActivationWindow: Ref.Ref<Option.Option<Handle.HWND>>,
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
                    ActivationWindow,
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
        const ActivationWindow = yield* Ref.make(Option.none<Handle.HWND>());
        const Resolver = yield* CommandResolver.CommandResolver;
        const Settings = yield* AppSettings.AppSettings;
        const Session = yield* OverlaySession.OverlaySession;
        const Execute = MakeExecute(ActivationWindow, BrowserWindows, Settings, Session);

        yield* pipe(
            BrowserWindows.Events,
            Stream.filter((Event: BrowserWindow.Event) =>
                IsBackdropEnabled
                && (Event._tag === "Opened" ? Event.Handle.Key : Event.Key)
                    === BrowserWindow.Key.Overlay
                && Event._tag === "Closed"
            ),
            Stream.runForEach(() => CloseBackdrop(BrowserWindows).pipe(
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
