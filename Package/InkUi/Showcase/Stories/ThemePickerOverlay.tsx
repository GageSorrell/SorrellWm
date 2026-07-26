/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ThemePickerOverlay
 *
 * @file      ThemePickerOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { ThemePickerOverlay } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <ThemePickerOverlay OnSelect={ () => undefined } />;
export default SimpleStory({
    Basic: { Code: "<ThemePickerOverlay OnSelect={setTheme} />", Preview: Basic },
    Description: "A ready-made overlay for selecting one of Ink UI's curated themes.",
    Examples: [ { Code: "<ThemePickerOverlay OnSelect={applyTheme} />", Preview: Basic, Title: "Apply a theme" } ],
    Name: "ThemePickerOverlay",
    Source: { Component: "ThemePickerOverlay", Path: "Overlay/ThemeOverlay.tsx", Props: "ThemePickerOverlayProps" }
});
