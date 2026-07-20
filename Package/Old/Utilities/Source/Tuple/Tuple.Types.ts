/**
 * @file      Tuple.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { HigherKind } from "../HigherKind/HigherKind.Types.ts";
import type { Any as InferredAny } from "../Type/Utility.Types.ts";

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

// export type UnionToReadonlySingletonTuple<UnionType> =
//     UnionType extends unknown
//         ? readonly [ UnionType ]
//         : never;

// export type Map<
//     TupleType extends ReadonlyArray<ArgumentsOf<HigherKindType>[keyof ArgumentsOf<HigherKindType>]>,
//     HigherKindType extends HigherKind
// > =
//     {
//         [ Index in Extract<keyof TupleType, number> ]:
//         readonly [ TupleType[Index] ] extends ArgumentsOf<HigherKindType>
//             ? Apply<HigherKindType, readonly [ TupleType[Index] ]>
//             : never;
//     };

// interface MyMapper extends HigherKind<readonly [ number | string ]>
// {
//     new: (TheElement: this["ArgumentVector"][0]) => typeof TheElement extends number
//         ? `Mapped: ${ typeof TheElement }`
//         : typeof TheElement;
// }

/**
 * Ensure that a given {@link Type} is a tuple-type by mapping it to `never` if it is not.
 * 
 * @template Type - The type to validate.
 */
export type Validate<Type> =
    Type extends ReadonlyArray<unknown>
        ? Argument<Type>
        : never;

/**
 * Constrain a type parameter to being a tuple type (but *not* an {@link Array}
 * or {@link ReadonlyArray} type).
 * 
 * @note This is equivalent to {@link Validate}, but with the requirement that
 * {@link Type} `extends ReadonlyArray<unknown>`, which may make a function signature 
 * that implements this type easier to read.
 * 
 * @template Type - The type to validate as being a tuple-type.
 */
export type Argument<Type extends ReadonlyArray<unknown>> =
    number extends Type["length"]
        ? never
        : Type;
