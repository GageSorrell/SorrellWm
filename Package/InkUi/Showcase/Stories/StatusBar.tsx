/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/StatusBar
 *
 * @file      StatusBar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { DefaultTheme, StatusBar } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <StatusBar Items={ [ { Label: "READY" }, { Color: DefaultTheme.Success, Label: "CONNECTED" } ] } />;
export default SimpleStory({
    Basic: { Code: "<StatusBar Items={[{Label: \"READY\"}]} />", Preview: Basic },
    Description: "Presents compact application state items along a status line.",
    Examples: [ { Code: "<StatusBar Items={[{Label: \"CONNECTED\", Color: theme.Success}]} />", Preview: Basic, Title: "Colored states" } ],
    Name: "StatusBar",
    Source: { Component: "StatusBar", Path: "StatusBar.tsx", Props: "StatusBarProps" }
});
