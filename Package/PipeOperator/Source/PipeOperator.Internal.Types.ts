/**
 * @file      PipeOperator.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ArgumentVector, BaseFunction, PipedArgument } from "./PipeOperator.Types";

export type Values<RecordLike> = RecordLike[keyof RecordLike];

export type ReplaceAtIndex<
    TupleType extends ReadonlyArray<unknown>,
    TargetIndexType extends keyof TupleType
> = {
    [ Index in keyof TupleType ]: Index extends TargetIndexType
        ? PipedArgument
        : TupleType[Index];
};

type TupleIndex<Tuple extends ReadonlyArray<unknown>> = Extract<keyof Tuple, `${number}`>;

type IsEqual<Left, Right> =
    (<Value>() => Value extends Left ? 1 : 2) extends
    (<Value>() => Value extends Right ? 1 : 2)
        ? true
        : false;

export type OriginalArgument<
    FunctionType extends BaseFunction,
    Piped extends ArgumentVector<FunctionType>
> = {
    [ Index in TupleIndex<Parameters<FunctionType>> ]:
    Index extends keyof Piped
        ? IsEqual<Piped[Index], PipedArgument> extends true
            ? Parameters<FunctionType>[Index]
            : never
        : never;
}[ TupleIndex<Parameters<FunctionType>> ];
