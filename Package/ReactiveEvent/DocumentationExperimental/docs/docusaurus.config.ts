/**
 * @file      docusaurus.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Config } from "@docusaurus/types";

const config: Config = {
    title: "Reactive Event",
    tagline: "Type-safe IPC functions for Electron, with React hooks.",
    favicon: "img/favicon.ico",

    url: process.env["DOCS_ORIGIN"],
    baseUrl: process.env["DOCS_ORIGIN"].includes("localhost")
        ? "/docs/"
        : "/",

    organizationName: "GageSorrell",
    projectName: "reactive-event",

    trailingSlash: false,

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    presets: [
        [
            "classic",
            {
                docs: {
                    path: "docs",
                    routeBasePath: "/",
                    sidebarPath: require.resolve("./sidebars.ts")
                },
                blog: false,
                theme: {
                    customCss: require.resolve("./src/css/custom.css")
                }
            } satisfies ClassicPresetOptions
        ]
    ]
};

export default config;
