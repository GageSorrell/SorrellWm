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

import * as BrowserWindow from "./BrowserWindow.js";
import * as CommandResolver from "./CommandResolver.js";
import type * as Ui from "./Command/Ui.js";
import { Box, IntPoint } from "@sorrell/math";
import { Console, Context, Data, Effect, Layer, Number, Option, Stream, pipe } from "effect";
import { Utility } from "./index.ts";
import { Window } from "@sorrell/windows";

export/** The service identifier for command execution. */
const TypeId = "~sorrell/wm/Main/CommandExecutor" as const;

/** A recognized command has no executor implementation yet. */
export class UnsupportedCommandError extends
    Data.TaggedError("UnsupportedCommandError")<{
        readonly Command: CommandResolver.Resolved;
    }> { }

/** Any expected failure produced while executing a command directly. */
export type Error = BrowserWindow.Error | UnsupportedCommandError;

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

const OnActivate = (BrowserWindows: BrowserWindow.BrowserWindowImpl) => Effect.gen(function* ()
{
    // @TODO Verify that these min/max values are sensible.
    const ClampWidth = Number.clamp({ maximum: 800, minimum: 320 });
    const ClampHeight = Number.clamp({ maximum: 1024, minimum: 160 });

    const OverlayBox: Option.Option<Box.Box> =
        pipe(
            Option.flatMap(Window.GetForegroundWindow(), Window.GetWindowRect),
            Option.map((ForegroundBox: Box.Box): Box.Box =>
            {
                const Width = ClampWidth(Box.Width(ForegroundBox));
                const Height = ClampHeight(Box.Height(ForegroundBox));

                return Utility.Math.Box.Center(IntPoint.IntPoint(Width, Height), ForegroundBox);
            })
        );

    if (Option.isSome(OverlayBox))
    {
        yield* Console.log("Overlay activated successfully.");
        return yield* Effect.all([
            BrowserWindows.SetBounds("Overlay", OverlayBox.value),
            BrowserWindows.Show(BrowserWindow.Key.Overlay),
            BrowserWindows.Focus(BrowserWindow.Key.Overlay)
        ]);
    }
    else
    {
        yield* Console.log(
            "Overlay activation was attempted, but there was no foreground window to overlay."
        );
        return yield* Effect.succeed<void>(undefined);
    }
});

const ExecuteUi = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl,
    Command: Ui.UiCommand
) =>
{
    switch (Command._tag)
    {
        case "Activate":
            return OnActivate(BrowserWindows);
        case "Deactivate":
            return BrowserWindows.Hide(BrowserWindow.Key.Overlay);
    }
};

const MakeExecute = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl
): CommandExecutorImpl["Execute"] => Effect.fn("CommandExecutor.Execute")(
    function* (Command: CommandResolver.Resolved)
    {
        switch (Command.Category)
        {
            case "Ui":
                return yield* ExecuteUi(BrowserWindows, Command);

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
        const Execute = MakeExecute(BrowserWindows);

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
