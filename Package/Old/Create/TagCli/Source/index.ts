#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Command } from "@sorrell/effect/unstable/cli";
import { Effect } from "effect";

/** The entry-point for this package's (only) command. */
async function Main(): Promise<void>
{
        const MainCommand: Command.Command<"@sorrell/cli", never, never, { }> =
        Command.make("@sorrell/cli", { }, (_: object): Effect.Effect<void, never, never> =>
        {
            return Effect.succeed(undefined);
        });

    const version: string = "v0.0.12";

    /* eslint-disable @typescript-eslint/typedef */

    const CliFn =
        Command.run(
            MainCommand.pipe(Command.withSubcommands(SubCommands)),
            {
                name: "@sorrell/cli",
                version
            }
        );

    /* eslint-enable @typescript-eslint/typedef */

    CliFn(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
}

Main();
