/**
 * @file      Npm.Effect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BadArgument, SystemError } from "@effect/platform/Error";
import type {
    EGetDependencyPackage,
    EGetNodeModulesPath,
    EGetPackage,
    EGetPackageRootDirectory
} from "./Npm.Effect.Types.ts";
import { Effect, Schema } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import {
    FindNearestNodeModulesDirectory,
    FindNearestPackageDirectory,
    GetPathType,
    HasErrorCode
} from "./Npm.Effect.Internal.ts";
import { promises as Fs, constants as FsConstants } from "fs";
import { PackageJsonParseError, RootDirectoryNotFoundError } from "./Npm.Error.ts";
import { dirname, join } from "path";
import type { IPackageJson } from "package-json-type";
import Process from "process";

/**
 * Get the `package.json` of the Node.js project in which the
 * given path, or the current working directory, resides.
 *
 * @param Path - The given path from which to look for a root directory.
 *
 * @returns {EGetPackage} An Effect that succeeds with the parsed `package.json`, or fails
 * with {@link RootDirectoryNotFoundError} or {@link PackageJsonParseError}.
 *
 * @example
 * Suppose `process.cwd() === "./MyPackage"`,
 * ```typescript
 * Effect.gen(function* ()
 * {
 *     const PackageJson: IPackageJson = yield* GetPackageJson();
 *     // `PackageJson` <- *The parsed `package.json` of `MyPackage`.*
 * }
 * ```
 */
export function GetPackageJson(Path?: string): EGetPackage
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
 * @returns {EGetPackageRootDirectory} An Effect that succeeds with the package root
 * directory, or fails with {@link RootDirectoryNotFoundError}.
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
export function GetPackageRootDirectory(Path?: string): EGetPackageRootDirectory
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

/* eslint-disable jsdoc/require-example */

/**
 * For a given `npm` package, identified by a {@link Directory} path contained by the `npm` package,
 * get the path to the `node_modules` directory that contains the dependencies of the package.
 *
 * @note This supports `npm` workspaces, and has not been tested with packages that are workspaces
 * of packages handled by *other* package managers.
 *
 * @param Directory - The path of a directory within an `npm` package (possibly
 * the root directory of the package).
 *
 * @returns {EGetNodeModulesPath} An {@link Effect.Effect | effect} that finds the
 * `node_modules` directory of an `npm` package that contains the given {@link Directory}.
 */
export function GetNodeModulesDirectory(
    Directory: string = process.cwd()
): EGetNodeModulesPath
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const ResolvedDirectory: string = Path.resolve(Directory);
        const ResolvedDirectoryType: FileSystem.File.Type | undefined =
            yield* GetPathType(
                Fs,
                ResolvedDirectory
            );

        if (ResolvedDirectoryType !== "Directory")
        {
            return yield* Effect.fail(
                new BadArgument({
                    description: `Expected a directory path, but received "${ ResolvedDirectory }"`,
                    method: "GetNodeModulesDirectory",
                    module: "FileSystem"
                })
            );
        }

        const RealDirectory: string = yield* Fs.realPath(ResolvedDirectory);

        const PackageDirectory: string | undefined = yield* FindNearestPackageDirectory(
            Fs,
            Path,
            RealDirectory
        );

        if (PackageDirectory === undefined)
        {
            return yield* Effect.fail(
                new SystemError({
                    description: "Could not find a package.json in this directory or any ancestor directory.",
                    method: "GetNodeModulesDirectory",
                    module: "FileSystem",
                    pathOrDescriptor: RealDirectory,
                    reason: "NotFound"
                })
            );
        }

        const NodeModulesDirectory: string | undefined = yield* FindNearestNodeModulesDirectory(
            Fs,
            Path,
            PackageDirectory
        );

        if (NodeModulesDirectory === undefined)
        {
            return yield* Effect.fail(
                new SystemError({
                    description:
                        "Could not find a node_modules directory for this package " +
                        "or any ancestor workspace/package directory.",
                    method: "GetNodeModulesDirectory",
                    module: "FileSystem",
                    pathOrDescriptor: PackageDirectory,
                    reason: "NotFound"
                })
            );
        }

        return NodeModulesDirectory;
    });
}

/**
 * For a given `npm` package, identified by a {@link Directory} path contained by the `npm` package
 * and whose dependencies are installed on the current file system, and for a given {@link Dependency}
 * of that package, get the {@link IPackageJson | package.json} of the given dependency in the `node_modules`
 * directory that contains the dependencies of the given package.
 *
 * @note This supports `npm` workspaces, and has not been tested with packages that are workspaces
 * of packages handled by *other* package managers.
 *
 * @param Dependency - The name of the dependency whose {@link IPackageJson | package.json} is returned
 * by this.
 *
 * @param Directory - The path of a directory within an `npm` package (possibly
 * the root directory of the package).
 *
 * @returns {EGetDependencyPackage} An {@link Effect.Effect | effect} that returns
 * the {@link IPackageJson | package.json} of the given {@link Dependency}, for
 * the `npm` package identified by the given {@link Directory}.
 */
export function GetDependencyPackage(
    Dependency: string,
    Directory: string = process.cwd()
): EGetDependencyPackage
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const NodeModulesPath: string = yield* GetNodeModulesDirectory(Directory);

        const PackageJsonPath: string = Path.resolve(NodeModulesPath, "package.json");

        const PackageJsonContents: string = yield* Fs.readFileString(PackageJsonPath);

        return (yield* Schema.decodeUnknown(Schema.parseJson())(PackageJsonContents)) as IPackageJson;
    });
}

/* eslint-enable jsdoc/require-example */
