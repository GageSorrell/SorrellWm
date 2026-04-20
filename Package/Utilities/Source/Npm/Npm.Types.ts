/**
 * @file      Npm.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PackageJsonParseError, RootDirectoryNotFoundError } from "./Npm.Error.js";
import type { Effect } from "effect";
import type { IPackageJson } from "package-json-type";

export type GetPackageJsonEffect =
    Effect.Effect<
        IPackageJson,
        PackageJsonParseError | RootDirectoryNotFoundError,
        never
    >;
