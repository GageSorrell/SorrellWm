/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/VarText
 *
 * @file      VarText.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { SimpleStory } from "./Factory.js";
import { VarText } from "../../Source/index.js";

const Basic = (): React.ReactElement => <VarText Text="$HOME and $MISSING"
    Values={ { HOME: "/home" } } />;
export default SimpleStory({
    Basic: { Code: "<VarText Text=\"$HOME\" Values={{HOME: \"/home\"}} />", Preview: Basic },
    Description: "Highlights and resolves shell-style variables within text.",
    Examples:
    [
        {
            Code: "<VarText Text=\"$HOME and $MISSING\" Values={environment} />",
            Preview: Basic,
            Title: "Missing variables"
        }
    ],
    Name: "VarText",
    Source: { Component: "VarText", Path: "VarText.tsx", Props: "VarTextProps" }
});
