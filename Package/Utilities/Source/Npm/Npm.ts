/* File:      Npm.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { promises as Fs, constants as FsConstants } from "fs";
import { PackageJsonParseError, RootDirectoryNotFound } from "./Npm.Error.js";
import { dirname, join, resolve } from "path";
import { Effect } from "effect";
import type { GetPackageJsonEffect } from "./Npm.Types.js";
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
 * with {@link RootDirectoryNotFound} or {@link PackageJsonParseError}.
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

// export function GetPackageJson(Path?: string): GetPackageJsonEffect
// {
//     // const Root: string = await GetPackageRootDirectory(Path);

//     async function Inner(): Promise<string>
//     // return JSON.parse(resolve(Root, "package.json")) as IPackageJson;

//     /* eslint-disable-next-line @typescript-eslint/typedef */
//     return Effect.gen(function* ()
//     {
//         const FileContents: string = yield* Effect.tryPromise({
//             catch: (Cause: unknown) => Cause,
//             try: () => GetPackageRootDirectory(Path)
//         }).pipe(
//             Effect.catchAll((Cause: unknown) =>
//             {
//                 if (HasErrorCode(Cause) && Cause.code === "ENOENT")
//                 {
//                     return Effect.fail(
//                         new PackageJsonNotFoundError({
//                             Cause,
//                             Path
//                         })
//                     );
//                 }

//                 return Effect.die(Cause);
//             })
//         );

//         const PackageJson: IPackageJson = yield* Effect.try({
//             catch: (Cause: unknown) =>
//                 new PackageJsonParseError({
//                     Cause,
//                     Path
//                 }),
//             try: () => JSON.parse(FileContents) as IPackageJson
//         });

//         return PackageJson;
//     });
// }

/**
 * Get the root directory of the Node.js project in which the
 * current working directory resides.
 *
 * @param Path - *(Optional)* The given path from which to look for a root directory.
 *
 * @throws `Error` iff the current working directory is not within a Node.js project.
 *
 * @returns The path of the root directory of the Node.js project in which the
 * current working directory resides.
 */
/**
 * Get the root directory of the Node.js project in which the
 * current working directory resides.
 *
 * @param Path - *(Optional)* The given path from which to look for a root directory.
 *
 * @returns An Effect that succeeds with the package root directory, or fails
 * with {@link RootDirectoryNotFound}.
 */
export function GetPackageRootDirectory(
    Path?: string
): Effect.Effect<string, RootDirectoryNotFound, never>
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
                    new RootDirectoryNotFound({ Path })
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
