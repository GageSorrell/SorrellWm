/**
 * Showcase story for interaction provider.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/InteractionProvider
 *
 * @file      InteractionProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InteractionExample as Basic } from "../InteractionExample.js";
import { SimpleStory } from "./Factory.js";

export default SimpleStory({
    Basic: { Code: "<InteractionProvider>\n  <Focusable Id=\"first\">{ /* ... */ }</Focusable>\n</InteractionProvider>", Preview: Basic },
    Description: "Coordinates application focus, commands, routed input, and discoverable shortcuts.",
    Examples: [ { Code: "<InteractionProvider InitialFocus=\"save\" ShowFooter={false}>{ /* ... */ }</InteractionProvider>", Preview: Basic, Title: "Initial focus" } ],
    Name: "InteractionProvider",
    Source: { Component: "InteractionProvider", Path: "Interaction/Context.tsx", Props: "InteractionProviderProps" }
});
