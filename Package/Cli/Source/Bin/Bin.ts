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
import { GetVersion } from "../Command/Command.js";
import type { TNonemptyArray } from "@sorrell/utilities/array";
import { UpdateCommand } from "../Update/index.js";

/**
 * The entry-point for commands provided by this package.
 */
async function Main(): Promise<void>
{
    const MainCommand: Command.Command<"@sorrell/utilities", never, never, object> =
        Command.make("@sorrell/utilities", { }, (_: object): Effect.Effect<void, never, never> =>
        {
            return Effect.succeed(undefined);
        });

    /* eslint-disable @typescript-eslint/no-explicit-any */

    const version: string = await GetVersion();

    type TSubCommandArray = TNonemptyArray<Command.Command<any, any, any, any>>;

    /* eslint-enable @typescript-eslint/no-explicit-any */

    const SubCommands: TSubCommandArray =
        [
            UpdateCommand
            // IndexCommand,
            // InitCommand,
            // PublishCommand
        ];

    const cli: ReturnType<typeof Command.run> = Command.run(
        MainCommand.pipe(Command.withSubcommands(SubCommands)),
        {
            name: "@sorrell/utilities",
            version
        }
    );

    const ArgumentVector: Array<string> = process.argv.length === 2
        ? [ ...process.argv, "--help" ]
        : process.argv;

    cli(ArgumentVector).pipe(
        // @ts-expect-error Nasty type stuff.
        Effect.provide(NodeContext.layer),
        NodeRuntime.runMain
    );
}

Main();
