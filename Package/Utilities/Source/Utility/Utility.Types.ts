/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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
export type Values<RecordLike> = RecordLike[keyof RecordLike];
