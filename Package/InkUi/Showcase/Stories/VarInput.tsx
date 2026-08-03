/**
 * Showcase story for entering values with variable substitution.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/VarInput
 *
 * @file      VarInput.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { SimpleStory } from "./Factory.js";
import { StatefulVarInput as Basic } from "./Shared.js";

export default SimpleStory({
    Basic: { Code: "<VarInput Value={value} Values={environment} OnChange={setValue} />", Preview: Basic },
    Description: "An input with shell-style variable discovery and completion.",
    Examples: [ { Code: "<VarInput Value=\"$HO\" Values={{HOME: '/home'}} />", Preview: Basic, Title: "Environment completion" } ],
    Name: "VarInput",
    Source: { Component: "VarInput", Path: "VarInput.tsx", Props: "VarInputProps" }
});
