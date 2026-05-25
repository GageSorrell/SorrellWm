/**
 * @file      Handler.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Types } from "effect";
import type * as SorrellCommand from "../Command/index.js";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Command } from "@effect/cli";

/**
 * The type of the handler function of a given {@link Command!Command | command} type.
 */
export type Handler<CommandType extends SorrellCommand.Any> = CommandType["handler"];

/**
 * The type of the argument passed to a {@link Handler:type} of a given
 * {@link ConfigType}.
 *
 * @template ConfigType - The type of the {@link Command!Command.Config | config} object type
 * corresponding to the {@link Handler:type} of this config type.
 */
export type Argument<ConfigType extends Command.Command.Config> =
    Types.Simplify<Command.Command.ParseConfig<ConfigType>>;
