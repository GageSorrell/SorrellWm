/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/View
 *
 * @file      View.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { View, ViewPane } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <View Active
    Columns={ [ 12, 12 ] }
    Rows={ [ 2 ] }><ViewPane Column={ 0 }
        Row={ 0 }><Ink.Text>Navigation</Ink.Text></ViewPane><ViewPane Column={ 1 }
        Row={ 0 }><Ink.Text>Content</Ink.Text></ViewPane></View>;
export default SimpleStory({
    Basic:
    {
        Code: "<View Columns={[12, 12]} Rows={[2]}>\n  <ViewPane Column={0} Row={0}>" +
            "Navigation</ViewPane>\n  <ViewPane Column={1} Row={0}>Content</ViewPane>\n</View>",
        Preview: Basic
    },
    Description: "Arranges named panes on a terminal grid with row and column spans.",
    Examples:
    [
        {
            Code: "<ViewPane Column={0} Row={0} RowSpan={2}>{ /* ... */ }</ViewPane>",
            Preview: Basic,
            Title: "Spanning panes"
        }
    ],
    Name: "View",
    Source:
    {
        Component: "View",
        Path: "View.tsx",
        Props: "ViewProps"
    }
});
