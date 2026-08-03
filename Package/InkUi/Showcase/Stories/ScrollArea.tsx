/**
 * Showcase story for scroll area.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ScrollArea
 *
 * @file      ScrollArea.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { SimpleStory } from "./Factory.js";
import { StatefulScrollArea as Basic } from "./Shared.js";

export default SimpleStory({
    Basic: { Code: "<ScrollArea Height={3} Items={items} RenderItem={renderItem} />", Preview: Basic },
    Description: "A keyboard-scrollable window over a list of equally sized rows.",
    Examples: [ { Code: "<ScrollArea Active={false} Height={5} Items={logs} ... />", Preview: Basic, Title: "Read-only list" } ],
    Name: "ScrollArea",
    Source: { Component: "ScrollArea", Path: "ScrollArea.tsx", Props: "ScrollAreaProps" }
});
