/**
 * @file      Validate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/informative-docs */

import type { Effect } from "effect";
import type { Environment } from "effect/unstable/cli/Prompt";
import type { Subcommand } from "../../Shared/SubCommand.Types.js";
import type { ValidateConfig } from "./Validate.Command.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The {@link Effect.Effect | effect} corresponding to the `validate` command. */
export type ValidateCommandEffect =
    Effect.Effect<
        void,
        any,
        Environment
    >;

/* eslint-enable @typescript-eslint/no-explicit-any */

/** The type of the `validate` command. */
export type ValidateCommandType = Subcommand<"validate", typeof ValidateConfig>;
