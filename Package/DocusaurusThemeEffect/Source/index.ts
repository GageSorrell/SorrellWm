/**
 * Public exports for `@sorrell/docusaurus-theme-effect`.
 *
 * @module @sorrell/docusaurus-theme-effect
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "@docusaurus/types";

export const DocusaurusThemeEffectTypeId = Symbol.for("@sorrell/docusaurus-theme-effect");
export type DocusaurusThemeEffectTypeId = typeof DocusaurusThemeEffectTypeId;
const PackageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Package adapter consumed by `@sorrell/site-core`. @category Configuration @since 1.0.0 */
export const EffectDocusaurusTheme = { PackageName: "@sorrell/docusaurus-theme-effect" } as const;

/** Docusaurus theme plugin. @category Plugin @since 1.0.0 */
export default function DocusaurusThemeEffect(): Plugin
{
    return {
        getClientModules: () => [ resolve(PackageDirectory, "Source", "Style.css") ],
        getThemePath: () => resolve(PackageDirectory, "Distribution", "theme"),
        name: "@sorrell/docusaurus-theme-effect"
    };
}
