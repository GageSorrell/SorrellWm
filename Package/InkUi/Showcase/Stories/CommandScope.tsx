/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/CommandScope
 *
 * @file      CommandScope.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InteractionExample as Basic } from "../InteractionExample.js";
import { SimpleStory } from "./Factory.js";

export default SimpleStory({
    Basic:
    {
        Code: "<CommandScope Id=\"editor\">{ /* ... */ }</CommandScope>",
        Preview: Basic
    },
    Description: "Creates a command-bubbling boundary without changing focus traversal.",
    Examples:
    [
        {
            Code: "<CommandScope Id=\"dialog\"><Command ... /></CommandScope>",
            Preview: Basic,
            Title: "Local commands"
        }
    ],
    Name: "CommandScope",
    Source:
    {
        Component: "CommandScope",
        Path: "Interaction/Command.tsx",
        Props: "CommandScopeProps"
    }
});
