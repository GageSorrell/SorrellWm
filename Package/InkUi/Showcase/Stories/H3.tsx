/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/H3
 *
 * @file      H3.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { H3 } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <H3>Tertiary heading</H3>;
export default SimpleStory({
    Basic: { Code: "<H3>Tertiary heading</H3>", Preview: Basic },
    Description: "A tertiary heading with web-like H3 typography and spacing defaults.",
    Examples: [ { Code: "<H3>Advanced options</H3>", Preview: Basic, Title: "Subsection heading" } ],
    Name: "H3",
    Source: { Component: "Text", Path: "Text.tsx", Props: "TextProps" }
});
