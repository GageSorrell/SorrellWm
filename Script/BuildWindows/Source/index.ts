#!/usr/bin/env node

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Command } from "@effect/cli";
import { Effect } from "effect";
import { GetVersion } from "../Command/Command.js";
import { IndexCommand } from "../Index/IndexCommand.js";
import { InitCommand } from "../Init/Init.js";

/** The entry-point for commands provided by this package. */
async function Main(): Promise<void>
{
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    const MainCommand: Command.Command<"@sorrell/cli", never, never, { }> =
        Command.make("@sorrell/build-windows", { }, (_: object): Effect.Effect<void, never, never> =>
        {
            return Effect.succeed(undefined);
        });

    /* eslint-disable @typescript-eslint/no-explicit-any */

    const version: string = await GetVersion();

    /* eslint-enable @typescript-eslint/no-explicit-any */

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SubCommands =
        [
            InitCommand,
            IndexCommand
            // UpdateCommand
            // IndexCommand,
            // InitCommand,
            // PublishCommand
        ] as const;

    // const cli: ReturnType<typeof Command.run> = Command.run(
    //     MainCommand.pipe(Command.withSubcommands(SubCommands)),
    //     {
    //         name: "@sorrell/cli",
    //         version
    //     }
    // );

    // const ArgumentVector: Array<string> = process.argv.length === 2
    //     ? [ ...process.argv, "--help" ]
    //     : process.argv;

    // cli(ArgumentVector).pipe(
    //     // @ts-expect-error Nasty type stuff.
    //     Effect.provide(NodeContext.layer),
    //     NodeRuntime.runMain
    // );

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const CliFn =
        Command.run(
            MainCommand.pipe(Command.withSubcommands(SubCommands)),
            {
                name: "@sorrell/cli",
                version
            }
        );

    CliFn(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
}

Main();

    "cmake-step": "cmake-js compile --out ../Build",

