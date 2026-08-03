/**
 * Showcase story for LaTeX.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Latex
 *
 * @file      Latex.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Latex } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Latex fallback={ <Ink.Text>E = mc²</Ink.Text> }>{ "E = mc^2" }</Latex>;
export default SimpleStory({
    Basic: { Code: "<Latex>{\"E = mc^2\"}</Latex>", Preview: Basic },
    Description: "Typesets tex expressions with MathJax and renders the resulting SVG through Sixel.",
    Examples: [ { Code: "<Latex display>{String.raw`\\frac{a}{b}`}</Latex>", Preview: Basic, Title: "Display math" } ],
    Name: "Latex",
    Source: { Component: "Latex", Path: "Latex/index.tsx", Props: "LatexProps" }
});
