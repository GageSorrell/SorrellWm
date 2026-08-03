/**
 * Showcase story for H1.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/H1
 *
 * @file      H1.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { H1 } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <H1>Primary heading</H1>;
export default SimpleStory({
    Basic: { Code: "<H1>Primary heading</H1>", Preview: Basic },
    Description: "A primary heading with web-like H1 typography and spacing defaults.",
    Examples: [ { Code: "<H1 color=\"cyan\">Dashboard</H1>", Preview: Basic, Title: "Colored heading" } ],
    Name: "H1",
    Source: { Component: "Text", Path: "Text.tsx", Props: "TextProps" }
});
