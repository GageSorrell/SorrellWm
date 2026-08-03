/**
 * Showcase story for picker overlay.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/PickerOverlay
 *
 * @file      PickerOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { PickerOverlay } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <PickerOverlay Items={ [ { Label: "Alpha", Value: "alpha" }, { Label: "Bravo", Value: "bravo" } ] }
    OnSelect={ () => undefined }
    Title="Pick an item" />;
export default SimpleStory({
    Basic: { Code: "<PickerOverlay Title=\"Pick an item\" Items={items} OnSelect={select} />", Preview: Basic },
    Description: "Combines a modal overlay with a selectable list.",
    Examples: [ { Code: "<PickerOverlay Title=\"Theme\" Items={themes} OnSelect={setTheme} />", Preview: Basic, Title: "Object picker" } ],
    Name: "PickerOverlay",
    Source: { Component: "PickerOverlay", Path: "Overlay/PickerOverlay.tsx", Props: "PickerOverlayProps" }
});
