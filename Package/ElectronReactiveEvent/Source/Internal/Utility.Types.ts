/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * The values of a given `Record`-like object.
 * @typeParam RecordLike - The record-like object from which value types are extracted.
 */
export type Values<RecordLike> = RecordLike[keyof RecordLike];
