/**
 * @file      Validate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { ValidateConfig, ValidateError, Validators } from "./Validate.Command.js";
import type { Effect as MainEffect } from "effect";
import type { Handler as MainHandler } from "@sorrell/cli-utilities/cli";
import type { Requirements } from "@sorrell/utilities/effect";
export declare namespace Validator {
    type Choice = typeof Validators[number];
    type Argument = Omit<MainHandler.Argument<typeof ValidateConfig>, "Validators">;
    type Effect = MainEffect.Effect<void, ValidateError, Requirements.FsPath>;
    type Handler = (Options: Argument) => Effect;
    type ErrorKind = "ConfigFileNotFound" | "FailedToReadConfigFile";
}
//# sourceMappingURL=Validate.Command.Types.d.ts.map