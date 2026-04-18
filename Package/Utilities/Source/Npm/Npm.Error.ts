/* File:      Npm.Error.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Data } from "effect";

/**
 * An error describing that {@link GetPackageJson} failed to parse the discovered `package.json` file.
 *
 * @field Path - The `Path` argument passed to the effect returning this error, if one was given.
 * @field Cause - The cause of this error.
 */
export class PackageJsonParseError extends Data.TaggedError("PackageJsonParseError")<{
    readonly Path: string | undefined;
    readonly Cause: unknown;
}> { }

/**
 * An error describing that {@link GetPackageRootDirectory} failed.
 *
 * @field Path - The `Path` argument passed to the effect returning this error, if one was given.
 */
export class RootDirectoryNotFound extends Data.TaggedError("RootDirectoryNotFound")<{
    readonly Path: string | undefined;
}> { }
