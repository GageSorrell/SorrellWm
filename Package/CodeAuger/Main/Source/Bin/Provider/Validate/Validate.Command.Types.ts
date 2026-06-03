/**
 * @file      Validate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

import type { ValidateConfig, ValidateError, Validators } from "./Validate.Command.js";
import type { Effect as MainEffect } from "effect";
import type { Handler as MainHandler } from "@sorrell/cli-utilities/cli";
import type { Requirements } from "@sorrell/utilities/effect";

export namespace Validator
{
    export type Choice = typeof Validators[number];

    export type Argument =
        Omit<
            MainHandler.Argument<typeof ValidateConfig>,
            "Validators"
        >;

    export type Effect =
        MainEffect.Effect<
            void,
            ValidateError,
            Requirements.FsPath
        >;

    export type Handler =
        (Options: Argument) => Effect;

    export type ErrorKind =
        | "ConfigFileNotFound"
        | "FailedToReadConfigFile";
}

