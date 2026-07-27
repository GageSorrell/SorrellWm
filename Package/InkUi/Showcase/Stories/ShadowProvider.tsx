/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ShadowProvider
 *
 * @file      ShadowProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Box, ShadowProvider } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <ShadowProvider elevation={ 2 }><Box paddingX={ 1 }><Ink.Text>Elevated</Ink.Text></Box></ShadowProvider>;
const Lofi = (): React.ReactElement => <ShadowProvider elevation={ 3 }
    lofi><Box paddingX={ 1 }><Ink.Text>Lo-fi</Ink.Text></Box></ShadowProvider>;
export default SimpleStory({
    Basic: { Code: "<ShadowProvider elevation={2}>{ /* ... */ }</ShadowProvider>", Preview: Basic },
    Description: "Supplies application and per-elevation defaults for Sixel box shadows.",
    Examples: [ { Code: "<ShadowProvider elevation={3} lofi>{ /* ... */ }</ShadowProvider>", Preview: Lofi, Title: "Lo-fi shadows" } ],
    Name: "ShadowProvider",
    Source: { Component: "ShadowProvider", Path: "Shadow/index.tsx", Props: "ShadowProviderProps" }
});
