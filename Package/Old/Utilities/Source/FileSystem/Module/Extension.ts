/**
 * @file      Extension.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

/* eslint-disable @typescript-eslint/typedef */

export/**
       * The valid file extensions for TypeScript *source* modules.
       */
const Source =
    [
        ".ts",
        ".tsx",
        ".mts",
        ".cts"
    ] as const;

export/**
       * The valid file extensions for TypeScript *declaration* modules.
       */
const Declaration =
    [
        ".d.ts",
        ".d.mts",
        ".d.cts"
    ] as const;

export/**
       * The valid file extensions for *any* TypeScript module.
       */
const Any =
    [
        ".ts",
        ".tsx",
        ".mts",
        ".cts",
        ".d.ts",
        ".d.mts",
        ".d.cts"
    ] as const;

/* eslint-enable @typescript-eslint/typedef */

export/**
       * A {@link RegExp | regular expression} that describes all file names
       * with a valid extension.
       */
const IsValidRegExp: RegExp = /\.(ts|tsx|mts|cts|d\.ts|d\.mts|d\.cts)$/iu;

/**
 * Determine whether a given {@link In | string} is a {@link Any | valid TypeScript module extension}.
 *
 * @param In - The string to test.
 *
 * @returns {In is Any} Whether the given {@link In | string} is a valid TypeScript module extension.
 */
export function IsValid(In: string): In is Any
{
    return IsValidRegExp.test(In);
}

/** The type of any valid TypeScript module file extension. */
export type Any = typeof Any[number];

/** The type of any valid TypeScript *declaration* module file extension. */
export type Declaration = typeof Declaration[number];

/** The type of any valid TypeScript *source* module file extension. */
export type Source = typeof Source[number];

/** Specify how file extensions should be used in the context of module file names. */
export type Policy =
    /** An extension name is required in the given context. */
    | "Require"

    /** Extension names are *banned* in the given context. */
    | "Disallow"

    /** An extension name is required *and* must be one of the extensions in this {@link ReadonlyArray}. */
    | ReadonlyArray<Any>;
