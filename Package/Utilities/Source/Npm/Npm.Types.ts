/* File:      Npm.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PackageJsonParseError, RootDirectoryNotFound } from "./Npm.Error.js";
import type { Effect } from "effect";
import type { IPackageJson } from "package-json-type";

export type GetPackageJsonEffect =
    Effect.Effect<
        IPackageJson,
        PackageJsonParseError | RootDirectoryNotFound,
        never
    >;
