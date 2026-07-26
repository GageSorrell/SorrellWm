/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/CompletionMenu
 *
 * @file      CompletionMenu.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { CompletionMenu } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <CompletionMenu Items={ [ "HOME", "HOST" ] } />;
export default SimpleStory({
    Basic: { Code: "<CompletionMenu Items={[\"HOME\", \"HOST\"]} />", Preview: Basic },
    Description: "Renders a compact menu of completion candidates.",
    Examples: [ { Code: "<CompletionMenu Items={commands} />", Preview: Basic, Title: "Command completions" } ],
    Name: "CompletionMenu",
    Source: { Component: "CompletionMenu", Path: "CompletionMenu.tsx", Props: "CompletionMenuProps" }
});
