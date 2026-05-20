/**
 * @file      Npm.Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PackageJsonParseError, RootDirectoryNotFoundError } from "./Npm.Error.ts";
import type { Effect } from "effect";
import type { IBase } from "package-json-type";

export type EGetPackageJson =
    Effect.Effect<
        IBase,
        PackageJsonParseError | RootDirectoryNotFoundError,
        never
    >;

export type EGetPackageRootDirectory =
    Effect.Effect<
        string,
        RootDirectoryNotFoundError,
        never
    >;
