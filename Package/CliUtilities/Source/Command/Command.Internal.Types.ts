/**
 * @file      Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args } from "@effect/cli/Args";
import type { Command } from "@effect/cli";
import type { Options } from "@effect/cli/Options";
import type { Types } from "effect";

export type ParseConfig<ConfigType extends Config> =
    Types.Simplify<Readonly<{
        [ Key in keyof ConfigType ]: ParseConfigValue<ConfigType[Key]>;
    }>>;


export type ParseConfigValue<ConfigType> =
    ConfigType extends ReadonlyArray<infer _>
        ? { readonly [Key in keyof ConfigType]: ParseConfigValue<ConfigType[Key]> }
        : ConfigType extends Args<infer Value>
            ? Value
            : ConfigType extends Options<infer Value>
                ? Value
                : ConfigType extends Command.Command.Config
                    ? ParseConfig<ConfigType>
                    : never;
