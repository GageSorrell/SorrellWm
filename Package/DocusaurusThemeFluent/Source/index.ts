/**
 *
 *
 * @module @sorrell/docusaurus-theme-fluent
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "@docusaurus/types";

export const DocusaurusThemeFluentTypeId = Symbol.for("@sorrell/docusaurus-theme-fluent");
export type DocusaurusThemeFluentTypeId = typeof DocusaurusThemeFluentTypeId;

const PackageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Package adapter consumed by `@sorrell/site-core`. @category Configuration @since 1.0.0 */
export const FluentDocusaurusTheme = { PackageName: "@sorrell/docusaurus-theme-fluent" } as const;

/** Docusaurus theme plugin. @category Plugin @since 1.0.0 */
export default function DocusaurusThemeFluent(): Plugin
{
    return {
        getClientModules: () => [ resolve(PackageDirectory, "Source", "Style.css") ],
        getThemePath: () => resolve(PackageDirectory, "Distribution", "theme"),
        name: "@sorrell/docusaurus-theme-fluent"
    };
}
