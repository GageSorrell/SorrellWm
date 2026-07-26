/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ThemeProvider
 *
 * @file      ThemeProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Badge, DefaultTheme, ThemeProvider } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <ThemeProvider Theme={ { ...DefaultTheme, Primary: "#ff79c6" } }><Badge>Themed</Badge></ThemeProvider>;
export default SimpleStory({
    Basic: { Code: "<ThemeProvider Theme={theme}>…</ThemeProvider>", Preview: Basic },
    Description: "Supplies a consistent color and component-style theme to descendants.",
    Examples: [ { Code: "<ThemeProvider Theme={{...DefaultTheme, Primary: \"#ff79c6\"}}>…</ThemeProvider>", Preview: Basic, Title: "Palette override" } ],
    Name: "ThemeProvider",
    Source: { Component: "ThemeProvider", Path: "Theme.tsx", Props: "ThemeProviderProps" }
});
