/**
 * Showcase story for text.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Text
 *
 * @file      Text.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { SimpleStory } from "./Factory.js";
import { Text } from "../../Source/index.js";

const Basic = (): React.ReactElement => <Text color="cyan">Terminal text</Text>;
const Styled = (): React.ReactElement => <Text fontFamily="monospace"
    letterSpacing={ 1 }>Spaced</Text>;
export default SimpleStory({
    Basic: { Code: "<Text color=\"cyan\">Terminal text</Text>", Preview: Basic },
    Description: "Ink Text with CSS-like typography and SVG fallback for non-terminal font sizing.",
    Examples:
    [
        {
            Code: "<Text fontFamily=\"monospace\" letterSpacing={1}>Spaced</Text>",
            Preview: Styled,
            Title: "Typography"
        }
    ],
    Name: "Text",
    Source: { Component: "Text", Path: "Text.tsx", Props: "TextProps" }
});
