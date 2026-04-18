#!/usr/bin/env node

/* File:      Bin.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Command, Options } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect } from "effect";
import { GetPackageJson } from "../Npm/Npm.js";
import type { IPackageJson } from "package-json-type";
import { PublishWithPatchOnVersionConflict } from "./PublishBumpSafe.js";

/** The entry-point for commands provided by this package. */
async function Main(): Promise<void>
{
    const SilentOption: Options.Options<boolean> = Options.boolean("silent").pipe(Options.withAlias("s"));

    type Requirements =
        {
            readonly SilentOption: boolean;
        };

    const MainCommand: Command.Command<"@sorrell/utilities", never, never, object> =
        Command.make("@sorrell/utilities", { }, (_: object): Effect.Effect<void, never, never> =>
        {
            return Effect.succeed(undefined);
        });

    const PublishCommand: Command.Command<"publish", never, never, Requirements> =
        Command.make("publish", { SilentOption }, (
            { SilentOption }: Requirements
        ): Effect.Effect<void, never, never> =>
        {
            return Effect.tryPromise({
                catch: (Cause: unknown) =>
                {
                    console.error(Cause);
                },
                try: PublishWithPatchOnVersionConflict(SilentOption)
            }).pipe(
                Effect.catchAll((Cause: unknown) => Effect.die(Cause))
            );
        });

    const version: string = await (async (): Promise<string> =>
    {
        try
        {
            const PackageJson: IPackageJson = await Effect.runPromise(GetPackageJson());
            return PackageJson.version || "";
        }
        catch
        {
            return "";
        }
    })();

    const cli: ReturnType<typeof Command.run> = Command.run(
        MainCommand.pipe(Command.withSubcommands([ PublishCommand ])),
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
