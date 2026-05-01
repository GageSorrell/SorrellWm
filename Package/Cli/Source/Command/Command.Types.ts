/**
 * @file      Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { And, InvalidData, MissingData, Or, SourceUnavailable, Unsupported } from "effect/ConfigError";
import type { CliApp, Command } from "@effect/cli";
import type { CommandExecutor, FileSystem } from "@effect/platform";
import type { Effect } from "effect";
import type { FGlobalConfig } from "../Config/Config.Types.js";
import type { FStepService } from "../Effect/Effect.js";
import type { NodeContext } from "@effect/platform-node";
import type { Simplify } from "effect/Types";
import type { TEffectError } from "./Command.Internal.Types.js";
import type { ValidationError } from "@effect/cli/ValidationError";

// import type { Effect, Types } from "effect";
// import type { Command } from "@effect/cli";
// import type { ConfigError } from "effect/ConfigError";
// import type { FStepService } from "../Effect/Effect.js";
// import type { UnknownException } from "effect/Cause";

// export type TCommand<
//     NameType extends string,
//     ConfigType extends Command.Command.Config,
//     RequirementsType,
//     ErrorType = UnknownException
// > =
//     [ ErrorType ] extends [ never ]
//         ? Command.Command<
//             NameType,
//             never,
//             ErrorType | ConfigError,
//             TRequirements<ConfigType> | RequirementsType
//         >
//         : Command.Command<
//             NameType,
//             never,
//             ErrorType | ConfigError,
//             TRequirements<ConfigType> | RequirementsType
//         >;

// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type FCommandAny = Command.Command<any, any, any, any>;

// export type TCommandError<CommandType extends TCommandEffect<any>> =
//     CommandType extends Command.Command<any, any, infer E, any>
//         ? E
//         : never;

// /* eslint-enable @typescript-eslint/no-explicit-any */

// export type TProvidedOptions<ConfigType extends Command.Command.Config> =
//     Types.Simplify<Command.Command.ParseConfig<ConfigType>>;

// export type TRequirements<ConfigType extends Command.Command.Config> =
//     | TProvidedOptions<ConfigType>
//     | FStepService;

// export type TCommandEffect<ConfigType extends Command.Command.Config, ErrorType, R> =
//     Effect.Effect<void, ErrorType | ConfigError, TRequirements<ConfigType> | R>;

// export type TMainFunction<ConfigType extends Command.Command.Config, ErrorType, R> =
//     (Options: TProvidedOptions<ConfigType>) => TCommandEffect<ConfigType, ErrorType, R>;

export type TSubCommandFunction<ErrorType> =
    (Arguments: ReadonlyArray<string>) => TSubCommandEffect<ErrorType>;

export type TSubCommandEffect<ErrorType, RequirementsType = never> =
    Effect.Effect<
        void,
        ErrorType | ValidationError | And | Or | InvalidData | MissingData | SourceUnavailable | Unsupported,
        RequirementsType | CliApp.CliApp.Environment | FStepService | NodeContext.NodeContext
        | FileSystem.FileSystem | FStepService | NodeContext.NodeContext | CommandExecutor.CommandExecutor
    >;

export type TCommandMain<
    ConfigType extends Command.Command.Config & FGlobalConfig,
    ErrorType,
    RequirementsType = never
> =
    (Options:
    Simplify<Simplify<
        {
            readonly [Key in keyof ConfigType]: Command.Command.ParseConfigValue<ConfigType[Key]>;
        }
    >>) => TSubCommandEffect<ErrorType, RequirementsType>;

export type TCommand<
    NameType extends string,
    ConfigType extends Command.Command.Config,
    ErrorType,
    RequirementsType extends NodeContext.NodeContext = never
> =
    Command.Command<
        NameType,
        Exclude<RequirementsType, FStepService> | CliApp.CliApp.Environment | NodeContext.NodeContext,
        TEffectError<ErrorType>,
        Simplify<Simplify<
            {
                readonly [Key in keyof (ConfigType & FGlobalConfig)]:
                Command.Command.ParseConfigValue<(ConfigType & FGlobalConfig)[Key]>;
            }
        >>
    >;
