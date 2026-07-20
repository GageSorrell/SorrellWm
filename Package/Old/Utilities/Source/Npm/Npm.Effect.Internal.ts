/**
 * @file      Npm.Effect.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Path as EffectPath, FileSystem } from "@sorrell/effect";
import type * as PlatformError from "@sorrell/effect/PlatformError";
import { Effect, pipe } from "@sorrell/effect";

/* eslint-disable jsdoc/require-example */

/**
 * Returns whether a given {@link Value} contains a `readonly` `string` `"code"`.
 *
 * @param Value - The value to test.
 * @returns {Value is { readonly code: string }} Whether {@link Value} is a
 * `{ readonly code: string }`.
 */
export function HasErrorCode(Value: unknown): Value is { readonly code: string }
{
    return typeof Value === "object"
        && Value !== null
        && "code" in Value
        && typeof (Value as { readonly code: unknown }).code === "string";
}

/**
 * Starting at {@link Directory}, traverse upward until the root directory of a NodeJS package is found,
 * then return the path to that directory.
 *
 * @param Fs - The {@link FileSystem.FileSystem} service.
 * @param Path - The {@link EffectPath.Path | Path} service.
 * @param Directory - The path of the directory from which this begins to search.
 * @returns {Effect.Effect<string | undefined, PlatformError.PlatformError>} An {@link Effect.Effect | effect} which
 * finds the nearest package directory.
 */
export function FindNearestPackageDirectory(
    Fs: FileSystem.FileSystem,
    Path: EffectPath.Path,
    Directory: string
): Effect.Effect<string | undefined, PlatformError.PlatformError>
{
    return Effect.gen(function* ()
    {
        let CurrentDirectory: string | undefined = Directory;

        while (CurrentDirectory !== undefined)
        {
            const PackageManifestPath: string = Path.join(CurrentDirectory, "package.json");

            const PackageManifestType: FileSystem.File.Type | undefined =
                yield* GetPathType(
                    Fs,
                    PackageManifestPath
                );

            if (PackageManifestType === "File")
            {
                return CurrentDirectory;
            }

            CurrentDirectory = GetParentDirectory(Path, CurrentDirectory);
        }

        return undefined;
    });
}

/**
 * Starting at {@link Directory} within a given `npm` package, traverse upward until
 * the `node_modules` directory containing the dependencies of the given `npm` package is found.
 *
 * @param Fs - The {@link FileSystem.FileSystem} service.
 * @param Path - The {@link EffectPath.Path | Path} service.
 * @param Directory - The path of the directory from which this begins to search.
 * @returns {Effect.Effect<string | undefined, PlatformError>} An {@link Effect.Effect | effect} which
 * finds the nearest `node_modules` directory.
 */
export function FindNearestNodeModulesDirectory(
    Fs: FileSystem.FileSystem,
    Path: EffectPath.Path,
    Directory: string
): Effect.Effect<string | undefined, PlatformError.PlatformError>
{
    return Effect.gen(function* ()
    {
        let CurrentDirectory: string | undefined = Directory;

        while (CurrentDirectory !== undefined)
        {
            const CandidateNodeModulesDirectory: string = Path.join(
                CurrentDirectory,
                "node_modules"
            );

            const CandidateNodeModulesType: FileSystem.File.Type | undefined =
                yield* GetPathType(
                    Fs,
                    CandidateNodeModulesDirectory
                );

            if (CandidateNodeModulesType === "Directory")
            {
                return CandidateNodeModulesDirectory;
            }

            CurrentDirectory = GetParentDirectory(Path, CurrentDirectory);
        }

        return undefined;
    });
}

/**
 * For a given {@link Path}, get the {@link FileSystem.File.Type | type} of the object at that path.
 *
 * @param Fs - The {@link FileSystem.FileSystem | FileSystem} service.
 * @param Path - The path whose type is returned by this.
 * @returns {Effect.Effect<FileSystem.File.Type | undefined, PlatformError>} An
 * {@link Effect.Effect | effect} that finds the {@link FileSystem.File.Type | type} of the
 * given {@link Path}.
 */
export function GetPathType(
    Fs: FileSystem.FileSystem,
    Path: string
): Effect.Effect<FileSystem.File.Type, PlatformError.PlatformError>
{
    return pipe(
        Path,
        Fs.stat,
        Effect.map((FileInformation: FileSystem.File.Info) => FileInformation.type)
    );
}

/**
 * For a given {@link Directory}, if that directory has a parent directory, then return
 * the path to the parent directory, otherwise return `undefined`.
 *
 * @param Path - The {@link EffectPath.Path | Path} service.
 * @param Directory - The path of the directory whose parent path is found, if it exists.
 * @returns {string | undefined} The path of the parent directory of the given {@link Directory},
 * if it has a parent directory (otherwise `undefined`).
 */
export function GetParentDirectory(
    Path: EffectPath.Path,
    Directory: string
): string | undefined
{
    const ParentDirectory: string = Path.dirname(Directory);

    if (ParentDirectory === Directory)
    {
        return undefined;
    }

    return ParentDirectory;
};

/* eslint-enable jsdoc/require-example */
