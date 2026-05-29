/**
 * @file      Validate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/informative-docs */

import type { Effect } from "effect";
import type { Requirements } from "@sorrell/utilities/effect";
import type { SubCommand } from "../../Shared/SubCommand.Types.js";
import type { ValidateConfig } from "./Validate.Command.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The {@link Effect.Effect | effect} corresponding to the `validate` command. */
export type ValidateCommandEffect =
    Effect.Effect<
        void,
        any,
        Requirements.FsPath
    >;

/** The type of the `validate` command. */
export type ValidateCommandType =
    SubCommand<
        "validate",
        typeof ValidateConfig,
        Requirements.FsPath,
        any
    >;

/* eslint-enable @typescript-eslint/no-explicit-any */
