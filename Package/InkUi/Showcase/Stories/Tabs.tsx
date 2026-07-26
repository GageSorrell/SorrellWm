/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Tabs
 *
 * @file      Tabs.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { SimpleStory } from "./Factory.js";
import { StatefulTabs as Basic } from "./Shared.js";

export default SimpleStory({
    Basic: { Code: "<Tabs Items={tabs} Value={value} OnChange={setValue} />", Preview: Basic },
    Description: "Displays a horizontal controlled tab list with optional keyboard navigation.",
    Examples: [ { Code: "<Tabs Active={false} Items={tabs} Value=\"preview\" />", Preview: Basic, Title: "Display-only tabs" } ],
    Name: "Tabs",
    Source: { Component: "Tabs", Path: "Tabs.tsx", Props: "TabsProps" }
});
