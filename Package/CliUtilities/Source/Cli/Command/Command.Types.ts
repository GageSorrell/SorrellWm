/**
 * @file      Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Argument } from "../Handler/Handler.Types.js";
import type { CliApp } from "@effect/cli/CliApp";
import type { Command } from "@effect/cli";
import type { Effect } from "effect";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { GetMain } from "./Command.js";
import type { Subcommand } from "../Subcommand/Internal.js";
import type { TFunction } from "@sorrell/utilities/functional";
import type { ValidationError } from "@effect/cli/ValidationError";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The type representing any {@link Command!Command | command}. */
export type Any = Command.Command<any, any, any, any>;

/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * The type of {@link Command!Command | command} returned by {@link GetMain}.
 *
 * @template NameType - The name of the command.
 * @template ConfigType - The config type of the command.
 */
export type Main<
    NameType extends string,
    ConfigType extends Command.Command.Config
> =
    Command.Command<
        NameType,
        never,
        never,
        Argument<ConfigType>
    >;

/* eslint-enable @typescript-eslint/no-empty-object-type */

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * The function returned by {@link Command.run}.
 *
 * @template E - The error type of the command.
 * @template R - The requirements type of the command.
 */
export type Cli<E = never, R = never> =
    TFunction.Safe<
        readonly [ ReadonlyArray<string> ],
        Effect.Effect<
            void,
            | E
            | ValidationError,
            | R
            | CliApp.Environment
        >
    >;

/**
 * A {@link Command!Command | command} that is equipped with {@link SubcommandsType | subcommands}
 * whose {@link E | error} and {@link R | requirements} are constrained.
 *
 * @see {@link SubCommand!WithSubCommands}
 *
 * @template NameType - The name of the command that is equipped with subcommands.
 * @template E - The error type of the command.
 * @template R - The requirements type of the command.
 * @template ParsedConfigType - The {@link Command!Command.ParseConfig:type | parsed type} of
 * the command's config.
 * @template SubcommandsType - The type of the {@link Array} of subcommands with which
 * this command is equipped.
 */
export type CommandWithSubcommands<
    NameType extends string,
    R,
    E,
    ParsedConfigType,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    SubcommandsType extends Subcommand.SubcommandArray<any, any>
> =
    Command.Command<
        NameType,
        | R
        | Exclude<
            Subcommand.Internal.Requirements<SubcommandsType>,
            Command.Command.Context<NameType>
        >,
        | E
        | Subcommand.Internal.Error<SubcommandsType>,
        Subcommand.Internal.ParsedWithSubcommands<ParsedConfigType, SubcommandsType>
    >;
