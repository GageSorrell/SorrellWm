/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Defines a type that corresponds to {@link RecordLike}, such that every
 * `readonly` modifier is removed, recursively.
 *
 * @typeParam RecordLike - The type to make writeable.
 */
export type TDeepWriteable<RecordLike> =
    {
        -readonly [ Key in keyof RecordLike ]: TDeepWriteable<RecordLike[Key]>
    };

/**
 * Given a {@link RecordLike | record-like type}, this type is the union
 * of the values of all properties in the {@link RecordLike | record-like type}.
 *
 * @typeParam RecordLike - The record-like type from which this type extracts value types.
 */
export type TValues<RecordLike> = RecordLike[keyof RecordLike];

/**
 * The union of a given {@link ElementType} and the array of a given {@link ElementType}.
 *
 * @typeParam ElementType - The type of this, or the type of elements contained by this.
 */
export type TMaybeArray<ElementType> =
    | ElementType
    | Array<ElementType>;
