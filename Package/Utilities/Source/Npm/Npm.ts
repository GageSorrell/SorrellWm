/**
 * @file      Npm.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { promises as Fs, constants as FsConstants } from "fs";
import { PackageJsonParseError, RootDirectoryNotFoundError } from "./Npm.Error.ts";
import { dirname, join } from "path";
import { Effect } from "effect";
import type { GetPackageJsonEffect } from "./Npm.Types.ts";
import type { IPackageJson } from "package-json-type";
import Process from "process";

/* eslint-disable-next-line jsdoc/require-jsdoc */
function HasErrorCode(Value: unknown): Value is { readonly code: string }
{
    return typeof Value === "object"
        && Value !== null
        && "code" in Value
        && typeof (Value as { readonly code: unknown }).code === "string";
}

/**
 * Get the `package.json` of the Node.js project in which the
 * given path, or the current working directory, resides.
 *
 * @param Path - *(Optional)* The given path from which to look for a root directory.
 *
 * @returns An Effect that succeeds with the parsed `package.json`, or fails
 * with {@link RootDirectoryNotFoundError} or {@link PackageJsonParseError}.
 */
export function GetPackageJson(
    Path?: string
): GetPackageJsonEffect
{
    return Effect.gen(function* ()
    {
        const RootDirectory: string = yield* GetPackageRootDirectory(Path);
        const PackageJsonPath: string = join(RootDirectory, "package.json");

        const FileContents: string = yield* Effect.tryPromise({
            catch: (Cause: unknown) => Cause,
            try: () => Fs.readFile(PackageJsonPath, "utf-8")
        }).pipe(
            Effect.catchAll((Cause: unknown) => Effect.die(Cause))
        );

        const PackageJson: IPackageJson = yield* Effect.try({
            catch: (Cause: unknown) =>
                new PackageJsonParseError({
                    Cause,
                    Path: PackageJsonPath
                }),
            try: () => JSON.parse(FileContents) as IPackageJson
        });

        return PackageJson;
    });
}

/**
 * Get the root directory of the Node.js project in which the
 * current working directory resides.
 *
 * @param Path - *(Optional)* The given path from which to look for a root directory.
 *
 * @returns An Effect that succeeds with the package root directory, or fails
 * with {@link RootDirectoryNotFoundError}.
 *
 * @example
 * Suppose `process.cwd()` is any one of the following,
 *   - `/home/alex/myPackage`,
 *   - `/home/alex/myPackage/src/MyModule`,
 *   - `/home/alex/myPackage/resource/Images`,
 *
 * then,
 *
 * ```typescript
 * import { Effect } from "effect";
 * const Root: string = await Effect.runPromise(GetPackageRootDirectory());
 * // `Root` <- `"/home/alex/myPackage"`
 * ```
 *
 * @example
 * Suppose `TestPath === "/home/alex/Documents"` is *not* a NodeJS package root
 * (of course, neither are `/home/alex` or `/home`).  Then,
 *
 * ```typescript
 * import { Effect } from "effect";
 * const TestPath: string = "/home/alex/Documents";
 * let Root: string | undefined = undefined;
 * try
 * {
 *     Root = await Effect.runPromise(
 *         GetPackageRootDirectory(TestPath)
 *     );
 * }
 * catch (Error: unknown)
 * {
 *      // `Error instanceof RootDirectoryNotFound`
 * }
 *
 * // `Root` <- `undefined`
 * ```
 *
 * @example
 * Suppose `process.cwd() === /home/alex/Downloads`, which is *not* a NodeJS package
 * (of course, neither are `/home/alex` or `/home`).  Then,
 *
 * ```typescript
 * import { Effect } from "effect";
 * let Root: string | undefined = undefined;
 * try
 * {
 *     Root = await Effect.runPromise(GetPackageRootDirectory());
 * }
 * catch (Error: unknown)
 * {
 *      // `Error instanceof RootDirectoryNotFound`
 * }
 * // `Root` <- `undefined`
 * ```
 */
export function GetPackageRootDirectory(
    Path?: string
): Effect.Effect<string, RootDirectoryNotFoundError, never>
{
    return Effect.gen(function* ()
    {
        let CurrentDirectory: string = yield* Effect.tryPromise({
            catch: (Cause: unknown) => Cause,
            try: () => Fs.realpath(Path ?? Process.cwd())
        }).pipe(
            Effect.catchAll((Cause: unknown) => Effect.die(Cause))
        );

        while (true)
        {
            const PackageJsonPath: string = join(CurrentDirectory, "package.json");

            const PackageJsonExists: boolean = yield* Effect.tryPromise({
                catch: (Cause: unknown) => Cause,
                try: () => Fs.access(PackageJsonPath, FsConstants.F_OK)
            }).pipe(
                Effect.as(true),
                Effect.catchIf(
                    (Cause: unknown): Cause is { readonly code: string } =>
                        HasErrorCode(Cause) && Cause.code === "ENOENT",
                    () => Effect.succeed(false)
                ),
                Effect.catchAll((Cause: unknown) => Effect.die(Cause))
            );

            if (PackageJsonExists)
            {
                return CurrentDirectory;
            }

            const ParentDirectory: string = dirname(CurrentDirectory);

            if (ParentDirectory === CurrentDirectory)
            {
                return yield* Effect.fail(
                    new RootDirectoryNotFoundError({ Path })
                );
            }

            CurrentDirectory = ParentDirectory;
        }
    });
}
// export async function GetPackageRootDirectory(Path?: string): Promise<string>
// {
//     let CurrentDirectory: string = await realpath(Path || Process.cwd());

//     while (true)
//     {
//         const PackageJsonPath: string = join(CurrentDirectory, "package.json");

//         try
//         {
//             await access(PackageJsonPath, FsConstants.F_OK);
//             return CurrentDirectory;
//         }
//         catch { /* Empty */ }

//         const ParentDirectory: string = dirname(CurrentDirectory);

//         if (ParentDirectory === CurrentDirectory)
//         {
//             throw new Error(
//                 `Could not find a Node.js project root above "${ Path || Process.cwd() }".`
//             );
//         }

//         CurrentDirectory = ParentDirectory;
//     }
// }
