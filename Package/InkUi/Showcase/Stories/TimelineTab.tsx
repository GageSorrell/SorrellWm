/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/TimelineTab
 *
 * @file      TimelineTab.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { TimelineTab } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";
import { Events } from "./TimelineData.js";

const Basic = (): React.ReactElement => <TimelineTab Active={ false }
    Events={ Events }
    Height={ 3 } />;
export default SimpleStory({
    Basic: { Code: "<TimelineTab Events={events} />", Preview: Basic },
    Description: "Renders a keyboard-navigable history of timeline events.",
    Examples: [ { Code: "<TimelineTab Events={events} Height={12} OnOpen={openEvent} />", Preview: Basic, Title: "Open event details" } ],
    Name: "TimelineTab",
    Source: { Component: "TimelineTab", Path: "Timeline/TimelineTab.tsx", Props: "TimelineTabProps" }
});
