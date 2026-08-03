/**
 * Showcase story for center text.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/CenterText
 *
 * @file      CenterText.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { CenterText } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <CenterText>Centered text</CenterText>;
export default SimpleStory({
    Basic: { Code: "<CenterText>Centered text</CenterText>", Preview: Basic },
    Description: "Centers a line of text within the available terminal width.",
    Examples: [ { Code: "<CenterText>Centered status</CenterText>", Preview: Basic, Title: "Centered status" } ],
    Name: "CenterText",
    Source: { Component: "CenterText", Path: "CenterText.tsx", Props: "CenterTextProps" }
});
