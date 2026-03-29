/* File:      config.mts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { defineConfig } from "vitepress";
import typedocSidebar from "../reference/typedoc-sidebar.json";
import FluentIcon from "../Component/FluentIcon.vue";
import type * as minisearch from "minisearch";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Electron Reactive Event",
    description: "Type-safe Electron IPC functions, including modern React hooks.",
    head:
    [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    themeConfig: {
        footer:
        {
            copyright: "<span class=\"FluentIcon\" aria-hidden=\"true\">&#xF2B7;</span> &copy; 2026 Gage Sorrell.  Released under the <a ref=\"https://github.com/GageSorrell/SorrellWm/blob/Master/Package/ElectronReactiveEvent/License.md\">MIT License.&nbsp;<span class=\"FluentIconSmall\" aria-hidden=\"true\">&#xE8A7</span></a>"
        },
        nav: [{ text: "Home", link: "/" }],
        logo: "./logo.png",
        search: {
            provider: 'local',
        },
        sidebar: [
            {
                text: "Articles",
                items:
                [
                    {
                        text: "Introduction",
                        link: "/articles/introduction"
                    },
                    {
                        text: "Glossary",
                        link: "/articles/glossary"
                    },
                    {
                        text: "Project Setup",
                        link: "/articles/project-setup"
                    },
                    {
                        text: "Declaring Events",
                        link: "/articles/declaring-events"
                    },
                    {
                        text: "Registering Event Callbacks",
                        link: "/articles/registering-event-callbacks"
                    },
                    {
                        text: "Sending Events",
                        link: "/articles/sending-events"
                    }
                ]
            },
            {
                "CLI Articles",
                items:
                [
                    {
                        text: "Introduction",
                        link: "articles/cli/introduction"
                    },
                    // @TODO
                    //
                    // WHERE TO PICK BACK UP:
                    //
                    // Write articles for the CLI.
                    // *Don't* create typedoc docs for the CLI.
                    // Instead, create articles for the CLI, including
                    // an article that shows the JSON schema for the
                    // config file.
                ]
            },
            {
                text: "Reference",
                items: typedocSidebar,
            }
        ],
        socialLinks: [
        { icon: "github", link: "https://github.com/GageSorrell/SorrellWm/tree/Master/Package/ElectronReactiveEvent" },
        ],
    },
});
