/**
 * Showcase story for frame.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Frame
 *
 * @file      Frame.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Frame } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Frame Title="Panel">Framed content</Frame>;
const Footer = (): React.ReactElement => <Frame Active
    Footer="Enter to continue"
    Title="Active">Content</Frame>;
export default SimpleStory({
    Basic: { Code: "<Frame Title=\"Panel\">Framed content</Frame>", Preview: Basic },
    Description: "Adds a titled, themed frame around a region of content.",
    Examples: [ { Code: "<Frame Active Title=\"Active\" Footer=\"Enter to continue\">{ /* ... */ }</Frame>", Preview: Footer, Title: "Active frame with footer" } ],
    Name: "Frame",
    Source: { Component: "Frame", Path: "Frame.tsx", Props: "FrameProps" }
});
