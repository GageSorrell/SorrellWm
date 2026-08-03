/**
 * Showcase story for SVG.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Svg
 *
 * @file      Svg.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Svg } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Source = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"24\"><rect width=\"48\" height=\"24\" rx=\"6\" fill=\"#bb9af7\"/></svg>";
const Basic = (): React.ReactElement => <Svg fallback={ <Ink.Text>[SVG preview]</Ink.Text> }>{ Source }</Svg>;
export default SimpleStory({
    Basic: { Code: "<Svg>{svgSource}</Svg>", Preview: Basic },
    Description: "Rasterizes string or React SVG content and paints it in terminals with Sixel support.",
    Examples: [ { Code: "<Svg width={12} height={4} fallback={<Text>Unavailable</Text>}>{ /* ... */ }</Svg>", Preview: Basic, Title: "Explicit cell size and fallback" } ],
    Name: "Svg",
    Source: { Component: "Svg", Path: "Svg/index.tsx", Props: "SvgProps" }
});
