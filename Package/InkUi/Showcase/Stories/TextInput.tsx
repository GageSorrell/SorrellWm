/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/TextInput
 *
 * @file      TextInput.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { SimpleStory } from "./Factory.js";
import { StatefulTextInput as Basic } from "./Shared.js";

export default SimpleStory({
    Basic: { Code: "<TextInput Value={value} OnChange={setValue} />", Preview: Basic },
    Description: "A controlled single-line terminal input with cursor, masking, and submission.",
    Examples: [ { Code: "<TextInput Mask=\"•\" Value={password} OnChange={setPassword} />", Preview: Basic, Title: "Masked values" } ],
    Name: "TextInput",
    Source: { Component: "TextInput", Path: "TextInput.tsx", Props: "TextInputProps" }
});
