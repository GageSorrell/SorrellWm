/**
 * Showcase story for text area.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/TextArea
 *
 * @file      TextArea.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { SimpleStory } from "./Factory.js";
import { StatefulTextArea as Basic } from "./Shared.js";

export default SimpleStory({
    Basic: { Code: "<TextArea Value={value} OnChange={setValue} />", Preview: Basic },
    Description: "A controlled multiline terminal text editor.",
    Examples: [ { Code: "<TextArea Focused={false} Value={notes} />", Preview: Basic, Title: "Read-only presentation" } ],
    Name: "TextArea",
    Source: { Component: "TextArea", Path: "TextArea.tsx", Props: "TextAreaProps" }
});
