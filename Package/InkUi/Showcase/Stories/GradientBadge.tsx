/**
 * Showcase story for gradient badge.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/GradientBadge
 *
 * @file      GradientBadge.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { GradientBadge } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <GradientBadge Text="Ink UI" />;
export default SimpleStory({
    Basic: { Code: "<GradientBadge Text=\"Ink UI\" />", Preview: Basic },
    Description: "Draws a short badge label with a horizontal color gradient.",
    Examples: [ { Code: "<GradientBadge Text=\"Release\" />", Preview: Basic, Title: "Release label" } ],
    Name: "GradientBadge",
    Source: { Component: "GradientBadge", Path: "Badge/GradientBadge.tsx", Props: "GradientBadgeProps" }
});
