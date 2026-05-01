/**
 * @file      Curry.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FCurriedArgument } from "./Curry.Types.js";

export type ReplaceAtIndex<
    TupleType extends Array<unknown>,
    TargetIndexType extends keyof TupleType
> = {
    [ Index in keyof TupleType ]: Index extends TargetIndexType
        ? FCurriedArgument
        : TupleType[Index];
};

type IsEqual<Left, Right> =
    (<Value>() => Value extends Left ? 1 : 2) extends
    (<Value>() => Value extends Right ? 1 : 2)
        ? true
        : false;

export type TCurriedArgumentVectorSourceRecursive<
    ArgumentVectorType extends Array<unknown>,
    CurriedType extends Array<unknown>,
    SourceVectorType extends Array<unknown> = [ ]
> =
    ArgumentVectorType extends [
        infer ArgumentType,
        ...infer RemainingArgumentVectorType
    ]
        ? CurriedType extends  [
            infer CurriedArgumentType,
            ...infer RemainingCurriedType
        ]
            ? IsEqual<CurriedArgumentType, FCurriedArgument> extends true
                ? TCurriedArgumentVectorSourceRecursive<
                    RemainingArgumentVectorType,
                    RemainingCurriedType,
                    [ ...SourceVectorType, ArgumentType ]
                >
                : TCurriedArgumentVectorSourceRecursive<
                    RemainingArgumentVectorType,
                    RemainingCurriedType,
                    SourceVectorType
                >
            : SourceVectorType
        : SourceVectorType;

export type TWithCurryRecurrence<
    ArgumentVectorType extends Array<unknown>,
    HasPipedArgument extends boolean = false,
    HasOriginalArgument extends boolean = false
> =
    ArgumentVectorType extends [
        infer ArgumentType,
        ...infer RemainingArgumentVectorType
    ]
        ? [
            FCurriedArgument,
            ...TWithCurryRecurrence<
                RemainingArgumentVectorType,
                true,
                HasOriginalArgument
            >
        ] | [
            ArgumentType,
            ...TWithCurryRecurrence<
                RemainingArgumentVectorType,
                HasPipedArgument,
                true
            >
        ]
        : HasPipedArgument extends true
            ? HasOriginalArgument extends true
                ? [ ]
                : never
            : never;

export type TCurriedRecurrence<
    ArgumentVectorType extends Array<unknown>,
    CurriedType extends Array<unknown>,
    __Accumulator extends Array<unknown> = [ ]
> =
    [ ...ArgumentVectorType extends [ infer HeadType, ...infer TailType ]
        ? CurriedType extends [ infer CurriedHeadType, ...infer CurriedTailType ]
            ? CurriedHeadType extends FCurriedArgument
                ? TCurriedRecurrence<TailType, CurriedTailType, [ ...__Accumulator, HeadType ]>
                : TCurriedRecurrence<TailType, CurriedTailType, __Accumulator>
            : never
        : ArgumentVectorType extends [ infer HeadType ]
            ? CurriedType extends [ infer CurriedHeadType ]
                ? CurriedHeadType extends FCurriedArgument
                    ? [ ...__Accumulator, HeadType ]
                    : __Accumulator
                : __Accumulator
            : __Accumulator ];
