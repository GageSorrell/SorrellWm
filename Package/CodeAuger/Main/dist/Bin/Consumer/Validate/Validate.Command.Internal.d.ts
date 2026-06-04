/**
 * @file      Validate.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Effect } from "effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { ValidateConfig } from "./Validate.Command.js";
export declare const Choices: readonly ["config-not-missing-providers", "has-config", "has-providers", "no-collisions", "no-ignored-providers"];
/**
 * Run the validators specified in the given {@link Options}, or all validators if
 * {@link Options!Validators} is empty.
 *
 * @param Options - The options for the `validate` command.
 *
 * @returns {Effect.Effect<void>} The {@link Effect.Effect | effect} that runs the validators
 * given in the {@link Options}.
 */
export declare function RunValidators(Options: Handler.Argument<typeof ValidateConfig>): Effect.Effect<void>;
//# sourceMappingURL=Validate.Command.Internal.d.ts.map