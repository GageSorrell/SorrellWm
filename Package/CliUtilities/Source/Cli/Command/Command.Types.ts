/**
 * @file      Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Argument } from "../Handler/Handler.Types.js";
import type { Command } from "@effect/cli";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { GetMain } from "./Command.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The type representing any {@link Command!Command | command}. */
export type Any = Command.Command<any, any, any, any>;

/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * The type of {@link Command!Command | command} returned by {@link GetMain}.
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
