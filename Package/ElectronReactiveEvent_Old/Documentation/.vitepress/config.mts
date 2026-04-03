/* File:      config.mts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { defineConfig } from "vitepress";
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

    cleanUrls: true,
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
    // @TODO Get rid of this.
    ignoreDeadLinks: true,
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
        search:
        {
            provider: "local"
        },
        nav:
        [
            {
                text: "Documentation",
                items:
                [
                    {
                        text: "Articles",
                        link: "/1.0.0/articles"
                    },
                    {
                        text: "Guides",
                        link: "/1.0.0/guides"
                    },
                    {
                        text: "Examples",
                        link: "/1.0.0/examples"
                    },
                    {
                        text: "CLI",
                        link: "/1.0.0/cli"
                    },
                    {
                        text: "Reference",
                        link: "/1.0.0/reference"
                    },
                    {
                        text: "Index",
                        link: "/1.0.0/docs"
                    }
                ]
            },
            {
                text: "v1.0.0",
                items:
                [
                    {
                        text: "Select a version",
                        link: "#"
                    },
                    {
                        text: "1.0.0",
                        link: "/1.0.0/articles/introduction"
                    }
                ]
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
