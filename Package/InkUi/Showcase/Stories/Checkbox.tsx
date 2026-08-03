/**
 * Showcase story for checkbox.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Checkbox
 *
 * @file      Checkbox.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Checkbox } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Checkbox Checked
    Label="Enabled" />;
const States = (): React.ReactElement => <><Checkbox Checked
    Label="Checked" /><Checkbox Checked={ false }
    Label="Unchecked" /></>;
export default SimpleStory({
    Basic: { Code: "<Checkbox Checked Label=\"Enabled\" />", Preview: Basic },
    Description: "Displays a Boolean state with a readable label.",
    Examples: [ { Code: "<Checkbox Checked Label=\"Checked\" />\n<Checkbox Checked={false} Label=\"Unchecked\" />", Preview: States, Title: "States" } ],
    Name: "Checkbox",
    Source: { Component: "Checkbox", Path: "Checkbox.tsx", Props: "CheckboxProps" }
});
