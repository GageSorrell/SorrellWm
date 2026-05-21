/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * A simple wrapper to allow passing primitives to functions by-reference.
 *
 * @template Type - The type of the value wrapped by this.
 */
export type Ref<Type> = { Ref: Type | undefined };

/**
 * The opposite of {@link NonNullable}: the union of a given {@link Type}, `null`, and `undefined`.
 *
 * @template Type - The nontrivial type in this union.
 */
export type TNullable<Type> =
    | Type
    | null
    | undefined;

/** An error that is thrown in default implementations of `abstract` `class`es. */
export class AbstractMethodCallError extends Error
{
    public constructor(ClassName?: string)
    {
        super(ClassName);
    }
}

/**
 * A "safe" intersection of two types, such that if exactly one
 * of the two types is `never`, then this evaluates to the other type.
 * This evaluates to the intersection of the two types iff *both*
 * type parameters.
 *
 * @template LeftType - The first type parameter.
 * @template RightType - The second type parameter.
 */
export type TSafeIntersection<LeftType, RightType> =
    [ LeftType ] extends [ never ]
        ? [ RightType ] extends [ never ]
            ? never
            : RightType
        : [ RightType ] extends [ never ]
            ? LeftType
            : (LeftType & RightType);
