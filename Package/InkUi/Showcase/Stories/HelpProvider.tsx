/**
 * Showcase story for help provider.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/HelpProvider
 *
 * @file      HelpProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { HelpProvider, Tooltip } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => (
    <HelpProvider icon={ <Ink.Text>?</Ink.Text> }>
        <Tooltip content="Contextual help">
            <Ink.Box>
                <Ink.Text>
                    Hover me
                </Ink.Text>
            </Ink.Box>
        </Tooltip>
    </HelpProvider>
);

export default SimpleStory({
    Basic:
    {
        Code:
            "<HelpProvider>\n  <Tooltip content=\"Contextual help\"><Box>Hover me</Box>" +
            "</Tooltip>\n</HelpProvider>",
        Preview: Basic
    },
    Description: "Coordinates delayed mouse tooltips and keyboard-driven application Help Mode.",
    Examples:
    [
        {
            Code: "<Tooltip content=\"Saved files\" position=\"right\">{ /* ... */ }</Tooltip>",
            Preview: Basic,
            Title: "Positioned tooltip"
        }
    ],
    Name: "HelpProvider",
    Source: { Component: "HelpProvider", Path: "Help/Help.tsx", Props: "HelpProviderProps" }
});
