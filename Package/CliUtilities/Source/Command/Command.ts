/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Any, MainCommand } from "./Command.Types.js";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Command } from "@effect/cli";
import { Effect } from "effect";
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
 * Get an "empty" command, with your application's commands piped to it as subcommands.
 *
 * @param Name - The name of the main command.  This should be the name of the `"bin"` entry
 * in your `package.json`.
 *
 * @param SubCommands - The subcommands of the {@link Command.Command | command} that this returns.
 *
 * @returns {MainCommand<typeof Name>} The "empty" command of the given {@link Name}, and
 * given {@link SubCommands}.
 */
export function GetMain(
    Name: string,
    SubCommands: NonEmptyArray<Any>
): MainCommand<typeof Name>
{
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    const MainCommand: Command.Command<typeof Name, any, any, { }> =
        Command.make(Name, { }, (_: object): Effect.Effect<void, any, any> => Effect.succeed(undefined));

    return MainCommand.pipe(Command.withSubcommands(SubCommands));
}

/**
 * Run your CLI tool, given its name, version, and its commands.
 *
 * @param Name - The name of the main command.  This should be the name of the `"bin"` entry
 * in your `package.json`.
 *
 * @param Version - The semver of your CLI tool.
 *
 * @param SubCommands - The commands of your application.
 */
export function RunCli(
    Name: string,
    Version: string,
    SubCommands: NonEmptyArray<Any>
): void
{
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    const MainCommand: Command.Command<typeof Name, any, any, { }> =
        Command.make(Name, { }, (_: object): Effect.Effect<void, any, any> => Effect.succeed(undefined));

    const CliRunnable: (ArgumentVector: ReadonlyArray<string>) => Effect.Effect<void, any, any> =
        Command.run(
            MainCommand.pipe(Command.withSubcommands(SubCommands)),
            {
                name: "code-auger",
                version: Version
            }
        );

    CliRunnable(process.argv).pipe(
        Effect.provide(NodeContext.layer) as any,
        NodeRuntime.runMain
    );
}

/* eslint-enable jsdoc/require-example */
