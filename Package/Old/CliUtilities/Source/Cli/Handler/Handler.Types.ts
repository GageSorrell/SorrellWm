/**
 * @file      Handler.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@sorrell/effect/unstable/cli";
import type { Environment } from "@sorrell/effect/unstable/cli/Prompt";
import type { Effect as TheEffect } from "@sorrell/effect";

/**
 * The type of the handler function of a given {@link CommandType}.
 *
 * @template CommandType - The {@link Command!Command | command} whose handler is extracted by this.
 */
export type FromCommand<CommandType extends Command.Command.Any> =
    CommandType extends Command.Command<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        infer _CommandConfig extends Command.Command.Config.Infer<infer Config>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        infer E,
        infer R
    >
        ? (Argument: Command.Command.Config.Infer<Config>) => TheEffect.Effect<void, E, R>
        : never;

/**
 * A utility type for typing the {@link TheEffect!Effect | effects} of {@link FromCommand | handlers}.
 *
 * @template A - The success type of this {@link TheEffect!Effect | effect}.
 * @template E - The error type of this {@link TheEffect!Effect | effect}.
 * @template R - The requirements type of this {@link TheEffect!Effect | effect}, to which
 * {@link Environment} is appended.
 */
export type Effect<A, E, R> = TheEffect.Effect<A, E, R | Environment>;

/**
 * The type of the argument passed to a {@link FromCommand} of a given
 * {@link ConfigType}.
 *
 * @template ConfigType - The type of the {@link Command!Command.Config | config} object type
 * corresponding to the {@link FromCommand:type} of this config type.
 */
export type Argument<ConfigType extends Command.Command.Config> = Command.Command.Config.Infer<ConfigType>;
