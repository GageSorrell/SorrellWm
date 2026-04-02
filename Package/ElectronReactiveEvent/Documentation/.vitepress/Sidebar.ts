/* File:      Sidebar.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { DefaultTheme } from "vitepress";
import TypedocSidebar from "../reference/typedoc-sidebar.json";

export const sidebar: Readonly<DefaultTheme.Sidebar> =
[
    {
        text: "Articles",
        link: "/articles",
        items:
        [
            {
                text: "Introduction",
                link: "/articles/introduction"
            },
            {
                text: "Requirements",
                link: "/articles/requirements"
            },
            {
                text: "Glossary",
                link: "/articles/glossary"
            },
        ]
    },
    {
        text: "Guides",
        link: "/guides",
        items:
        [
            {
                text: "Getting Started",
                link: "/guides/getting-started"
            },
            {
                text: "Declaring Events",
                link: "/guides/declaring-events"
            },
            {
                text: "Registering Event Callbacks",
                link: "/guides/registering-event-callbacks"
            },
            {
                text: "Sending Events",
                link: "/guides/sending-events"
            }
        ]
    },
    {
        text: "Examples",
        link: "/examples",
        items:
        [
            {
                text: "Snippets",
                link: "/examples/snippets"
            },
            {
                text: "Sample Project",
                link: "/examples/sample-project"
            }
        ]
    },
    {
        text: "CLI",
        link: "/cli",
        items:
        [
            {
                text: "Introduction",
                link: "/cli/introduction"
            },
            {
                text: "Getting Started",
                link: "/cli/getting-started"
            },
            {
                text: "<code>setup</code> Command",
                link: "/cli/setup"
            },
            {
                text: "<code>register</code> Command",
                link: "/cli/register"
            },
            {
                text: "JSON Schema",
                link: "/cli/schema"
            }
        ]
    },
    {
        text: "Reference",
        items: TypedocSidebar
    },
    {
        text: "Documentation Index",
        link: "/docs"
    }
];
