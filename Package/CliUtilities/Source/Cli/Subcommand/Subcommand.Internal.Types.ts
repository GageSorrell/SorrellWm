/**
 * @file      Subcommand.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Command, CommandDescriptor } from "@sorrell/effect/unstable/cli";
import type { Effect } from "effect/Effect";
import type { Option } from "effect";
import type { SubcommandArray } from "./Subcommand.Types.js";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { WithSubcommands } from "../Command/Command.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The union of the respective requirements types of the subcommands in
 * an {@link SubcommandsType | array of subcommands}.
 *
 * @template SubcommandsType - The {@link SubcommandArray | array of subcommands}
 * from which this extracts the respective requirements into a union.
 */
export type Requirements<
    SubcommandsType extends SubcommandArray<any, any>
> = Effect.Context<ReturnType<SubcommandsType[number]["handler"]>>;

/**
 * The union of the respective error types of the subcommands in
 * an {@link SubcommandsType | array of subcommands}.
 *
 * @template SubcommandsType - The {@link SubcommandArray | array of subcommands}
 * from which this extracts the respective error types into a union.
 */
export type Error<
    SubcommandsType extends SubcommandArray<any, any>
> = Effect.Error<ReturnType<SubcommandsType[number]["handler"]>>;

/**
 * The union of the respective {@link Command!Command.ParseConfig:type | parsed config types} of
 * the subcommands in an {@link SubcommandsType | array of subcommands}.
 *
 * @template SubcommandsType - The {@link SubcommandArray | array of subcommands}
 * from which this extracts the respective error types into a union.
 */
export type Parsed<
    SubcommandsType extends SubcommandArray<any, any>
> = CommandDescriptor.Command.GetParsedType<
    SubcommandsType[number]["descriptor"]
>;

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * For some {@link Command!Command:type | command}, identified here by its
 * {@link Command!Command.ParseConfig:type | parsed config type}, and an
 * {@link SubCommandsType | array of subcommands} which the given command is
 * to be equipped with, get the parsed config type of the command that is
 * formed by equipping the given command with the subcommands in the given
 * {@link SubCommandsType | subcommands}.
 *
 * @template ParsedType - The {@link Command!Command.ParseConfig:type | parsed config type}
 * of the {@link Command!Command | command} which is to be equipped with the
 * given {@link SubCommandsType | subcommands}.
 *
 * @template SubcommandsType - The {@link Array} type of subcommands of constrained
 * error and requirements types.
 *
 * @see {@link WithSubcommands}
 */
export type ParsedWithSubcommands<
    ParsedType,
    SubcommandsType extends SubcommandArray<any, any>
> = CommandDescriptor.Command.ComputeParsedType<
    ParsedType & Readonly<{
        readonly subcommand: Option.Option<Parsed<SubcommandsType>>;
    }>
>;
