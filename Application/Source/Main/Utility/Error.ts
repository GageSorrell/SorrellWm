/**
 *
 *
 * @module @sorrell/wm/Main/Utility/Error
 *
 * @file      Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";

/**
 * A simple error that contains a `string` message.
 *
 * @since 0.1.0
 */
export interface SimpleError
{
    readonly Message: string;
}

/**
 * A tagged `SimpleError`.
 *
 * @since 0.1.0
 */
export class SimpleTaggedError extends Data.TaggedError("SimpleTaggedError")<SimpleError> { }
