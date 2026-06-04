/**
 * @file      Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { And, InvalidData, MissingData, Or, SourceUnavailable, Unsupported } from "effect/ConfigError";
import type { CliApp, Command } from "@sorrell/effect/unstable/cli";
import type { CommandExecutor, FileSystem } from "@effect/platform";
import type { Effect } from "effect";
import type { FGlobalConfig } from "../Config/Config.Types.js";
import type { FStepService } from "../Effect/Effect.js";
import type { NodeContext } from "@effect/platform-node";
import type { Simplify } from "effect/Types";
import type { TEffectError } from "./Command.Internal.Types.js";
import type { ValidationError } from "@sorrell/effect/unstable/cli/ValidationError";

export type TSubCommandFunction<ErrorType> =
    (Arguments: ReadonlyArray<string>) => TSubCommandEffect<ErrorType>;

export type TSubCommandEffect<ErrorType, RequirementsType = never> =
    Effect.Effect<
        void,
        ErrorType | ValidationError | And | Or | InvalidData | MissingData | SourceUnavailable | Unsupported,
        RequirementsType | CliApp.CliApp.Environment | FStepService | NodeContext.NodeContext
        | FileSystem.FileSystem | FStepService | NodeContext.NodeContext | CommandExecutor.CommandExecutor
    >;

export type TCommandHandler<
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
