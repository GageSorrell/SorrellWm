/**
 * @file      Tuple.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Apply, ArgumentsOf, HigherKind } from "../HigherKind/HigherKind.Types.ts";
import type { Any as InferredAny } from "../Type/Utility.Types.ts";
import type { Values } from "../Record/Record.Types.ts";

/**
 * A base type for tuple type parameters to extend, which forces the compiler to narrow
 * more strictly when using a given type for that generic type parameter.
 */
export type Any =
    | Array<InferredAny>
    | ReadonlyArray<InferredAny>;

export interface ElementsOf extends HigherKind
{
    new: () => this["ArgumentVector"][number];
}

export type HigherArgumentVector<TupleType extends ReadonlyArray<unknown>> =
    TupleType extends readonly [ ]
        ? readonly [ ]
        : TupleType extends readonly [
            infer Head,
            ...infer Tail extends ReadonlyArray<unknown>
        ]
            ? Head extends unknown
                ? HigherArgumentVector<Tail> extends infer EndTail extends ReadonlyArray<unknown>
                    ? readonly [ Head, ...EndTail ]
                    : never
                : never
            : never;

interface TestKind extends HigherKind<readonly [ (readonly [ number, "A" | 5, "F" ])[number] ]>
{
    new: () => this["ArgumentVector"];
}

export type UnionToReadonlySingletonTuple<Union> =
    Union extends unknown
        ? readonly [Union]
        : never;

export type Map<
    TupleType extends ReadonlyArray<ArgumentsOf<HigherKindType>[keyof ArgumentsOf<HigherKindType>]>,
    HigherKindType extends HigherKind
> =
    // readonly [ TupleType[keyof TupleType] ] extends ArgumentsOf<HigherKindType>
        {
            [ Index in Extract<keyof TupleType, number> ]: readonly [ TupleType[Index] ] extends ArgumentsOf<HigherKindType>
                ? Apply<HigherKindType, readonly [ TupleType[Index] ]>
                : never;
        }
        // : never;

interface MyMapper extends HigherKind<readonly [ number | string ]>
{
    new: (TheElement: this["ArgumentVector"][0]) => typeof TheElement extends number
        ? `Mapped: ${ typeof TheElement }`
        : typeof TheElement;
}

type MyMapTest = Map<readonly [ 1, "Five", 3 ], MyMapper>;
type FFFFFFFFF = MyMapTest[keyof MyMapTest];

