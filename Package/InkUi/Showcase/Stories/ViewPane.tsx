/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ViewPane
 *
 * @file      ViewPane.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { View, ViewPane } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <View Active
    Columns={ [ 24 ] }
    Rows={ [ 2 ] }><ViewPane Column={ 0 }
        Row={ 0 }><Ink.Text>Pane content</Ink.Text></ViewPane></View>;
export default SimpleStory({
    Basic: { Code: "<ViewPane Column={0} Row={0}>Pane content</ViewPane>", Preview: Basic },
    Description: "Places content in one cell or span of a View grid.",
    Examples: [ { Code: "<ViewPane Column={0} Row={0} ColumnSpan={2}>…</ViewPane>", Preview: Basic, Title: "Column span" } ],
    Name: "ViewPane",
    Source: { Component: "ViewPane", Path: "View.tsx", Props: "ViewPaneProps" }
});
