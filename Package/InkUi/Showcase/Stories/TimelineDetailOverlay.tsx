/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/TimelineDetailOverlay
 *
 * @file      TimelineDetailOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { TimelineDetailOverlay } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";
import { Event } from "./TimelineData.js";

const Basic = (): React.ReactElement => <TimelineDetailOverlay Event={ Event } />;
export default SimpleStory({
    Basic: { Code: "<TimelineDetailOverlay Event={event} />", Preview: Basic },
    Description: "Displays summary, request, and response data for a timeline event.",
    Examples: [ { Code: "<TimelineDetailOverlay Event={event} OnClose={close} />", Preview: Basic, Title: "Closable detail" } ],
    Name: "TimelineDetailOverlay",
    Source: { Component: "TimelineDetailOverlay", Path: "Timeline/Timeline.tsx", Props: "TimelineDetailOverlayProps" }
});
