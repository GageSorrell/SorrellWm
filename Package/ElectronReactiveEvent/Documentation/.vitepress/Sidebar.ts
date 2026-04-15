/* File:      Sidebar.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { DefaultTheme } from "vitepress";
import TypedocSidebar from "../1.0.0/reference/typedoc-sidebar.json";

export const sidebar: DefaultTheme.Sidebar =
{
    "1.0.0":
    [
        {
            text: "Articles",
            link: "/1.0.0/articles",
            items:
            [
                {
                    text: "Introduction",
                    link: "/1.0.0/articles/introduction"
                },
                {
                    text: "Requirements",
                    link: "/1.0.0/articles/requirements"
                },
                {
                    text: "Glossary",
                    link: "/1.0.0/articles/glossary"
                },
            ]
        },
        {
            text: "Guides",
            link: "/1.0.0/guides",
            items:
            [
                {
                    text: "Getting Started",
                    link: "/1.0.0/guides/getting-started"
                },
                {
                    text: "Declaring Events",
                    link: "/1.0.0/guides/declaring-events"
                },
                {
                    text: "Registering Event Callbacks",
                    link: "/1.0.0/guides/registering-event-callbacks"
                },
                {
                    text: "Sending Events",
                    link: "/1.0.0/guides/sending-events"
                }
            ]
        },
        {
            text: "Examples",
            link: "/1.0.0/examples",
            items:
            [
                {
                    text: "Snippets",
                    link: "/1.0.0/examples/snippets"
                },
                {
                    text: "Sample Project",
                    link: "/1.0.0/examples/sample-project"
                }
            ]
        },
        {
            text: "CLI",
            link: "/1.0.0/cli",
            items:
            [
                {
                    text: "Introduction",
                    link: "/1.0.0/cli/introduction"
                },
                {
                    text: "Getting Started",
                    link: "/1.0.0/cli/getting-started"
                },
                {
                    text: "Command Reference",
                    link: "/1.0.0/cli/command-reference"
                },
                {
                    text: "JSON Schema",
                    link: "/1.0.0/cli/schema"
                }
            ]
        },
        {
            text: "Reference",
            link: "/1.0.0/reference/",
            items: TypedocSidebar
        },
        {
            text: "Documentation Index",
            link: "/1.0.0/docs"
        }
    ]
};
