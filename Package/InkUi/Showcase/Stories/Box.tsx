/**
 * Showcase story for box.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Box
 *
 * @file      Box.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Box } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement =>
    <Box
        borderStyle="round"
        paddingX={ 1 }>
        <Ink.Text>
            Content
        </Ink.Text>
    </Box>;

const Compact = (): React.ReactElement =>
    <Box
        borderRadius="0.5em"
        borderStyle="compact"
        cornerShape="squircle"
        paddingX={ 1 }>
        <Ink.Text>
            Compact
        </Ink.Text>
    </Box>;

export default SimpleStory({
    Basic: { Code: "<Box borderStyle=\"round\" paddingX={1}>Content</Box>", Preview: Basic },
    Description: "Ink's layout primitive with mouse regions, compact Sixel borders, and elevation shadows.",
    Examples:
    [
        {
            Code: "<Box borderStyle=\"compact\" borderRadius=\"0.5em\" cornerShape=\"squircle\">" +
                "{ /* ... */ }</Box>",
            Preview: Compact,
            Title: "Compact border"
        }
    ],
    Name: "Box",
    Source: { Component: "Box", Path: "Box/Box.tsx", Props: "BoxProps" }
});
