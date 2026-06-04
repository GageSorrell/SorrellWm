/**
 * This module extends {@link https://effect-ts.github.io/effect/cli/Command.ts.html | the original}
 * by applying the relevant contents of the extended {@link \@sorrell/cli/BuiltInOptions} module.
 *
 * @module @sorrell/effect-cli/Command
 */

/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/typedef */

import type * as CliApp from "./CliApp.js";
import type * as EffectCommand from "@effect/cli/Command";
import type { Effect } from "effect/Effect";
import { RunWithPowerShellCompletions } from "./Internal/Command.js";
import type { ValidationError } from "./ValidationError.js";

export * from "@effect/cli/Command";

export interface PowerShellCommandRunOptions<A>
    extends Omit<CliApp.CliApp.ConstructorArgs<A>, "command">
{
    readonly powerShellCommandNames?: ReadonlyArray<string>;
}

type CommandRunEffect<Requirements, Error> =
    (Arguments: ReadonlyArray<string>) => Effect<
        void,
        Error | ValidationError,
        Requirements | CliApp.CliApp.Environment
    >;

export interface Run
{
    (
        Options: PowerShellCommandRunOptions<unknown>
    ): <Name extends string, Requirements, Error, Value>(
        CommandValue: EffectCommand.Command<Name, Requirements, Error, Value>
    ) => CommandRunEffect<Requirements, Error>;

    <Name extends string, Requirements, Error, Value>(
        CommandValue: EffectCommand.Command<Name, Requirements, Error, Value>,
        Options: PowerShellCommandRunOptions<Value>
    ): CommandRunEffect<Requirements, Error>;
}

export/**
       * @since 1.0.0
       * @category conversions
       */
const run = ((
    FirstArgument: unknown,
    SecondArgument?: unknown
) =>
{
    if (SecondArgument === undefined)
    {
        const Options: PowerShellCommandRunOptions<unknown> =
            FirstArgument as PowerShellCommandRunOptions<unknown>;

        return <Name extends string, Requirements, Error, Value>(
            CommandValue: EffectCommand.Command<Name, Requirements, Error, Value>
        ): CommandRunEffect<Requirements, Error> =>
            RunWithPowerShellCompletions(
                CommandValue,
                Options
            );
    }

    return RunWithPowerShellCompletions(
        FirstArgument as EffectCommand.Command<string, unknown, unknown, unknown>,
        SecondArgument as PowerShellCommandRunOptions<unknown>
    );
}) as Run;
