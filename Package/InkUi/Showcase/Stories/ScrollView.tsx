/**
 * ScrollView showcase story.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ScrollView
 *
 * @file      ScrollView.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { ScrollView } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Rows = (): React.ReactElement => (
    <Ink.Box flexDirection="column">
        { [ "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot" ].map((Value) => (
            <Ink.Text key={ Value }>{ Value }</Ink.Text>
        )) }
    </Ink.Box>
);

const Basic = (): React.ReactElement => (
    <ScrollView height={ 4 }
        overflowX="hidden"
        width={ 24 }>
        <Rows />
    </ScrollView>
);

const TwoAxis = (): React.ReactElement => (
    <ScrollView
        HorizontalScrollbarThumb="━"
        ScrollbarCorner="┘"
        VerticalScrollbarThumb="┃"
        height={ 4 }
        width={ 24 }>
        <Ink.Box flexDirection="column"
            width={ 40 }>
            <Ink.Text>Use arrows or the mouse to explore this row.</Ink.Text>
            <Ink.Text>Both scrollbars are created from React nodes.</Ink.Text>
            <Ink.Text>Tracks page; thumbs drag proportionally.</Ink.Text>
            <Ink.Text>Overflow is measured after layout.</Ink.Text>
            <Ink.Text>ScrollView participates in Interaction focus.</Ink.Text>
        </Ink.Box>
    </ScrollView>
);

export default SimpleStory({
    Basic: {
        Code: "<ScrollView height={4} overflowX=\"hidden\" width={24}>\n  {rows}\n</ScrollView>",
        Preview: Basic
    },
    Description: "A measured, two-axis viewport with CSS-like overflow, Interaction focus, keyboard controls, and mouse-operable scrollbars.",
    Examples: [ {
        Code: "<ScrollView height={4} width={24} VerticalScrollbarThumb=\"┃\" HorizontalScrollbarThumb=\"━\">\n  <Box width={40}>{ /* ... */ }</Box>\n</ScrollView>",
        Preview: TwoAxis,
        Title: "Two-axis scrolling and custom bars"
    } ],
    Name: "ScrollView",
    Source: { Component: "ScrollView", Path: "ScrollView.tsx", Props: "ScrollViewProps" }
});
