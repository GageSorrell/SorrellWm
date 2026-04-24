/**
 * @file      Update.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";

/**
 * @module UpdateInternal
 * Internal content for the {@link Update} module.
 *
 * @internal
 */

export class NpmError extends Data.TaggedError("NpmError")<{
    readonly ExitCode: number;
    readonly Output: string;
}> { }

export class InvalidSaveModeError extends Data.TaggedError("InvalidSaveModeError")<{
    Message: string;
}> { }

