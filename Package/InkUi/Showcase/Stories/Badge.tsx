/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Badge
 *
 * @file      Badge.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Badge, GradientBadge, JumpBadge } from "../../Source/Badge/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Badge>Stable</Badge>;
const Variants = (): React.ReactElement => (
    <Ink.Box gap={ 1 }>
        <GradientBadge Text="Gradient" />
        <JumpBadge Hint="g" />
    </Ink.Box>
);
export default SimpleStory({
    Basic: { Code: "<Badge>Stable</Badge>", Preview: Basic },
    Description: "A compact label for statuses, categories, and short metadata.",
    Examples: [ { Code: "<GradientBadge Text=\"Gradient\" />\n<JumpBadge Hint=\"g\" />", Preview: Variants, Title: "Variants" } ],
    Name: "Badge",
    Source: { Component: "Badge", Path: "Badge/Badge.tsx", Props: "BadgeProps" }
});
