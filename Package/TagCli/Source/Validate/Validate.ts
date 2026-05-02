/**
 * @file      Validate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { Console, Effect } from "effect";
import { Command } from "@effect/cli";
import type { FValidateOptions } from "./Validate.Internal.Types.js";
import { ValidateConfig } from "./Validate.Internal.js";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function ValidateHandler({ Files }: FValidateOptions): Effect.Effect<void>
{
    return Effect.gen(function*()
    {
        Console.log("The validate command has not been implemented yet.");
    });
}

/* eslint-disable-next-line @typescript-eslint/typedef */
export const ValidateCommand = Command.make("validate", ValidateConfig, ValidateHandler);

