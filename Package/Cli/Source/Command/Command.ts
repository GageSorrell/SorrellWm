/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { And, InvalidData, MissingData, Or, SourceUnavailable, Unsupported } from "effect/ConfigError";
import { type CliApp, Command, type ValidationError } from "@effect/cli";
import { FStepService, GetWithStep } from "../Effect/Effect.js";
import type { TCommand, TCommandMain } from "./Command.Types.js";
import { ConfigProvider } from "../Config/Config.js";
import { Effect } from "effect";
import type { FGlobalConfig } from "../Config/Config.Types.js";
import type { FGlobalOptions } from "../Options/Options.Types.js";
import { NodeContext } from "@effect/platform-node";
import type { Simplify } from "effect/Types";

// function GetCommandMain<
//     ConfigType extends Command.Command.Config,
//     ErrorType,
//     RequirementsType
// >(
//     Main: TMainFunction<ConfigType, ErrorType, RequirementsType>
// ): TMainFunction<ConfigType, ErrorType, RequirementsType>
// {
//     type ThisEffect = ReturnType<TMainFunction<ConfigType, ErrorType, RequirementsType>>;
//     return function(Options: TProvidedOptions<ConfigType>): ThisEffect
//     {
//         return Effect.withConfigProvider(Main(Options), ConfigProvider);
//     };
// }

// export/**
//        * All CLI commands have `version` that is this package's version.
//        *
//        * @throws {Error} If it cannot find or get a valid semver from this package's `package.json`.
//        */
// function MakeCommand<
//     NameType extends string,
//     ConfigType extends Command.Command.Config,
//     RequirementsType,
//     ErrorType
// >(
//     Name: NameType,
//     Config: ConfigType,
//     MainFunction: TMainFunction<typeof Config, ErrorType, RequirementsType>
// ): TCommand<typeof Name, typeof Config, ErrorType, RequirementsType>
// {
//     return Command.make(
//         Name,
//         Config,
//         GetCommandMain<typeof Config, ErrorType, RequirementsType>(MainFunction)
//     );
// }

export function MakeCommand<
    NameType extends string,
    ConfigType extends Command.Command.Config & FGlobalConfig,
    ErrorType,
    RequirementsType extends NodeContext.NodeContext
>(
    Name: NameType,
    Config: ConfigType,
    Main: TCommandMain<ConfigType, ErrorType, RequirementsType>
): TCommand<typeof Name, typeof Config, ErrorType, RequirementsType>
{
    type ThisOptions = Simplify<
        Simplify<{
            readonly [Key in keyof ConfigType]: Command.Command.ParseConfigValue<ConfigType[Key]>;
        }>
    >;

    type ThisErrorType =
        | ErrorType
        | ValidationError.ValidationError
        | And
        | Or
        | InvalidData
        | MissingData
        | SourceUnavailable
        | Unsupported;

    type ThisEffect = Effect.Effect<
        void,
        ThisErrorType,
        Exclude<RequirementsType, FStepService> | CliApp.CliApp.Environment
    >;

    return Command.make(
        Name,
        Config,
        (Options: ThisOptions): ThisEffect =>
        {
            return Effect.withConfigProvider(
                Effect.provide(
                    Effect.provideService(
                        Main(Options),
                        FStepService,
                        {
                            Log: GetWithStep((Options as FGlobalOptions).silent)
                        }
                    ),
                    NodeContext.layer
                ),
                ConfigProvider
            );
        }
    );
}
