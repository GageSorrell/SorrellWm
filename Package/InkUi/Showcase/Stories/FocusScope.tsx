/**
 * Showcase story for focus scope.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/FocusScope
 *
 * @file      FocusScope.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InteractionExample as Basic } from "../InteractionExample.js";
import { SimpleStory } from "./Factory.js";

export default SimpleStory({
    Basic: { Code: "<FocusScope Id=\"dialog\" Trap RestoreFocus>{ /* ... */ }</FocusScope>", Preview: Basic },
    Description: "Groups focus targets and can trap, auto-focus, and restore focus for modal regions.",
    Examples: [ { Code: "<FocusScope AutoFocus Trap RestoreFocus>{ /* ... */ }</FocusScope>", Preview: Basic, Title: "Modal focus" } ],
    Name: "FocusScope",
    Source: { Component: "FocusScope", Path: "Interaction/Focus.tsx", Props: "FocusScopeProps" }
});
