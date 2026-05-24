/**
 * @file      PackageJson.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CodeAugerConfig as ConsumerConfig } from "../../Consumer/Utility/PackageJson.Types.js";
import type { IPackageJsonBase } from "../../Shared/Utility/PackageJson.Types.js";

/**
 * The type of the `"code-auger"` object in the `"config"` object
 * of the provider's `package.json`.
 *
 * @note The `config` property is only needed if the provider is also `code-auger`
 * to generate code within their package as well.
 *
 * @property {string} manifest - The path (relative to `package.json`, or absolute)
 * to the manifest file.  This is only necessary iff the provider's manifest file is
 * not named `code-auger.manifest.ts` or is not in the root directory of the package.
 */
export type CodeAugerConfig =
    ConsumerConfig &
    Partial<{
        manifest: string;
    }>;

/* eslint-disable @typescript-eslint/no-empty-object-type */

/** The type for `package.json` of `code-auger` provider packages. */
export interface IPackageJson extends IPackageJsonBase<CodeAugerConfig> { }

/* eslint-enable @typescript-eslint/no-empty-object-type */
