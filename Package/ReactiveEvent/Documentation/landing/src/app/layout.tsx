/**
 * @file      layout.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { Providers } from "./providers";
import type { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";

const Inter: NextFontWithVariable = Inter({
    display: "swap",
    subsets: [ "latin" ],
    variable: "--font-inter"
});

const CalSans: NextFontWithVariable = localFont({
    display: "swap",
    src: "../assets/cal-sans-semibold.woff2",
    variable: "--font-cal-sans",
    weight: "600"
});

export const metadata: Metadata =
    {
        description: (
            "Reactive Event brings type-safe IPC and React hooks to Electron, helping you build safer \
            main-to-renderer communication."
        ),
        title: "Reactive Event :: Type-safe IPC functions with modern React hooks."
    };

const BodyClass: string =
    [
        "relative",
        "overflow-x-hidden",
        "antialiased",
        "font-light",
        "bg-white",
        "dark:bg-[#09090B]",
        "text-zinc-700",
        "dark:text-zinc-300"
    ].join(" ");

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            className={ `relative ${ Inter.variable } ${ CalSans.variable }` }
            lang="en"
            suppressHydrationWarning>
            <body className={ BodyClass }>
                <Providers>
                    { children }
                    <Analytics />
                    <SpeedInsights
                        endpoint="/speed-insights/vitals"
                        scriptSrc="/speed-insights/script.js"
                    />
                </Providers>
            </body>
        </html>
    );
}
