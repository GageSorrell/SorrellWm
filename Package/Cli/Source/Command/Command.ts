/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { GetPackageJson } from "@sorrell/utilities/npm";
import type { IPackageJson } from "package-json-type";

export/**
       * All CLI commands have `version` that is this package's version.
       *
       * @throws {Error} If it cannot find or get a valid semver from this package's `package.json`.
       */
async function GetVersion(): Promise<string>
{
    const PackageJson: IPackageJson = await Effect.runPromise(GetPackageJson());
    return PackageJson.version || "";
};
