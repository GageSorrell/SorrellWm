/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Display
 *
 * @file      Display.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Display } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Display fontFamily="tinyunicode">INK UI</Display>;
const Shadow = (): React.ReactElement => <Display fontFamily="tinyunicode">STORY</Display>;
export default SimpleStory({
    Basic: { Code: "<Display fontFamily=\"tiny\">INK UI</Display>", Preview: Basic },
    Description: "Renders strings with Bit's terminal display fonts, scaling, and shadow treatments.",
    Examples: [
        {
            Code: "<Display fontFamily=\"tiny\" shadow=\"medium\">STORY</Display>",
            Preview: Shadow,
            Title: "Shadows"
        }
    ],
    Name: "Display",
    Source: { Component: "Display", Path: "Display/index.tsx", Props: "DisplayProps" }
});
