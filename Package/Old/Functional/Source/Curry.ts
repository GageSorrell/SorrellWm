/**
 * @file      Curry.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    FCurriedArgument,
    TArgumentVectorWithCurry,
    TCurriedArgumentVector,
    TCurriedFunction
} from "./Curry.Types.js";
import { CurriedArgument } from "./Curry.Internal.js";

export/**
       * Denotes in the `CurriedArgumentVector` of a call to {@link Curry} an argument in the argument vector
       * of the `Function` given to {@link Curry} that should remain in the argument vector of the returned
       * curried function.
       */
const _: FCurriedArgument = CurriedArgument;

/* eslint-disable @stylistic/max-len */

/**
 * Curry a function by fixing some (but not all) of its arguments, by providing a given {@link InFunction},
 * and a {@link CurriedArgumentVector} containing the fixed arguments, and {@link _} in place of the
 * arguments that will remain open.
 *
 * @template ArgumentVectorType - The base type of the argument vector of the given {@link InFunction}.
 * @template ThisReturnType - The base type of the return type of the given {@link InFunction}.
 *
 * @param InFunction - The function to curry.
 * @param CurriedArgumentVector - A vector matching the argument vector of {@link InFunction}, with {@link _}
 * appearing at least once in place of an argument of proper type to {@link InFunction}.
 *
 * @returns {TCurriedFunction<Parameters<typeof InFunction>, typeof CurriedArgumentVector, ReturnType<typeof InFunction>>} A
 * function identical to the given {@link InFunction}, but with argument vector consisting of the arguments replaced by {@link _}
 * in the given {@link CurriedArgumentVector}.
 *
 * @example
 * ```typescript
 * import { Curry, _ } from "@sorrell/functional";
 *
 * function LongFunction(A: string, B: boolean, C: number): string
 * {
 *     return `${ A }, ${ B }, ${ C }`;
 * }
 *
 * const ShortFunction = Curry(LongFunction, "Fixed", _, 30);
 * const Result = ShortFunction(true);
 * // `Result` <- `"Fixed, true, 30"`
 * ```
 */
export function Curry<
    ArgumentVectorType extends Array<unknown>,
    ThisReturnType
>(
    InFunction: (...ArgumentVector: ArgumentVectorType) => ThisReturnType,
    ...CurriedArgumentVector: TArgumentVectorWithCurry<Parameters<typeof InFunction>>
): TCurriedFunction<Parameters<typeof InFunction>, typeof CurriedArgumentVector, ReturnType<typeof InFunction>>
{
    /* eslint-enable @stylistic/max-len */
    type FThisArgumentVector = TCurriedArgumentVector<
        Parameters<typeof InFunction>,
        typeof CurriedArgumentVector
    >;

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function ConstructFilledArgumentVector(
        ...ArgumentVector: FThisArgumentVector
    ): Parameters<typeof InFunction>
    {
        let VariableAssignedIndex: number = 0;
        return CurriedArgumentVector.map((Argument: unknown) =>
        {
            if (Argument === _)
            {
                const Out: unknown = ArgumentVector[VariableAssignedIndex];
                VariableAssignedIndex++;
                return Out;
            }
            else
            {
                return Argument;
            }
        }) as unknown as Parameters<typeof InFunction>;
    }

    type FThisReturnType =
        TCurriedFunction<
            Parameters<typeof InFunction>,
            typeof CurriedArgumentVector,
            ReturnType<typeof InFunction>
        >;

    return function(...ArgumentVector: FThisArgumentVector): ReturnType<typeof InFunction>
    {
        return InFunction(
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            ...ConstructFilledArgumentVector(...ArgumentVector) as any
        ) as ReturnType<typeof InFunction>;
    } as FThisReturnType;
}
