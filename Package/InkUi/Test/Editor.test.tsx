/**
 * Editor component tests.
 *
 * @module @sorrell/ink-ui/Test/Editor
 *
 * @file      Editor.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { render } from "ink-testing-library";
import {
    CodeEditor,
    JsonBodyViewer,
    ThemeProvider,
    YamlEditorOverlay
} from "../Source/index.js";

const Render = (Value: React.ReactElement): string =>
    render(<ThemeProvider>{ Value }</ThemeProvider>).lastFrame() ?? "";

describe("editor components", () =>
{
    it("CodeEditor renders a language and source", () =>
    {
        const Value = Render(<CodeEditor
            Focused={ false }
            Language="json"
            Value={ "{ \"ready\": true }" } />);
        expect(Value).toContain("JSON");
        expect(Value).toContain("ready");
    });

    it("JsonBodyViewer serializes objects", () =>
    {
        expect(Render(<JsonBodyViewer Value={ { ready: true } } />)).toContain("\"ready\"");
    });

    it("YamlEditorOverlay renders YAML", () =>
    {
        expect(Render(<YamlEditorOverlay Value="name: value" />)).toContain("name: value");
    });
});
