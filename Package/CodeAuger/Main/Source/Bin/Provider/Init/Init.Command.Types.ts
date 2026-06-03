/**
 * @file      Init.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/informative-docs */

import type { Effect } from "effect";
import type { InitConfig } from "./Init.Command.js";
import type { Requirements } from "@sorrell/utilities/effect";
import type { Subcommand } from "../../Shared/SubCommand.Types.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The {@link Effect.Effect | effect} corresponding to the `init` command. */
export type InitCommandEffect =
    Effect.Effect<
        void,
        any,
        Requirements.FsPath
    >;

/** The type of the `init` command. */
export type InitCommandType =
    Subcommand<
        "init",
        typeof InitConfig,
        Requirements.FsPath
    >;

/* eslint-enable @typescript-eslint/no-explicit-any */
