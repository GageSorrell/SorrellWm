/**
 * @file      Options.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Command, Options } from "@effect/cli";

export type FGlobalConfig =
    {
        Silent: Options.Options<boolean>;
    };

export type FGlobalArguments = TOptionsFromConfig<FGlobalConfig>;

export type TOptionsFromConfig<ConfigType extends Command.Command.Config> =
    {
        readonly [ Key in keyof ConfigType ]:
        ConfigType[Key] extends Args.Args<infer Type>
            ? Type
            : ConfigType[Key] extends Options.Options<infer Type>
                ? Type
                : never;
    };

export type TCommandOptionsFromConfig<ConfigType extends Command.Command.Config> =
    TOptionsFromConfig<ConfigType> &
    {
        readonly [ Key in keyof FGlobalConfig ]:
        FGlobalConfig[Key] extends Args.Args<infer Type>
            ? Type
            : FGlobalConfig[Key] extends Options.Options<infer Type>
                ? Type
                : never;
    };

export type FConfigBase =
    Record<
        string,
        | Args.Args<unknown>
        | Options.Options<unknown>
    >;

export type TMakeConfig<ConfigType extends FConfigBase> = Readonly<ConfigType>;

export type TMakeCommandConfig<BaseType extends FConfigBase> =
    [ Extract<keyof BaseType, keyof FGlobalConfig> ] extends [ never ]
        ? Readonly<BaseType & FGlobalConfig>
        : never;
