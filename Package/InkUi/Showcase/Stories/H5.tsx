/**
 * Showcase story for H5.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/H5
 *
 * @file      H5.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { H5 } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <H5>Quinary heading</H5>;
export default SimpleStory({
    Basic: { Code: "<H5>Quinary heading</H5>", Preview: Basic },
    Description: "A fifth-level heading with web-like H5 typography and spacing defaults.",
    Examples: [ { Code: "<H5>Metadata</H5>", Preview: Basic, Title: "Metadata heading" } ],
    Name: "H5",
    Source: { Component: "Text", Path: "Text.tsx", Props: "TextProps" }
});
