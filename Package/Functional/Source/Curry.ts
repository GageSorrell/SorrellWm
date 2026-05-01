/**
 * @file      Curry.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CurriedArgument } from "./Curry.Internal.js";
import type { FCurriedArgument, TArgumentVectorWithCurry, TCurriedArgumentVector, TCurriedFunction } from "./Curry.Types.js";

/**
 * Denotes in the `CurriedArgumentVector` of a call to {@link Curry} an argument in the argument vector
 * of the `Function` given to {@link Curry} that should remain in the argument vector of the returned
 * curried function.
 */
export const _: FCurriedArgument = CurriedArgument;

/**
 * Curry a function by fixing some (but not all) of its arguments, by providing a given {@link Function},
 * and a {@link CurriedArgumentVector} containing the fixed arguments, and {@link _} in place of the
 * arguments that will remain open.
 * 
 * @template ArgumentVectorType - The base type of the argument vector of the given {@link Function}.
 * @template CurriedVectorType - The base type of the given {@link CurriedArgumentVector}.
 * @template ThisReturnType - The base type of the return type of the given {@link Function}.
 * 
 * @param Function - The function to curry.
 * @param CurriedArgumentVector - A vector matching the argument vector of {@link Function}, with {@link _}
 * appearing at least once in place of an argument of proper type to {@link Function}.
 * 
 * @returns {TCurriedFunction<Parameters<typeof Function>, typeof CurriedArgumentVector, ReturnType<typeof Function>>} A
 * function identical to the given {@link Function}, but with argument vector consisting of the arguments replaced by {@link _}
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
    CurriedVectorType extends TArgumentVectorWithCurry<ArgumentVectorType>,
    ThisReturnType
>(
    Function: (...ArgumentVector: ArgumentVectorType) => ThisReturnType,
    ...CurriedArgumentVector: TArgumentVectorWithCurry<Parameters<typeof Function>>
): TCurriedFunction<Parameters<typeof Function>, typeof CurriedArgumentVector, ReturnType<typeof Function>>
{
    function ConstructFilledArgumentVector(...ArgumentVector: TCurriedArgumentVector<Parameters<typeof Function>, typeof CurriedArgumentVector>): Parameters<typeof Function>
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
        }) as unknown as Parameters<typeof Function>;
    }

    return function(...ArgumentVector: TCurriedArgumentVector<Parameters<typeof Function>, typeof CurriedArgumentVector>): ReturnType<typeof Function>
    {
        return Function(...ConstructFilledArgumentVector(...ArgumentVector) as any) as ReturnType<typeof Function>;
    } as TCurriedFunction<Parameters<typeof Function>, typeof CurriedArgumentVector, ReturnType<typeof Function>>;
}
