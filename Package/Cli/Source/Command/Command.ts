/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { And, InvalidData, MissingData, Or, SourceUnavailable, Unsupported } from "effect/ConfigError";
import { type CliApp, Command, type ValidationError } from "@effect/cli";
import { FStepService, GetWithStep } from "../Effect/Effect.js";
import type { TCommand, TCommandHandler } from "./Command.Types.js";
import { ConfigProvider } from "../Config/Config.js";
import { Effect } from "effect";
import type { FGlobalConfig } from "../Config/Config.Types.js";
import type { FGlobalOptions } from "../Options/Options.Types.js";
import { NodeContext } from "@effect/platform-node";
import type { Simplify } from "effect/Types";

/**
 * A wrapper for {@link Command.make} that imposes sensible defaults.
 *
 * @param Name - The name of the command to make.
 * @param Config - The {@link Command.Command.Config | configuration} object for the
 * command to be made.
 * @param Handler - The foo.
 * @returns {TCommand<typeof Name, typeof Config, ErrorType, RequirementsType>} The
 * {@link TCommand | command} constructed by passing the given arguments to {@link Command.make}.
 */
export function MakeCommand<
    NameType extends string,
    ConfigType extends Command.Command.Config & FGlobalConfig,
    ErrorType,
    RequirementsType extends NodeContext.NodeContext
>(
    Name: NameType,
    Config: ConfigType,
    Handler: TCommandHandler<ConfigType, ErrorType, RequirementsType>
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
                        Handler(Options),
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
