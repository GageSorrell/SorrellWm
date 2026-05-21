/**
 * @file      Container.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

import type { Element, Result } from "./Container.Types.ts";
import type { IterableContainer } from "./Container.Meta.Types.ts";
import type { Unsafe } from "./Container.Unsafe.Types.ts";

/**
 * The symmetric difference of two {@link IterableContainer | iterable containers}.
 *
 * @param Left - The left {@link IterableContainer | iterable container} operand.
 * @param Right - The right {@link IterableContainer | iterable container} operand.
 * @returns {Result<LeftType, RightType>} The {@link Result | result} of the operation.
 */
export function SymmetricDifference<
    const LeftType extends Unsafe.Iterable,
    const RightType extends Unsafe.Iterable
>(
    Left: LeftType,
    Right: RightType
): Result<LeftType, RightType>
{
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function EnsureSet<const ElementType>(In: Iterable<ElementType>): Set<ElementType>
    {
        return In instanceof Set
            ? In
            : new Set<ElementType>(In);
    }

    const Result: Set<Element<LeftType> | Element<RightType>> =
        EnsureSet(Left as IterableContainer<Element<typeof Left> | Element<typeof Right>>)
            .symmetricDifference(EnsureSet(Right));

    return ((Array.isArray(Left) && Array.isArray(Right))
        ? Array.from(Result)
        : Result) as Result<LeftType, RightType>;
}
