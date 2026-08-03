/**
 * Showcase story for code editor.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/CodeEditor
 *
 * @file      CodeEditor.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { StatefulCodeEditor as Basic } from "./Shared.js";
import { SimpleStory } from "./Factory.js";

export default SimpleStory({
    Basic: { Code: "<CodeEditor Language=\"json\" Value={value} OnChange={setValue} />", Preview: Basic },
    Description: "A controlled multiline editor with language-aware formatting and validation.",
    Examples:
    [
        {
            Code: "<CodeEditor Language=\"yaml\" Value={yaml} OnChange={setYaml} />",
            Preview: Basic,
            Title: "Structured documents"
        }
    ],
    Name: "CodeEditor",
    Source: { Component: "CodeEditor", Path: "CodeEditor/CodeEditor.tsx", Props: "CodeEditorProps" }
});
