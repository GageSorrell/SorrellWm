/**
 * @file      Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@effect/cli";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { GetMain } from "./Command.js";
import type { Option } from "effect/Option";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The type representing any {@link Command!Command | command}. */
export type Any = Command.Command<any, any, any, any>;

/**
 * The type of the command returned by {@link GetMain}.
 *
 * @template NameType - The type of the name of the command having this type.
 */
export type MainCommand<NameType extends string = string> =
    Command.Command<
        NameType,
        any,
        any,
        Readonly<{ subcommand: Option<any> }>
    >;

/* eslint-enable @typescript-eslint/no-explicit-any */
