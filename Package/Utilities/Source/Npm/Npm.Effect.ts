/**
 * @file      Npm.Effect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Array,
    Effect,
    FileSystem, Path as PathService,
    PlatformError,
    Predicate,
    Record,
    Schema,
    pipe
} from "@sorrell/effect";
import type {
    EGetDependencies,
    EGetDependencyPackage,
    EGetNodeModulesPath,
    EGetPackageJson,
    EGetPackageRootDirectory,
    PackageDependency
} from "./Npm.Effect.Types.ts";
import {
    FindNearestNodeModulesDirectory,
    FindNearestPackageDirectory,
    GetPathType
} from "./Npm.Effect.Internal.ts";
import type { IDependencyMap, IPackageJson } from "package-json-type";
import { SearchExhaustedError } from "../Effect/Platform/Platform.ts";
import process from "process";

/**
 * Get the `package.json` of the Node.js project in which the
 * given path, or the current working directory, resides.
 *
 * @param SearchStart - The given path from which to look for a root directory.
 *
 * @returns {EGetPackageJson} An Effect that succeeds with the parsed `package.json`, or fails
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
export function GetPackageJson(SearchStart?: string): EGetPackageJson
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: PathService.Path = yield* PathService.Path;

        const RootDirectory: string = yield* GetPackageRootDirectory(SearchStart);
        const PackageJsonPath: string = Path.join(RootDirectory, "package.json");

        const FileContents: string = yield* Fs.readFileString(PackageJsonPath);

        return (yield* pipe(
            FileContents,
            Schema.decodeUnknownEffect(Schema.UnknownFromJsonString)
        )) as IPackageJson;
    });
}

/**
 * Get the root directory of the Node.js project in which the
 * current working directory resides.
 *
 * @param SearchStart - If specified, this is the given path from which to look for a root directory.
 * Otherwise, the search is started from {@link process.cwd}.
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
 * import { Effect } from "@sorrell/effect";
 * const Root: string = await Effect.runPromise(GetPackageRootDirectory());
 * // `Root` <- `"/home/alex/myPackage"`
 * ```
 *
 * @example
 * Suppose `TestPath === "/home/alex/Documents"` is *not* a NodeJS package root
 * (of course, neither are `/home/alex` or `/home`).  Then,
 *
 * ```typescript
 * import { Effect } from "@sorrell/effect";
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
 * import { Effect } from "@sorrell/effect";
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
export function GetPackageRootDirectory(SearchStart?: string): EGetPackageRootDirectory
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: PathService.Path = yield* PathService.Path;

        const StartPath: string = yield* Fs.realPath(SearchStart ?? process.cwd());
        let CurrentDirectory: string = StartPath;

        while (true)
        {
            const PackageJsonPath: string = Path.join(CurrentDirectory, "package.json");

            const PackageJsonExists: boolean = yield* Fs.exists(PackageJsonPath);

            if (PackageJsonExists)
            {
                return CurrentDirectory;
            }

            const ParentDirectory: string = Path.dirname(CurrentDirectory);

            if (ParentDirectory === CurrentDirectory)
            {
                return yield* Effect.fail(new SearchExhaustedError({
                    Criteria: (
                        "A directory containing a package.json file, of which the given SearchStart " +
                        `parameter was "${ SearchStart }".`
                    ),
                    Kind: "Directory",
                    LastSearchResult: CurrentDirectory
                }));
            }

            CurrentDirectory = ParentDirectory;
        }
    });
}

/* eslint-disable jsdoc/require-example */

/**
 * For a given `npm` package, identified by a {@link Cwd} path contained by the `npm` package,
 * get the path to the `node_modules` directory that contains the dependencies of the package.
 *
 * @note This supports `npm` workspaces, and has not been tested with packages that are workspaces
 * of packages handled by *other* package managers.
 *
 * @param Cwd - The path of a directory within an `npm` package (possibly
 * the root directory of the package).
 *
 * @returns {EGetNodeModulesPath} An {@link Effect.Effect | effect} that finds the
 * `node_modules` directory of an `npm` package that contains the given {@link Cwd}.
 */
export function GetNodeModulesDirectory(Cwd?: string): EGetNodeModulesPath
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: PathService.Path = yield* PathService.Path;

        const ResolvedDirectory: string = Path.resolve(Cwd ?? process.cwd());
        const ResolvedDirectoryType: FileSystem.File.Type | undefined =
            yield* GetPathType(
                Fs,
                ResolvedDirectory
            );

        if (ResolvedDirectoryType !== "Directory")
        {
            return yield* Effect.fail(
                new PlatformError.BadArgument({
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
                new PlatformError.SystemError({
                    _tag: "NotFound",
                    description: "Could not find a package.json in this directory or any ancestor directory.",
                    method: "GetNodeModulesDirectory",
                    module: "FileSystem",
                    pathOrDescriptor: RealDirectory
                })
            );
        }

        const NodeModulesDirectory: string | undefined =
            yield* FindNearestNodeModulesDirectory(
                Fs,
                Path,
                PackageDirectory
            );

        if (NodeModulesDirectory === undefined)
        {
            return yield* Effect.fail(
                new PlatformError.SystemError({
                    _tag: "NotFound",
                    description:
                        "Could not find a node_modules directory for this package " +
                        "or any ancestor workspace/package directory.",
                    method: "GetNodeModulesDirectory",
                    module: "FileSystem",
                    pathOrDescriptor: PackageDirectory
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
        const Path: PathService.Path = yield* PathService.Path;

        const NodeModulesPath: string = yield* GetNodeModulesDirectory(Directory);

        const PackageJsonPath: string = Path.resolve(NodeModulesPath, "package.json");

        const PackageJsonContents: string = yield* Fs.readFileString(PackageJsonPath);

        return (yield* pipe(
            PackageJsonContents,
            Schema.decodeUnknownEffect(Schema.UnknownFromJsonString)
        )) as IPackageJson;
    });
}

/**
 * For a NodeJS project containing {@link SearchStart | a given directory}, get the names of its dependencies.
 *
 * @param Dependencies - If specified, then the "types" of dependencies to include, where each "type"
 * is identified by its key in the `package.json` file.  Otherwise, this is `"dependencies"` and
 * `"devDependencies"`.
 *
 * @param SearchStart - If specified, the path from which the search for the `package.json` will begin.
 * Otherwise, it is {@link process!cwd}.
 *
 * @returns {EGetDependencies} An {@link Effect!Effect | effect} that returns the dependencies
 * of the package containing the given {@link SearchStart}
 */
export function GetDependencies(
    Dependencies: ReadonlyArray<PackageDependency> = [ "dependencies", "devDependencies" ] as const,
    SearchStart: string = process.cwd()
): EGetDependencies
{
    return Effect.gen(function* ()
    {
        const PackageJson: IPackageJson = yield* GetPackageJson(SearchStart);

        /* eslint-disable-next-line jsdoc/require-jsdoc */
        function IsInDependencies(Key: string): Key is PackageDependency
        {
            return Dependencies.includes(Key as PackageDependency);
        }

        /* eslint-disable-next-line jsdoc/require-jsdoc */
        function GetNamesFromProperty(
            Value: IDependencyMap | ReadonlyArray<string>,
            _Index: number
        ): ReadonlyArray<string>
        {
            if (Array.isArray(Value))
            {
                return Value as ReadonlyArray<string>;
            }
            else
            {
                return Record.keys(Value as Record<string, string>);
            }
        }

        /* eslint-disable-next-line jsdoc/require-jsdoc */
        function IsDependencyProperty(
            Value: unknown,
            Key: string
        ): Value is ReadonlyArray<string> | IDependencyMap
        {
            return (
                IsInDependencies(Key) &&
                Predicate.isObjectOrArray(Value)
            );
        }

        return pipe(
            PackageJson,
            Record.filter(IsDependencyProperty),
            Record.values,
            Array.flatMap(GetNamesFromProperty)
        );
    });
}

/* eslint-enable jsdoc/require-example */
