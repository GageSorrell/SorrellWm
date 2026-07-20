/**
 * Errors that `ink` prompts can have.
 *
 * @module @sorrell/effect-ink/Error
 */

/**
 * @file      Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";

export class PromptCanceled extends Data.TaggedError("PromptCanceled")<{ readonly Message?: string; }> { }

export class PromptFailed extends Data.TaggedError("PromptFailed")<
    Readonly<{
        Cause?: unknown;
        Message?: string;
    }>
> { }

export type PromptRunError =
    | PromptCanceled
    | PromptFailed;
