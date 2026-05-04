/**
 * @file      docusaurus.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Config } from "@docusaurus/types";

const IsProduction: boolean = !(process.env?.["DOCS_ORIGIN"] || "localhost").includes("localhost");

const config: Config = {
    favicon: "img/favicon.ico",
    tagline: "Type-safe IPC functions for Electron, with React hooks.",
    title: "Reactive Event",

    baseUrl: "/docs/",
    // baseUrl: IsProduction
    //     ? "/"
    //     : "/docs/",
    url: process.env?.["DOCS_ORIGIN"] || "http://localhost:3001",

    organizationName: "GageSorrell",
    projectName: "reactive-event",

    trailingSlash: false,

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    presets: [
        [
            "classic",
            {
                blog: false,
                docs: {
                    path: "docs",
                    routeBasePath: "/",
                    // routeBasePath: IsProduction ? "/docs/" : "/",
                    sidebarPath: require.resolve("./sidebars.ts")
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css")
                }
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            } as any
        ]
    ]
};

export default config;
