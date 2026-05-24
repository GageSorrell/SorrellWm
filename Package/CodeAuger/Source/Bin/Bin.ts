#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@effect/cli";
import { Effect } from "effect";
import { GetCliRunner } from "@sorrell/cli-utilities/command";
import { ProvidersCommand } from "./Provider/ProvidersCommand.js";

/** The entry-point for commands provided by this package. */
async function Main(): Promise<void>
{
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    const MainCommand: Command.Command<"@sorrell/cli", never, never, { }> =
        Command.make("@sorrell/cli", { }, (_: object): Effect.Effect<void, never, never> =>
        {
            return Effect.succeed(undefined);
        });

    const version: string = "v0.1.8";

    /* eslint-disable @typescript-eslint/typedef */

    const CliFn =
        Command.run(
        );

    /* eslint-enable @typescript-eslint/typedef */

    CliFn(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);

    GetCliRunner("code-auger", version, [ ...ConsumerCommands, ProvidersCommand ])();
}

Main();

