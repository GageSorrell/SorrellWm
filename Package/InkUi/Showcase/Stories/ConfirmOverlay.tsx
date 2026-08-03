/**
 * Showcase story for confirm overlay.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ConfirmOverlay
 *
 * @file      ConfirmOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { ConfirmOverlay } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => (
    <ConfirmOverlay
        Message="Continue?"
        OnCancel={ () => undefined }
        OnConfirm={ () => undefined }
    />
);
export default SimpleStory({
    Basic:
    {
        Code: "<ConfirmOverlay Message=\"Continue?\" OnConfirm={confirm} OnCancel={cancel} />",
        Preview: Basic
    },
    Description: "Presents a modal confirmation prompt with confirm and cancel actions.",
    Examples:
    [
        {
            Code: "<ConfirmOverlay Message=\"Delete file?\" ConfirmLabel=\"Delete\" ... />",
            Preview: Basic,
            Title: "Destructive confirmation"
        }
    ],
    Name: "ConfirmOverlay",
    Source:
    {
        Component: "ConfirmOverlay",
        Path: "Overlay/ConfirmOverlay.tsx",
        Props: "ConfirmOverlayProps"
    }
});
