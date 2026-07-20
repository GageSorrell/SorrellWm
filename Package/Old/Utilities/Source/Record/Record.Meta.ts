/**
 * @file      Record.Meta.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Maps a given {@link RecordLike} type to an identical {@link Record} type, but
 * the properties are wrapped with {@link NonNullable}.
 *
 * @template RecordLike - The `Record`-like type from which this type is defined.
 */
export type RecordNonNullable<RecordLike> =
    {
        [ Key in keyof RecordLike ]: NonNullable<RecordLike[Key]>;
    };
