/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/BackdropProvider
 *
 * @file      BackdropProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { BackdropProvider } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <BackdropProvider><Ink.Text>Backdrop content</Ink.Text></BackdropProvider>;
const Explicit = (): React.ReactElement => <BackdropProvider backgroundColor="#111827"><Ink.Text>Custom backdrop</Ink.Text></BackdropProvider>;
export default SimpleStory({
    Basic: { Code: "<BackdropProvider>…</BackdropProvider>", Preview: Basic },
    Description: "Supplies the terminal backdrop color and a contrast-aware darkened application background.",
    Examples: [ { Code: "<BackdropProvider backgroundColor=\"#111827\">…</BackdropProvider>", Preview: Explicit, Title: "Explicit color" } ],
    Name: "BackdropProvider",
    Source: { Component: "BackdropProvider", Path: "Backdrop/index.tsx", Props: "BackdropProviderProps" }
});
