/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Tooltip
 *
 * @file      Tooltip.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { HelpProvider, Tooltip } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <HelpProvider icon={ <Ink.Text>?</Ink.Text> }><Tooltip content="More information"><Ink.Box><Ink.Text>Hover target</Ink.Text></Ink.Box></Tooltip></HelpProvider>;
export default SimpleStory({
    Basic: { Code: "<Tooltip content=\"More information\"><Box>Hover target</Box></Tooltip>", Preview: Basic },
    Description: "Associates delayed mouse and Help Mode content with exactly one child.",
    Examples: [ { Code: "<Tooltip content={<Details />} position=\"right\">{ /* ... */ }</Tooltip>", Preview: Basic, Title: "Rich content" } ],
    Name: "Tooltip",
    Source: { Component: "Tooltip", Path: "Help/Help.tsx", Props: "TooltipProps" }
});
