/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * The values of a given `Record`-like object.
 * @typeParam RecordLike - The record-like object from which value types are extracted.
 */
export type Values<RecordLike> = RecordLike[keyof RecordLike];
