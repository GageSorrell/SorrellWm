/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Shortcut
 *
 * @file      Shortcut.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InteractionExample as Basic } from "../InteractionExample.js";
import { SimpleStory } from "./Factory.js";

export default SimpleStory({
    Basic: { Code: "<Shortcut Command=\"save\" Keys=\"Ctrl+S\" Label=\"Save\" />", Preview: Basic },
    Description: "Binds one or more key chords to a command and optionally advertises the binding.",
    Examples: [ { Code: "<Shortcut Command=\"close\" Keys={[\"Escape\", \"Ctrl+W\"]} />", Preview: Basic, Title: "Multiple chords" } ],
    Name: "Shortcut",
    Source: { Component: "Shortcut", Path: "Interaction/Shortcut.tsx", Props: "ShortcutProps" }
});
