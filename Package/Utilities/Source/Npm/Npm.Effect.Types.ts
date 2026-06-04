/**
 * @file      Npm.Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FileSystem, Path } from "@effect/platform";
import type { CliApp } from "@sorrell/effect/unstable/cli";
import type { Effect } from "effect";
import type { IPackageJson } from "package-json-type";
import type { ParseError } from "effect/ParseResult";
import type { PlatformError } from "@effect/platform/Error";
import type { SearchExhaustedError } from "../Effect/Platform";

export type EGetPackageJson =
    Effect.Effect<
        IPackageJson,
        | SearchExhaustedError
        | PlatformError
        | ParseError,
        | Path.Path
        | FileSystem.FileSystem
    >;

export type EGetNodeModulesPath =
    Effect.Effect<
        string,
        | SearchExhaustedError
        | PlatformError,
        | Path.Path
        | FileSystem.FileSystem
    >;

export type EGetDependencyPackage =
    Effect.Effect<
        IPackageJson,
        | SearchExhaustedError
        | PlatformError
        | ParseError,
        | Path.Path
        | FileSystem.FileSystem
    >;

export type EGetPackageRootDirectory =
    Effect.Effect<
        string,
        | SearchExhaustedError
        | PlatformError,
        | Path.Path
        | FileSystem.FileSystem
    >;

export type EGetDependencies =
    Effect.Effect<
        ReadonlyArray<string>,
        | SearchExhaustedError
        | PlatformError
        | ParseError,
        | Path.Path
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
