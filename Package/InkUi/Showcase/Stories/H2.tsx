/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/H2
 *
 * @file      H2.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { H2 } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <H2>Secondary heading</H2>;
export default SimpleStory({
    Basic: { Code: "<H2>Secondary heading</H2>", Preview: Basic },
    Description: "A secondary heading with web-like H2 typography and spacing defaults.",
    Examples: [ { Code: "<H2>Configuration</H2>", Preview: Basic, Title: "Section heading" } ],
    Name: "H2",
    Source: { Component: "Text", Path: "Text.tsx", Props: "TextProps" }
});
