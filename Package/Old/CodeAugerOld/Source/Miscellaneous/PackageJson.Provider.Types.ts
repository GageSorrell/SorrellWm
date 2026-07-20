/**
 * @file      PackageJson.Provider.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CodeAugerPackageConfig as ConsumerConfig } from "./PackageJson.Consumer.Types.js";
import type { IPackageJsonBase } from "./PackageJson.Internal.Types.js";

/**
 * The optional settings for a package that uses `code-auger`,
 * specified in that package's `package.json` file under the
 * property `"code-auger"`.
 *
 * @property {string} config - The path to the `code-auger` config file.
 * If this is not specified, then the default path `./code-auger.config.ts` is used (relative to
 * the directory containing the `package.json` file).
 *
 * @property {string} manifest - The path to the `code-auger` manifest file.
 * If this is not specified, then the default path `./code-auger.manifest.ts` is used (relative to
 * the directory containing the `package.json` file).
 */
export type CodeAugerPackageConfig =
    ConsumerConfig &
    Partial<{
        manifest: string;
    }>;


/**
 * The type of `package.json`, with an additional *optional* field
 * `"code-auger"`, to support basic settings for `code-auger`.
 */
export interface IPackageJson extends IPackageJsonBase<CodeAugerPackageConfig> { }


export default IPackageJson;
