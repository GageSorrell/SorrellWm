/**
 * @file      Effect.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Types } from "effect";
import type { ConfigArgument, FGlobalRequirements, TRequirements, TRequirementsArgument } from "../Options/Options.Types.js";
import type { ConfigOverloadedArgument } from "./Effect.Internal.js";
import type { CliCommand, CommandFn } from "./Effect.Types.js";
import type { Command } from "@effect/cli";
import type { Args } from "@effect/cli/Args";
import type { Options } from "@effect/cli/Options";

export type ConfigOverloadedArgumentType = typeof ConfigOverloadedArgument;

export type OverloadedRequirementsArgument<ConfigType extends ConfigArgument<TRequirements> | undefined | TRequirementsArgument<TRequirements>> =
    ConfigType extends undefined
        ? TRequirementsArgument<FGlobalRequirements>
        : ConfigType extends ConfigArgument<infer R>
            ? TRequirementsArgument<R>
            : ConfigType extends TRequirementsArgument<infer R>
                ? TRequirementsArgument<R>
                : never;

export type ParseConfig<A extends Command.Command.Config> =
    Types.Simplify<{
        readonly [Key in keyof A]: ParseConfigValue<A[Key]>;
    }>;

type ParseConfigValue<A> =
    A extends ReadonlyArray<infer _>
        ? { readonly [Key in keyof A]: ParseConfigValue<A[Key]> }
        : A extends Args<infer Value>
            ? Value
            : A extends Options<infer Value>
                ? Value
                : A extends Command.Command.Config
                    ? ParseConfig<A>
                    : never;

export type MakeCommandReturnType<
    NameType extends string,
    ConfigType extends ConfigArgument<TRequirements> | undefined
> =
    ConfigType extends undefined
        ? CliCommand<NameType, FGlobalRequirements>
        : ConfigType extends ConfigArgument<infer R>
            ? CliCommand<NameType, R>
            : never;

export type OverloadedCommandFn<A, ConfigType extends ConfigArgument<TRequirements> | undefined | TRequirementsArgument<TRequirements>> =
    ConfigType extends undefined
        ? CommandFn<A, FGlobalRequirements>
        : ConfigType extends ConfigArgument<infer R>
            ? CommandFn<A, R>
            : ConfigType extends TRequirementsArgument<infer R>
                ? CommandFn<A, TRequirements<R>>
                : never;

export type MakeCommandOverloadedCommandFn<A, ConfigType extends ConfigArgument<TRequirements> | undefined> =
    ConfigType extends undefined
        ? CommandFn<A, FGlobalRequirements>
        : ConfigType extends ConfigArgument<infer R>
            ? CommandFn<A, R>
            : never;
