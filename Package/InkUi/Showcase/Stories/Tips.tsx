/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Tips
 *
 * @file      Tips.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Tips } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Tips Index={ 0 }
    Tips={ [ "Use arrow keys to navigate." ] } />;
export default SimpleStory({
    Basic: { Code: "<Tips Index={0} Tips={[\"Use arrow keys to navigate.\"]} />", Preview: Basic },
    Description: "Selects and displays one stable tip from a collection.",
    Examples: [ { Code: "<Tips Tips={onboardingTips} />", Preview: Basic, Title: "Random tip" } ],
    Name: "Tips",
    Source: { Component: "Tips", Path: "Tips.tsx", Props: "TipsProps" }
});
