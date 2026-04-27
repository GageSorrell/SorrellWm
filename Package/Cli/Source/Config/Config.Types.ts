/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command, Options } from "@effect/cli";
import type { ConfigSchema } from "./Config.Internal.js";
import type { FConfigBase } from "./Config.Internal.Types.js";
import type { FGlobalOptions } from "../Options/Options.Types.js";
import type { Simplify } from "effect/Types";

export type TConfigBase<BaseType extends FConfigBase> =
    [ Extract<keyof BaseType, keyof FGlobalOptions> ] extends [ never ]
        ? BaseType
        : never;

export type FGlobalConfig =
    {
        silent: Options.Options<boolean>;
    };

export type TLocalConfig<ConfigType extends FConfigBase> =
    Omit<ConfigType, keyof FGlobalConfig>;

export type TConfig<BaseType extends Command.Command.Config> =
    BaseType & FGlobalConfig;

export type FCliConfigSchema = typeof ConfigSchema.Type;
