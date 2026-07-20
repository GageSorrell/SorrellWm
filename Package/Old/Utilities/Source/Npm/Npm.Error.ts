/**
 * @file      Npm.Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "@sorrell/effect";

/**
 * An error describing that {@link GetPackageJson} failed to parse the discovered `package.json` file.
 *
 * @property {string | undefined} Path - The `Path` argument passed to the effect returning this error,
 * if one was given.
 * @property {unknown} Cause - The cause of this error.
 */
export class PackageJsonParseError
    extends Data.TaggedError("PackageJsonParseError")<{
        readonly Path: string | undefined;
        readonly Cause: unknown;
    }> { }

/**
 * An error describing that {@link GetPackageRootDirectory} failed.
 *
 * @property {string | undefined} Path - The `Path` argument passed to the effect returning
 * this error, if one was given.
 */
export class RootDirectoryNotFoundError
    extends Data.TaggedError("RootDirectoryNotFound")<{
        readonly Path: string | undefined;
    }> { }
