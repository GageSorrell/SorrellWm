/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { NoOptions } from "./Utility.Internal.ts";

/**
 * Defines a type that corresponds to {@link RecordLike}, such that every
 * `readonly` modifier is removed, recursively.
 *
 * @template RecordLike - The type to make writeable.
 */
export type TDeepWriteable<RecordLike> =
    {
        -readonly [ Key in keyof RecordLike ]: TDeepWriteable<RecordLike[Key]>
    };

/**
 * Given a {@link RecordLike | record-like type}, this type is the union
 * of the values of all properties in the {@link RecordLike | record-like type}.
 *
 * @template RecordLike - The record-like type from which this type extracts value types.
 */
export type TValues<RecordLike> = RecordLike[keyof RecordLike];

/**
 * The union of a given {@link ElementType} and the array of a given {@link ElementType}.
 *
 * @template ElementType - The type of this, or the type of elements contained by this.
 */
export type TMaybeArray<ElementType> =
    | ElementType
    | Array<ElementType>;

/**
 * The element type of the return value of `Object.entries()`.
 *
 * @template RecordLike - The record-like type of the argument of `Object.entries()`.
 * @template KeyType - The subset of keys used by this type.
 */
export type TEntry<
    RecordLike,
    KeyType extends keyof RecordLike = keyof RecordLike
> = [ KeyType, RecordLike[KeyType] ];

/** The type used in `OptionsType`s when no options are specified. */
export type NoOptions = typeof NoOptions;

/**
 * Define options for a given type as a union of `unique symbol` types.
 * All options must be *optional* by the type that uses these options.
 * The type that uses these options should have a type parameter `OptionsType`
 * defined with `OptionsType extends TOptions = NoOptions`.  You will have to import
 * {@link NoOptions}, but this should be done anyway, since making all options types
 * optional should be optional.  For this reason {@link NoOptions} is exported from the
 * same module as this type.
 *
 * @template OptionsType - The `unique symbol` types that act as options.
 *
 * @example * See the {@link Array.Options:type} type as an example.
 */
export type TOptions<OptionsType extends symbol = NoOptions> =
    | OptionsType
    | NoOptions;

export type TNullable<Type> =
    | Type
    | null
    | undefined;

export class AbstractMethodCallError extends Error
{
    public constructor(ClassName?: string)
    {
        super(ClassName);
    }
}
