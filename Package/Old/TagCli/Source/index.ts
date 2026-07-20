#!/usr/bin/env node

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Command } from "@sorrell/effect/unstable/cli";
import { Effect } from "effect";
import { GenerateCommand } from "./Generate/index.js";
import { InitCommand } from "./Init/index.js";
import { ValidateCommand } from "./Validate/index.js";

/** The entry-point for commands provided by this package. */
async function Main(): Promise<void>
{
        const MainCommand: Command.Command<"ts-tag", never, never, { }> =
        Command.make("ts-tag", { }, (_: object): Effect.Effect<void, never, never> =>
        {
            return Effect.succeed(undefined);
        });

    const version: string = "v0.0.1";

    /* eslint-disable @typescript-eslint/typedef */

    const SubCommands =
        [
            GenerateCommand,
            InitCommand,
            ValidateCommand
        ] as const;

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

