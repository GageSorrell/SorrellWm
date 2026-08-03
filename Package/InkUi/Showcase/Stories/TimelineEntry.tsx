/**
 * Showcase story for timeline entry.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/TimelineEntry
 *
 * @file      TimelineEntry.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { TimelineEntry } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";
import { Event } from "./TimelineData.js";

const Basic = (): React.ReactElement => <TimelineEntry Event={ Event }
    Selected />;
export default SimpleStory({
    Basic: { Code: "<TimelineEntry Event={event} Selected />", Preview: Basic },
    Description: "Displays one timestamped event in a compact timeline row.",
    Examples: [ { Code: "<TimelineEntry Event={errorEvent} />", Preview: Basic, Title: "Status event" } ],
    Name: "TimelineEntry",
    Source: { Component: "TimelineEntry", Path: "Timeline/TimelineEntry.tsx", Props: "TimelineEntryProps" }
});
