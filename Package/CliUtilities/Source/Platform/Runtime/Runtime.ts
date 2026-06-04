/**
 * @file      Runtime.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/informative-docs, jsdoc/require-example */

import type * as Sorrell from "../../Cli/index.js";
import { Effect, pipe } from "effect";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Command } from "@sorrell/effect/unstable/cli";
import type { RunOptions } from "./Runtime.Types.js";

/**
 * Run your CLI tool, given its name, version, and its commands.
 *
 * @param Name - The name of the CLI application.
 *
 * @param Version - The version of the CLI application.
 *
 * @param Options - The {@link RunOptions | options} object to specify command(s) and runtime options.
 *
 * @template NameType - The name of the root command.
 * @template ConfigType - The config type of the root command.
 * @template ErrorType - The error type of the root command.
 * @template RequirementsType - The requirements type of the root command.
 * @template SubcommandsErrorType - The error type of the subcommands.
 * @template SubcommandsRequirementsType - The requirements type of the subcommands.
 */
export function Run<
    NameType extends string,
    ConfigType extends Command.Command.Config,
    ErrorType,
    RequirementsType,
    SubcommandsErrorType,
    SubcommandsRequirementsType
>(
    Name: NameType,
    Version: string,
    Options: RunOptions<
        typeof Name,
        ConfigType,
        ErrorType,
        RequirementsType,
        SubcommandsErrorType,
        SubcommandsRequirementsType
    >
): void
{
    const {
        RootCommand,
        RuntimeOptions,
        Subcommands
    } = Options;

    const ApplicationCommand: Sorrell.Command.Any =
        (Subcommands !== undefined
            ? pipe(
                RootCommand,
                Command.withSubcommands(Subcommands)
            )
            : RootCommand) as Sorrell.Command.Any;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Runner: Sorrell.Command.Cli<any, any> =
        Command.run(
            ApplicationCommand,
            {
                name: Name,
                version: Version
            }
        );

    if (RuntimeOptions !== undefined)
    {
        Runner(process.argv).pipe(
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            Effect.provide(NodeContext.layer) as any,
            NodeRuntime.runMain(RuntimeOptions)
        );
    }
    else
    {
        Runner(process.argv).pipe(
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            Effect.provide(NodeContext.layer) as any,
            NodeRuntime.runMain
        );
    }

}
