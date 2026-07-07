/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Types
 * @internal
 *
 * @file      Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

type UnionToIntersection<Union> =
    (
        Union extends unknown
            ? (Value: Union) => void
            : never
    ) extends (Value: infer Intersection) => void
        ? Intersection
        : never;

type LastOfUnion<Union> =
    UnionToIntersection<
        Union extends unknown
            ? (Value: Union) => void
            : never
    > extends (Value: infer Last) => void
        ? Last
        : never;

type UnionToTuple<
    Union,
    Result extends ReadonlyArray<unknown> = [ ]
> =
    [Union] extends [never]
        ? Result
        : UnionToTuple<
            Exclude<Union, LastOfUnion<Union>>,
            [LastOfUnion<Union>, ...Result]
        >;

/**
 * @template Value - The {@link Record | Record-like} type whose keys are counted by this.
 */
// @ts-expect-error "Excessive stack depth" error appears here, but not in the types defined with this type.
export type PropertyCount<Value extends object> = UnionToTuple<keyof Value>["length"];
