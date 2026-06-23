/**
 * Internal utility types and other helpers.
 *
 * @module @sorrell/effect-ink/Internal/Utility
 */

/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InvalidValue } from "effect/SchemaIssue";
import { Option } from "effect";

/**
 * A constructor for {@link InvalidValue}.
 *
 * @param Message - The message that describes this invalid value.
 * @param Value - The invalid value, if one exists.
 * @returns
 */
export function InvalidValueError<A>(
    Message: string,
    Value: A | Option.Option<A> = Option.none()
): InvalidValue
{
    return new InvalidValue(
        Option.isOption(Value) ? Value : Option.some(Value),
        { message: Message }
    );
}
