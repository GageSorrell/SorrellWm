/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Icon
 *
 * @file      Icon.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Icon } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#7aa2f7\"/></svg>";
const Basic = (): React.ReactElement => <Icon fallback={ <Ink.Text>●</Ink.Text> }
    src={ Svg } />;
export default SimpleStory({
    Basic: { Code: "<Icon src={svg} fallback={<Text>●</Text>} />", Preview: Basic },
    Description: "Rasterizes an SVG into exactly one terminal cell.",
    Examples: [ { Code: "<Icon src={<svg>…</svg>} />", Preview: Basic, Title: "React SVG source" } ],
    Name: "Icon",
    Source: { Component: "Icon", Path: "Icon/index.tsx", Props: "IconProps" }
});
