/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/H4
 *
 * @file      H4.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { H4 } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <H4>Quaternary heading</H4>;
export default SimpleStory({
    Basic: { Code: "<H4>Quaternary heading</H4>", Preview: Basic },
    Description: "A fourth-level heading with web-like H4 typography and spacing defaults.",
    Examples: [ { Code: "<H4>Details</H4>", Preview: Basic, Title: "Detail heading" } ],
    Name: "H4",
    Source: { Component: "Text", Path: "Text.tsx", Props: "TextProps" }
});
