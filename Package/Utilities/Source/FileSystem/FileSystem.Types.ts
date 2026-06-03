/**
 * @file      FileSystem.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type FFileExtension = `.${ string }`;

/** A simple classification of the objects that exist in a given filesystem. */
export type Kind =
    /** A file in a given filesystem. */
    | "File"
    /** A directory in a given filesystem. */
    | "Directory"
    /** A file *or* directory in a given filesystem. */
    | "FileOrDirectory";
