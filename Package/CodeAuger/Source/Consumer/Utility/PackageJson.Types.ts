/**
 * @file      PackageJson.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IPackageJsonBase } from "../../Shared/Utility/PackageJson.Types.js";

/**
 * The type of the `"code-auger"` object in the `"config"` object
 * of the consumer's `package.json`.
 *
 * @property {string} config - The path (relative to `package.json`, or absolute)
 * to the config file.  This is only necessary iff the consumer's config file is
 * not named `code-auger.config.ts` or is not in the root directory of the package.
 */
export type CodeAugerConfig =
    Partial<{
        config: string;
    }>;

/* eslint-disable @typescript-eslint/no-empty-object-type */

/** The type for `package.json` of `code-auger` provider packages. */
export interface IPackageJson extends IPackageJsonBase<CodeAugerConfig> { }

/* eslint-enable @typescript-eslint/no-empty-object-type */
