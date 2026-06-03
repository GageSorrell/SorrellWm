/**
 * @file      Handler.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as SorrellCommand from "../Command/index.js";
import type { CliApp, Command } from "@effect/cli";
import type { Effect as TheEffect } from "effect";
import type { Types } from "effect";

/**
 * The type of the handler function of a given {@link CommandType}.
 *
 * @template CommandType - The {@link Command!Command | command} whose handler is extracted by this.
 */
export type FromCommand<CommandType extends SorrellCommand.Any> = CommandType["handler"];

/**
 * A utility type for typing the {@link TheEffect!Effect | effects} of {@link FromCommand | handlers}.
 *
 * @template A - The success type of this {@link TheEffect!Effect | effect}.
 * @template E - The error type of this {@link TheEffect!Effect | effect}.
 * @template R - The requirements type of this {@link TheEffect!Effect | effect}, to which
 * {@link CliApp!CliApp.Environment | CliApp.Environment} is appended.
 */
export type Effect<A, E, R> = TheEffect.Effect<A, E, R | CliApp.CliApp.Environment>;

/**
 * The type of the argument passed to a {@link FromCommand} of a given
 * {@link ConfigType}.
 *
 * @template ConfigType - The type of the {@link Command!Command.Config | config} object type
 * corresponding to the {@link FromCommand:type} of this config type.
 */
export type Argument<ConfigType extends Command.Command.Config> =
    Types.Simplify<Command.Command.ParseConfig<ConfigType>>;
