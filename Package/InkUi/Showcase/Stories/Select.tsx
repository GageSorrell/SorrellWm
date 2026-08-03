/**
 * Showcase story for select.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Select
 *
 * @file      Select.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { SimpleStory } from "./Factory.js";
import { StatefulSelect as Basic } from "./Shared.js";

export default SimpleStory({
    Basic: { Code: "<Select Items={items} Value={value} OnChange={setValue} />", Preview: Basic },
    Description: "A controlled single-choice list with keyboard navigation.",
    Examples: [ { Code: "<Select Active={false} Items={items} Value={value} />", Preview: Basic, Title: "Read-only selection" } ],
    Name: "Select",
    Source: { Component: "Select", Path: "Select.tsx", Props: "SelectProps" }
});
