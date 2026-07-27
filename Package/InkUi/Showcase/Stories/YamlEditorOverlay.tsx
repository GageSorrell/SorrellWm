/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/YamlEditorOverlay
 *
 * @file      YamlEditorOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { SimpleStory } from "./Factory.js";
import { YamlEditorOverlay } from "../../Source/index.js";

const Basic = (): React.ReactElement =>
    <YamlEditorOverlay
        OnChange={ () => undefined }
        Value="name: ink-ui\nversion: 1"
    />;

export default SimpleStory({
    Basic:
    {
        Code: "<YamlEditorOverlay Value=\"name: ink-ui\" OnChange={setYaml} />",
        Preview: Basic
    },
    Description: "Presents an editable YAML document inside a modal overlay.",
    Examples:
    [
        {
            Code: "<YamlEditorOverlay Title=\"Configuration\" Validate={validate} ... />",
            Preview: Basic,
            Title: "Validated YAML"
        }
    ],
    Name: "YamlEditorOverlay",
    Source:
    {
        Component: "YamlEditorOverlay",
        Path: "CodeEditor/YamlBodyViewer.tsx",
        Props: "YamlEditorOverlayProps"
    }
});
