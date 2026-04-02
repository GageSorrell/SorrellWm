/* File:      config.mts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { defineConfig } from "vitepress";
import FluentIcon from "../Component/FluentIcon.vue";
import type * as minisearch from "minisearch";
import { sidebar } from "./Sidebar";
import { withTwoslash } from 'vitepress-plugin-shiki-twoslash'
import {
    groupIconMdPlugin,
    groupIconVitePlugin
} from "vitepress-plugin-group-icons";
import {
    transformerMetaWordHighlight,
    transformerNotationWordHighlight } from "@shikijs/transformers";

export default withTwoslash(defineConfig({
    description: "Type-safe Electron IPC functions, including modern React hooks.",
    title: "Electron Reactive Event",

    head:
    [
        ["link", { rel: "icon", href: "/logo.png" }]
    ],
    lastUpdated: true,
    markdown:
    {
        codeTransformers:
        [
            transformerMetaWordHighlight(),
            transformerNotationWordHighlight()
        ],
        config(MarkdownIt)
        {
            MarkdownIt.use(groupIconMdPlugin);
        },
        toc: {
            level: [2, 3, 4],
            containerTag: "nav",
            containerClass: "CustomToc",
            listTag: "ul",
            listClass: "CustomTocList",
            itemClass: "CustomTocItem",
            linkClass: "CustomTocLink",
            shouldAllowNested: false
        }
    },
    themeConfig:
    {
        footer:
        {
            copyright: "&copy; 2026 Gage Sorrell.  Released under the <a style=\"font-size: 14px !important;\" ref=\"https://github.com/GageSorrell/SorrellWm/blob/Master/Package/ElectronReactiveEvent/License.md\">MIT License&nbsp;<span class=\"FluentIconSmall\" aria-hidden=\"true\">&#xE8A7</span></a>.  Planet logo is owned by Microsoft."
        },
        logo: "./logo.png",
        outline:
        {
            label: "In this article",
            level: [ 2, 3 ],
        },
        search: {
            provider: "local",
        },
        nav:
        [
            {
                text: "Documentation",
                link: "/articles/introduction"
            },
            {
                text: "Contact",
                link: "/contact"
            }
        ],
        sidebar,
        socialLinks: [
        { icon: "github", link: "https://github.com/GageSorrell/SorrellWm/tree/Master/Package/ElectronReactiveEvent" },
        ],
    },
    vite:
    {
        plugins:
        [
            groupIconVitePlugin()
        ]
    }
}));
