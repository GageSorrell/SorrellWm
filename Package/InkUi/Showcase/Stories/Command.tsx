/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Command
 *
 * @file      Command.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InteractionExample as Basic } from "../InteractionExample.js";
import { SimpleStory } from "./Factory.js";

export default SimpleStory({
    Basic: { Code: "<Command Id=\"save\" Handler={save} />", Preview: Basic },
    Description: "Declaratively registers a command handler in the nearest command scope.",
    Examples:
    [
        {
            Code: "<Command Id=\"copy\" Handler={() => false} Priority={10} />",
            Preview: Basic,
            Title: "Command bubbling"
        }
    ],
    Name: "Command",
    Source: { Component: "Command", Path: "Interaction/Command.tsx", Props: "CommandProps" }
});
