#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect } from "effect";
import { GetPackageJson } from "@sorrell/utilities/npm";
import type { IPackageJson } from "package-json-type";
import { PublishCommand } from "../Publish/index.js";
import { IndexCommand } from "../Index/IndexCommand.js";
import { InitCommand } from "../Init/Init.js";
import type { CliCommand } from "../Effect/Effect.Types.js";

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

        type SubCommandArray = readonly [
            Command.Command<any, any, any, any>,
            ...Array<Command.Command<any, any, any, any>>
        ];

        const SubCommands: SubCommandArray =
        [
            IndexCommand,
            InitCommand,
            PublishCommand
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
