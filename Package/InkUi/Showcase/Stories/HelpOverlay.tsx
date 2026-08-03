/**
 * Showcase story for help overlay.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/HelpOverlay
 *
 * @file      HelpOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { HelpOverlay } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <HelpOverlay Sections={ [ { Entries: [ { Description: "Go back", Keys: "Escape" } ], Title: "Navigation" } ] } />;
export default SimpleStory({
    Basic: { Code: "<HelpOverlay Sections={sections} />", Preview: Basic },
    Description: "Displays grouped keyboard shortcuts in an overlay.",
    Examples: [ { Code: "<HelpOverlay Title=\"Commands\" Sections={sections} />", Preview: Basic, Title: "Custom title" } ],
    Name: "HelpOverlay",
    Source: { Component: "HelpOverlay", Path: "Overlay/HelpOverlay.tsx", Props: "HelpOverlayProps" }
});
