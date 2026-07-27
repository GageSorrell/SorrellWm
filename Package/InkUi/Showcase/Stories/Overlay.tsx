/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Overlay
 *
 * @file      Overlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Overlay } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Overlay Title="Example">Overlay content</Overlay>;
export default SimpleStory({
    Basic: { Code: "<Overlay Title=\"Example\">Overlay content</Overlay>", Preview: Basic },
    Description: "Centers framed modal content in a prominent terminal region.",
    Examples: [ { Code: "<Overlay Title=\"Settings\" Footer=\"Escape to close\">{ /* ... */ }</Overlay>", Preview: Basic, Title: "Custom footer" } ],
    Name: "Overlay",
    Source: { Component: "Overlay", Path: "Overlay/Overlay.tsx", Props: "OverlayProps" }
});
