/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/PhosphorIcon
 *
 * @file      PhosphorIcon.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { QuestionIcon } from "../../Source/PhosphorIcon/Regular.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <QuestionIcon fallback={ <Ink.Text>?</Ink.Text> } />;
export default SimpleStory({
    Basic: { Code: "<Regular.QuestionIcon />", Preview: Basic },
    Description: "One-cell adapters for every Phosphor icon across regular, bold, duotone, fill, light, and thin styles.",
    Examples: [ { Code: "<Bold.CheckIcon />\n<Duotone.WarningIcon />", Preview: Basic, Title: "Icon weights" } ],
    Name: "PhosphorIcon",
    Source: { Component: "CreatePhosphorIcon", Path: "PhosphorIcon/Internal.tsx", Props: "PhosphorIconProps" }
});
