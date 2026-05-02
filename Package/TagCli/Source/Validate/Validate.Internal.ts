/**
 * @file      Validate.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args } from "@effect/cli";
import type { FValidateConfig } from "./Validate.Internal.Types.js";
import { MakeConfig } from "../Command/Command.js";
import { pipe } from "effect";

export const ValidateConfig: FValidateConfig =
    MakeConfig({
        Files: pipe(
            Args.fileText(),
            Args.atLeast(0),
            Args.withDefault(""),
            Args.withDescription(
                "The tag-containing file(s) in your project that will be validated.  " +
                "These can be any mix of JSON, YAML, or CSV."
            )
        )
    });

