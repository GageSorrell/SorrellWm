/**
 * @file      Effect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import type { CliCommand, CommandFn } from "./Effect.Types.js";
import type { Config, ConfigArgument, FGlobalRequirements, TRequirements, TRequirementsArgument } from "../Options/Options.Types.js";
import type { MakeCommandOverloadedCommandFn, MakeCommandReturnType, OverloadedCommandFn, OverloadedRequirementsArgument } from "./Effect.Internal.Types.js";
import { Command } from "@effect/cli";
import { DefaultGlobalOptions, GlobalOptions } from "../Options/Options.js";

export function TryPromise<A, R extends FGlobalRequirements>(
    CommandFn: CommandFn<A, R>
): Effect.Effect<A, never, never>;
export function TryPromise<A, R extends TRequirements>(
    CommandFn: CommandFn<A, R>,
    Config: ConfigArgument<R>
): Effect.Effect<A, never, never>;
export function TryPromise<A, R extends TRequirements>(
    CommandFn: CommandFn<A, R>,
    Config: TRequirementsArgument<R>
): Effect.Effect<A, never, never>;
export function TryPromise<A, R extends TRequirements>(
    CommandFn: OverloadedCommandFn<A, typeof InConfig>,
    InConfig?: ConfigArgument<R> | TRequirementsArgument<R>
): Effect.Effect<A, never, never>
{
    const Requirements: OverloadedRequirementsArgument<typeof InConfig> =
        (InConfig === undefined)
            ? DefaultGlobalOptions
            : {
                ...DefaultGlobalOptions,
                ...InConfig
            };

    function Wrapper(_Signal: AbortSignal): PromiseLike<A>
    {
        return CommandFn(Requirements);
    }

    return Effect.tryPromise({
        catch: (Cause: unknown) =>
        {
            console.error(Cause);
        },
        try: Wrapper
    }).pipe(
        Effect.catchAll((Cause: unknown) => Effect.die(Cause))
    );
}

export function MakeCommand<NameType extends string, A>(
    Name: NameType,
    CommandFn: CommandFn<A, FGlobalRequirements>,
): MakeCommandReturnType<typeof Name, undefined>
export function MakeCommand<
    NameType extends string,
    A,
    R extends TRequirements
>(
    Name: NameType,
    CommandFn: CommandFn<A, R>,
    Config: ConfigArgument<R>
): MakeCommandReturnType<typeof Name, typeof Config>
export function MakeCommand<
    NameType extends string,
    A,
    R extends TRequirements
>(
    Name: NameType,
    CommandFn: MakeCommandOverloadedCommandFn<A, typeof InConfig>,
    InConfig:
        | ConfigArgument<R>
        | undefined = undefined
): MakeCommandReturnType<typeof Name, typeof InConfig>
{
    if (InConfig === undefined)
    {
        return Command.make(
            Name,
            GlobalOptions,
            (Options): Effect.Effect<void, never, never> =>
            {
                return TryPromise(CommandFn, Options);
            }
        );
    }
    else
    {
        return Command.make(
            Name,
            InConfig,
            (Options): Effect.Effect<void, never, never> =>
            {
                return TryPromise(CommandFn, Options as ConfigArgument<R>);
            }
        ) as unknown as MakeCommandReturnType<NameType, R>;
    }
}
