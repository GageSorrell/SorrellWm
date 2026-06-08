/**
 * @file      Npm.Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect, FileSystem, Path as PathService, PlatformError, Schema } from "@sorrell/effect";
import type { IPackageJson } from "package-json-type";
import type { SearchExhaustedError } from "../Effect/Platform";

export type EGetPackageJson =
    Effect.Effect<
        IPackageJson,
        | SearchExhaustedError
        | PlatformError.PlatformError
        | Schema.SchemaError,
        | PathService.Path
        | FileSystem.FileSystem
    >;

export type EGetNodeModulesPath =
    Effect.Effect<
        string,
        | SearchExhaustedError
        | PlatformError.BadArgument
        | PlatformError.SystemError
        | PlatformError.PlatformError,
        | PathService.Path
        | FileSystem.FileSystem
    >;

export type EGetDependencyPackage =
    Effect.Effect<
        IPackageJson,
        | SearchExhaustedError
        | PlatformError.PlatformError
        | Schema.SchemaError
        | PlatformError.BadArgument
        | PlatformError.SystemError,
        | PathService.Path
        | FileSystem.FileSystem
    >;

export type EGetPackageRootDirectory =
    Effect.Effect<
        string,
        | SearchExhaustedError
        | PlatformError.PlatformError,
        | PathService.Path
        | FileSystem.FileSystem
    >;

export type EGetDependencies =
    Effect.Effect<
        ReadonlyArray<string>,
        | SearchExhaustedError
        | PlatformError.PlatformError
        | Schema.SchemaError,
        | PathService.Path
        | FileSystem.FileSystem
    >;

/** The different "types" of dependencies that a `package.json` can specify. */
export type PackageDependency =
    | "dependencies"
    | "devDependencies"
    | "peerDependencies"
    | "optionalDependencies"
    | "bundleDependencies"
    | "bundledDependencies";
