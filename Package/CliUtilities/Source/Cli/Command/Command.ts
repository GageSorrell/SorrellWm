/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Any, Main } from "./Command.Types.js";
import { Effect, pipe } from "effect";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import type { Argument } from "../Handler/Handler.Types.js";
import { Command } from "@effect/cli";
import type { NonEmptyArray } from "effect/Array";

/**
 * For a given command, get the name of that command, such that it will
 * work, even if the command will be run inside of a Windows shell terminal.
 *
 * @note The {@link process!platform} is used to determine whether `.cmd`
 * should be appended.
 *
 * @param {string} PlainName - The name of the command, without `.cmd` appended.
 * @returns {string} The command, with `.cmd` appended, if needed.
 *
 * @example
 * Suppose that the following code belongs to a script that is being run within
 * a Windows shell terminal,
 * ```typescript
 * const MyCommand: string = GetCommandName("MyCommand");
 * // `MyCommand` <- `"MyCommand.cmd"`
 * ```
 *
 * Now suppose that the following code belongs to a script that is *not* being run
 * within a Windows shell terminal,
 * ```typescript
 * const MyCommand: string = GetCommandName("MyCommand");
 * // `MyCommand` <- `"MyCommand"`
 * ```
 */
export function GetCommandName(PlainName: string): string
{
    return process.platform === "win32"
        ? `${ PlainName }.cmd`
        : PlainName;
}

/* eslint-disable @typescript-eslint/no-explicit-any, jsdoc/require-example */

/**
 * Get an "empty" command of a given {@link Name} and {@link Config}, to be equipped
 * with subcommands.
 *
 * @param Name - The name of the command.
 * @param Config - The config, to be shared with subcommands.
 * @returns {Main<typeof Name, typeof Config>} An "empty" command of a given {@link Config}.
 */
export function GetMain<const NameType extends string, const ConfigType extends Command.Command.Config>(
    Name: NameType,
    Config: ConfigType
): Main<typeof Name, typeof Config>
{
    return Command.make(Name, Config, (_: Argument<typeof Config>) => Effect.succeed(undefined));
}

/**
 * Run your CLI tool, given its name, version, and its commands.
 *
 * @param Name - The name of the main command.  This should be the name of the `"bin"` entry
 * in your `package.json`.
 *
 * @param Version - The semver of your CLI tool.
 *
 * @param RootCommand - The root command of your application.
 *
 * @param SubCommands - The optional subcommands to equip your root command with.
 *
 * @see {@link GetMain} The utility function {@link GetMain} may be used for creating
 * the {@link RootCommand} argument.
 */
export function RunCli(
    Name: string,
    Version: string,
    RootCommand: Any
): void;

export function RunCli(
    Name: string,
    Version: string,
    SubCommands: ReadonlyArray<Any>
): void;

export function RunCli(
    Name: string,
    Version: string,
    RootCommand: Any,
    SubCommands: ReadonlyArray<Any>
): void;

export function RunCli(
    Name: string,
    Version: string,
    RootCommandOrSubCommands: Any | ReadonlyArray<Any> = [ ] as const,
    SubCommands: ReadonlyArray<Any> = [ ] as const
): void
{
    const Out: Any = ((): Any =>
    {
        if (Array.isArray(RootCommandOrSubCommands))
        {
            return pipe(
                GetMain(Name, { }),
                Command.withSubcommands(RootCommandOrSubCommands as NonEmptyArray<Any>)
            );
        }
        else
        {
            if (SubCommands.length > 0)
            {
                return pipe(
                    RootCommandOrSubCommands as Any,
                    Command.withSubcommands(SubCommands as NonEmptyArray<Any>)
                );
            }
            else
            {
                return RootCommandOrSubCommands as Any;
            }
        }
    })();

    const CliRunnable: (ArgumentVector: ReadonlyArray<string>) => Effect.Effect<void, any, any> =
        Command.run(
            Out,
            {
                name: Name,
                version: Version
            }
        );

    CliRunnable(process.argv).pipe(
        Effect.provide(NodeContext.layer) as any,
        NodeRuntime.runMain
    );
}

/* eslint-enable jsdoc/require-example */
