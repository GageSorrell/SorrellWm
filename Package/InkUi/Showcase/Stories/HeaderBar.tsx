/**
 * Showcase story for header bar.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/HeaderBar
 *
 * @file      HeaderBar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { HeaderBar } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <HeaderBar Right={ <Ink.Text>v1</Ink.Text> }
    Title="Header" />;
export default SimpleStory({
    Basic: { Code: "<HeaderBar Title=\"Header\" Right={<Text>v1</Text>} />", Preview: Basic },
    Description: "A full-width title bar with an optional right-aligned slot.",
    Examples: [ { Code: "<HeaderBar Title=\"Settings\" Right={<Text>Esc</Text>} />", Preview: Basic, Title: "Keyboard hint" } ],
    Name: "HeaderBar",
    Source: { Component: "HeaderBar", Path: "Header/HeaderBar.tsx", Props: "HeaderBarProps" }
});
