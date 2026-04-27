/**
 * @file      Npm.Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PackageJsonParseError, RootDirectoryNotFoundError } from "./Npm.Error.ts";
import type { Effect } from "effect";
import type { IPackageJson } from "package-json-type";

export type EGetPackageJson =
    Effect.Effect<
        IPackageJson,
        PackageJsonParseError | RootDirectoryNotFoundError,
        never
    >;

export type EGetPackageRootDirectory =
    Effect.Effect<
        string,
        RootDirectoryNotFoundError,
        never
    >;
