/**
 * Showcase story for H6.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/H6
 *
 * @file      H6.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { H6 } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <H6>Senary heading</H6>;
export default SimpleStory({
    Basic: { Code: "<H6>Senary heading</H6>", Preview: Basic },
    Description: "A sixth-level heading with web-like H6 typography and spacing defaults.",
    Examples: [ { Code: "<H6>Footnotes</H6>", Preview: Basic, Title: "Minor heading" } ],
    Name: "H6",
    Source: { Component: "Text", Path: "Text.tsx", Props: "TextProps" }
});
