/**
 * @file      Curry.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CurriedArgument } from "./Curry.Internal.js";
import type { TCurriedRecurrence, TWithCurryRecurrence } from "./Curry.Internal.Types.js";
import type { TFunction } from "./Functional.Types.js";

/**
 * The type of {@link _}, used to denote which arguments should remain open
 * in a curried function.
 */
export type FCurriedArgument = typeof CurriedArgument;

/**
 * The argument vector that defines fixed arguments, and which arguments of a given
 * {@link ArgumentVectorType} should be remain open (denoted by {@link _}).
 */
export type TArgumentVectorWithCurry<ArgumentVectorType extends Array<unknown>> =
    ArgumentVectorType extends Array<infer ElementType>
        ? Array<ElementType | FCurriedArgument>
        : never;

/**
 * The argument vector for a curried {@link TFunction} of {@link ArgumentVectorType},
 * with fixed arguments given by {@link WithCurryType}.
 * 
 * @template ArgumentVectorType - The argument vector of the function being curried.
 * @template WithCurryType - The argument vector that contains fixed arguments of
 * {@link ArgumentVectorType}, and denotes (via {@link FCurriedArgument}) which arguments remain open
 * in the resulting curried function.
 */
export type TCurriedArgumentVector<
    ArgumentVectorType extends Array<unknown>,
    WithCurryType extends Array<unknown>
> = 
    ArgumentVectorType["length"] extends number
        ? TCurriedRecurrence<ArgumentVectorType, WithCurryType>["length"] extends 0
            ? ArgumentVectorType
            : TCurriedRecurrence<ArgumentVectorType, WithCurryType>
        : TCurriedRecurrence<ArgumentVectorType, WithCurryType>;

/**
 * A curried function, for a base function with a given {@link ArgumentVectorType} and return type
 * {@link ThisReturnType}, and a given {@link CurriedVectorType}.
 * 
 * @template ArgumentVectorType - The base type of the argument vector of the given {@link Function}.
 * @template CurriedVectorType - The base type of the given {@link CurriedArgumentVector}.
 * @template ThisReturnType - The base type of the return type of the given {@link Function}.
 */
export type TCurriedFunction<
    ArgumentVectorType extends Array<unknown>,
    WithCurryType extends Array<unknown>,
    ThisReturnType
> = 
    TFunction<
        TCurriedArgumentVector<ArgumentVectorType, WithCurryType>,
        ThisReturnType
    >;