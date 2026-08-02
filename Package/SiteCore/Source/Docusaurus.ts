/**
 *
 *
 * @module @sorrell/site-core/Docusaurus
 *
 * @file      Docusaurus.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Docusaurus configuration factory for generated documentation websites.
 *
 * @module @sorrell/site-core/Docusaurus
 */

import type { Config } from "@docusaurus/types";
import type { DocusaurusWebsiteDefinition } from "./Schema.js";
import { TwoslashRehypePlugin } from "./Twoslash.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/site-core/Docusaurus" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Theme package selected by a generated Docusaurus website.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DocusaurusTheme
{
    readonly PackageName: string;
}

/**
 * Creates a complete Docusaurus configuration from a validated website definition.
 *
 * @category Configuration
 * @since 1.0.0
 */
export const CreateDocusaurusConfig = (
    Website: DocusaurusWebsiteDefinition,
    Theme: DocusaurusTheme
): Config => ({
    baseUrl: "/",
    favicon: "img/favicon.svg",
    i18n: {
        defaultLocale: Website.DefaultLocale ?? "en-US",
        locales: [ ...(Website.Locales ?? [ "en-US", "es-US" ]) ]
    },
    onBrokenLinks: "throw",
    organizationName: "GageSorrell",
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: {
                    beforeDefaultRehypePlugins: [ TwoslashRehypePlugin ],
                    routeBasePath: "docs",
                    sidebarPath: "./sidebars.ts"
                },
                pages: {},
                theme: {}
            }
        ]
    ],
    projectName: Website.VercelProjectName,
    tagline: Website.Landing.Description,
    themeConfig: {
        colorMode: {
            defaultMode: "light",
            respectPrefersColorScheme: true
        },
        navbar: {
            items: [
                { label: "Docs", position: "left", to: "/docs" },
                {
                    position: "right",
                    type: "docsVersionDropdown"
                },
                {
                    position: "right",
                    type: "localeDropdown"
                }
            ],
            title: Website.Title
        }
    },
    themes: [ Theme.PackageName ],
    title: Website.Title,
    trailingSlash: false,
    url: `https://${ Website.Subdomain }.sorrell.sh`
});

/** Decode a definition and create its complete Docusaurus configuration. @category Configuration @since 1.0.0 */
export const DefineDocusaurusConfig = (Website: DocusaurusWebsiteDefinition): Config =>
    CreateDocusaurusConfig(Website, {
        PackageName: `@sorrell/docusaurus-theme-${ Website.Theme.toLowerCase() }`
    });
