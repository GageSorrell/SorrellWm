/**
 * @file      Npm.Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Append, Requirements } from "../Effect/Effect.Types.ts";
import type {
    PackageJsonParseError,
    RootDirectoryNotFoundError
} from "./Npm.Error.ts";
import type { Effect } from "effect";
import type { IPackageJson } from "package-json-type";
import type { PlatformError } from "@effect/platform/Error";
import type { ParseError } from "effect/ParseResult";

export type EGetPackage =
    Effect.Effect<
        IPackageJson,
        | PackageJsonParseError
        | RootDirectoryNotFoundError,
        never
    >;

export type EGetNodeModulesPath =
    Effect.Effect<
        string,
        PlatformError,
        Requirements.FsPath
    >;

export type EGetDependencyPackage =
    Effect.Effect<
        IPackageJson,
        | PlatformError
        | ParseError,
        Requirements.FsPath
    >;

export type EGetPackageRootDirectory =
    Effect.Effect<
        string,
        RootDirectoryNotFoundError,
        never
    >;
