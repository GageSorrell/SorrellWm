/**
 * @file      PackageJson.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IPackageJson as IBase } from "package-json-type";

/**
 * The type of `package.json`, with an additional *optional* field
 * `"code-auger"`, to support basic settings for `code-auger`.
 */
export interface IPackageJsonBase<ConfigType> extends IBase
{
    "code-auger"?: ConfigType;
}
