/**
 * @file      Validate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Argument, Flag } from "@sorrell/effect/unstable/cli";
import { Effect } from "effect";
import type { ValidateCommandType } from "./Validate.Command.Types.js";
export declare const Choices: readonly ["config-not-missing-providers", "has-config", "has-providers", "no-collisions", "no-ignored-providers"];
/** The type of a validator {@link Effect.Effect | effect}. */
type ValidatorEffect = Effect.Effect<void, string, never>;
type ValidatorConfig = {
    Fix: Flag.Flag<ReadonlyArray<"all" | typeof Choices[number]>>;
    Validators: Argument.Argument<ReadonlyArray<ValidatorEffect>>;
};
export declare const ValidateConfig: ValidatorConfig;
export declare const ValidateCommand: ValidateCommandType;
export {};
//# sourceMappingURL=Validate.Command.d.ts.map