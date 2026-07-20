/**
 * @file      Font.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import { Geist } from "next/font/google";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export/**
       * The default `monospace` font of the Sorrell brand.
       *
       * @todo Move this to the `@sorrell/landing-page` library.
       */
const OperatorMonoLigFontFamily: string = "Operator Mono Lig";

/** Load the Operator Mono Lig font file. */
export function LoadOperatorMonoFont(): void
{
    loadFont({
        family: OperatorMonoLigFontFamily,
        format: "woff2",
        url: staticFile("core/OperatorMonoLig-Book.woff2")
    });
};

export/** The Geist Sans font asset. */
const GeistSansFont: NextFontWithVariable = Geist({
    subsets: [ "latin" ],
    variable: "--font-geist-sans"
});
