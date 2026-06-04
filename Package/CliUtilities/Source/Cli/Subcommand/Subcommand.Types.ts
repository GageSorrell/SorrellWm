/**
 * @file      Subcommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@sorrell/effect/unstable/cli";
import type { CommandWithSubcommands } from "../Command/Command.Types.js";
import type { NonEmptyArray } from "effect/Array";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { CommandWithSubcommands as WithSubcommandsFunction } from "../Command/Command.Types.js";

/**
 * A {@link Command!Command | command} whose {@link E | error} and
 * {@link R | requirements} types are constrained.
 *
 * @see {@link SubCommands}
 *
 * @template E - The error type of the command.
 * @template R - The requirements type of the command.
 */
export type Constrained<E, R> =
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Command.Command<string, R, E, any>;

/**
 * A nonempty {@link ReadonlyArray} of {@link Constrained | constrained commands}.
 * This allows for imposing limitations on subcommands.
 *
 * @template E - The error type of the command.
 * @template R - The requirements type of the command.
 */
export type SubcommandArray<E, R> = NonEmptyArray<Constrained<E, R>>;

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The function returned by {@link WithFunction}.  Pipe a command to this function
 * to provide it with the subcommands provided to {@link WithFunction}, and this will
 * equip the given {@link Self | command} with the subcommands.
 *
 * This is analogous to the function returned by {@link Command.withSubcommands}.
 *
 * @template SubcommandsType - The type of the {@link SubcommandArray}, whose error
 * and requirements types are constrained.
 */
export type Transformer<
    SubcommandsType extends SubcommandArray<any, any>
> = <
    NameType extends string,
    R,
    E,
    ParsedConfigType
>(
    Self: Command.Command<NameType, R, E, ParsedConfigType>
) => CommandWithSubcommands<
    NameType,
    R,
    E,
    ParsedConfigType,
    SubcommandsType
>;

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * The function returned by {@link WithSubcommandsFunction | WithSubcommands}.
 * This is analogous to {@link Command.withSubcommands}, but with the {@link E | error} and
 * {@link R | requirements} types constrained by calling
 * {@link WithSubcommandsFunction | WithSubcommands} to retrieve this function.
 *
 * @template E - The error type of the subcommands.
 * @template R - The requirements type of the subcommands.
 */
export type WithFunction<E, R> =
    <const SubcommandsType extends SubcommandArray<E, R>>(
        Subcommands: SubcommandsType
    ) => Transformer<SubcommandsType>;
