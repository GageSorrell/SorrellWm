/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/JumpBadge
 *
 * @file      JumpBadge.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { JumpBadge } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <JumpBadge Hint="g" />;
export default SimpleStory({
    Basic: { Code: "<JumpBadge Hint=\"g\" />", Preview: Basic },
    Description: "Displays a small keyboard jump hint.",
    Examples: [ { Code: "<JumpBadge Hint=\"1\" />", Preview: Basic, Title: "Numeric jump" } ],
    Name: "JumpBadge",
    Source: { Component: "JumpBadge", Path: "Badge/JumpBadge.tsx", Props: "JumpBadgeProps" }
});
