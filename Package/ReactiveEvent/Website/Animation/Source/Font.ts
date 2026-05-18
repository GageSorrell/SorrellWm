/**
 * @file      Font.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export/**
       * The name of the "Operator Mono Lig" font, used to configure remotion
       * components to use this (local) font.
       */
const OperatorMonoFontFamily: "Operator Mono Lig" = "Operator Mono Lig" as const;

loadFont({
    family: OperatorMonoFontFamily,
    featureSettings: "\"liga\" 1, \"calt\" 1",
    format: "opentype",
    style: "normal",
    url: staticFile("Operator/OperatorMonoLig-Book.otf"),
    weight: "400"
});

loadFont({
    family: OperatorMonoFontFamily,
    featureSettings: "\"liga\" 1, \"calt\" 1",
    format: "opentype",
    style: "italic",
    url: staticFile("Operator/OperatorMonoLig-BookItalic.otf"),
    weight: "400"
});
