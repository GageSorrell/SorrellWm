/**
 * @file      RootLayout.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import "./Global.css";
import { GeistSansFont } from "./Font";
import type { Metadata } from "next";
import type { PRootLayout } from "./Layout.Types";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata =
    {
        description: "@TEMPLATE_TODO",
        title: "@TODO"
    };

export default function RootLayout({ children }: PRootLayout): ReactNode
{
    return (
        <html
            className={ `${ GeistSansFont.variable } h-full antialiased` }
            lang="en">
            <body className="min-h-full flex flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    disableTransitionOnChange
                    enableSystem>
                    { children }
                </ThemeProvider>
            </body>
        </html>
    );
}
