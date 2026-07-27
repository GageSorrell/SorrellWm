/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Focusable
 *
 * @file      Focusable.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InteractionExample as Basic } from "../InteractionExample.js";
import { SimpleStory } from "./Factory.js";

export default SimpleStory({
    Basic: { Code: "<Focusable Id=\"field\">{({Focused}) => ...}</Focusable>", Preview: Basic },
    Description: "Registers a focus target and exposes its current focus state to a render function.",
    Examples:
    [
        {
            Code: "<Focusable AutoFocus Id=\"primary\">{ /* ... */ }</Focusable>",
            Preview: Basic,
            Title: "Automatic focus"
        }
    ],
    Name: "Focusable",
    Source: { Component: "Focusable", Path: "Interaction/Focus.tsx", Props: "FocusableProps" }
});
