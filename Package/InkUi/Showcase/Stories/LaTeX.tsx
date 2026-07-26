/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/LaTeX
 *
 * @file      LaTeX.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { LaTeX } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <LaTeX fallback={ <Ink.Text>E = mc²</Ink.Text> }>{ "E = mc^2" }</LaTeX>;
export default SimpleStory({
    Basic: { Code: "<LaTeX>{\"E = mc^2\"}</LaTeX>", Preview: Basic },
    Description: "Typesets TeX expressions with MathJax and renders the resulting SVG through Sixel.",
    Examples: [ { Code: "<LaTeX display>{String.raw`\\frac{a}{b}`}</LaTeX>", Preview: Basic, Title: "Display math" } ],
    Name: "LaTeX",
    Source: { Component: "LaTeX", Path: "LaTeX/index.tsx", Props: "LaTeXProps" }
});
