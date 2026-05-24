#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Command } from "@effect/cli";
import { Effect } from "effect";

/** The entry-point for commands provided by this package. */
async function Main(): Promise<void>
{
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    const MainCommand: Command.Command<"code-auger", never, never, { }> =
        Command.make("code-auger", { }, (_: object): Effect.Effect<void, never, never> =>
        {
            return Effect.succeed(undefined);
        });

    const version: string = "v0.1.0";

    /* eslint-disable @typescript-eslint/typedef */

    const SubCommands =
        [
            // CreateConfigCommand,
            // GenerateCommand
        ] as const;

    const CliFn =
        Command.run(
            MainCommand,
            // MainCommand.pipe(Command.withSubcommands(SubCommands)),
            {
                name: "code-auger",
                version
            }
        );

    /* eslint-enable @typescript-eslint/typedef */

    CliFn(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
}

Main();
