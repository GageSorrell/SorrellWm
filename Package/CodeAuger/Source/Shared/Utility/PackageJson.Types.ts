/**
 * @file      PackageJson.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IPackageJson } from "package-json-type";

/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * The base type for the `package.json` types that `code-auger` provides.
 *
 * @template ConfigType - The type of the `"code-auger"` object in the `"config"`
 * object.
 */
export interface IPackageJsonBase<ConfigType extends Record<string, unknown>> extends IPackageJson
{
    "code-auger"?: ConfigType;
}

/* eslint-enable @typescript-eslint/no-empty-object-type */
