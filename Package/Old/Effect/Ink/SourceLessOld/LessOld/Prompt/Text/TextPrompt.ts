/**
 * The API of the text prompt.
 *
 * @module @sorrell/effect-ink/Prompt/Text/TextPrompt
 * @internal
 */

/**
 * @file      TextPrompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";
import type { Validator } from "../index.ts";

export interface Options
{
    readonly Message: ReactNode;
    readonly Placeholder?: string;
    readonly InitialValue?: string;
    readonly Validate?: Validator.Validator<string>;
}
