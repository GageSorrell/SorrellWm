/**
 * The ESLint plugin used by SorrellWm *et al.*
 *
 * @module @sorrell/eslint-plugin
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ESLint, Rule } from "eslint";
import JsdocFileName from "./Rules/JsdocFileName.js";
import JsdocModuleNamePackage from "./Rules/JsdocModuleNamePackage.js";
import ReactDisplayName from "./Rules/ReactDisplayName.js";

export/**
       * The rules provided by this plugin, keyed by their kebab-case names.
       *
       * @since 1.0.0
       */
const rules: Record<string, Rule.RuleModule> = {
    "jsdoc-file-name": JsdocFileName,
    "jsdoc-module-name-package": JsdocModuleNamePackage,
    "react-displayname": ReactDisplayName
};

/**
 * The `@sorrell/eslint-plugin` ESLint plugin, ready to be registered under the
 * `@sorrell` namespace in a flat config's `plugins` map.
 *
 * @since 1.0.0
 */
const Plugin: ESLint.Plugin = {
    meta:
    {
        name: "@sorrell/eslint-plugin",
        version: "1.0.0"
    },
    rules
};

export default Plugin;
