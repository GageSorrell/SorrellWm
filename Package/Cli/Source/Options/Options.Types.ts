/**
 * @file      Options.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Command, Options } from "@sorrell/effect/unstable/cli";
import type { FGlobalConfig } from "../Config/Config.Types.js";
import type { Simplify } from "effect/Types";

export type FGlobalOptions = TOptions<FGlobalConfig>;

export type TOptionsBase<ConfigType extends Command.Command.Config> =
    {
        readonly [ Key in keyof ConfigType ]:
        ConfigType[Key] extends Args.Args<infer Type>
            ? Type
            : ConfigType[Key] extends Options.Options<infer Type>
                ? Type
                : never;
    };

export type TLocalOptions<ConfigType extends Command.Command.Config> =
    Omit<TOptionsBase<ConfigType>, keyof FGlobalConfig>;

// export type TOptions<ConfigType extends Command.Command.Config> =
//     TOptionsBase<FGlobalConfig> &
//     TOptionsBase<ConfigType>;
export type TOptions<ConfigType extends Command.Command.Config> =
    Simplify<Simplify<
        {
            readonly [Key in keyof ConfigType]: Command.Command.ParseConfigValue<ConfigType[Key]>;
        } &
        {
            readonly [Key in keyof FGlobalConfig]: Command.Command.ParseConfigValue<FGlobalConfig[Key]>;
        }
    >>;

/* eslint-disable @typescript-eslint/no-explicit-any */

// export type TOptionsFromCommand<CommandType extends FCommandAny> =
//     CommandType extends Command.Command<any, any, any, infer OptionsType>
//         ? OptionsType
//         : never;

/* eslint-enable @typescript-eslint/no-explicit-any */
