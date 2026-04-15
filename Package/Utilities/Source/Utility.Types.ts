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
