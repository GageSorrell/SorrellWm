/**
 * Input component tests.
 *
 * @module @sorrell/ink-ui/Test/Input
 *
 * @file      Input.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { render } from "ink-testing-library";
import {
    CompletionMenu,
    Select,
    TextArea,
    TextInput,
    ThemeProvider,
    VarInput,
    VarText
} from "../Source/index.js";

const Render = (Value: React.ReactElement): string =>
    render(<ThemeProvider>{ Value }</ThemeProvider>).lastFrame() ?? "";

describe("input components", () =>
{
    it("TextInput renders its controlled value", () =>
    {
        expect(Render(<TextInput Focused={ false }
            Value="hello" />)).toContain("hello");
    });

    it("TextArea renders multiple lines", () =>
    {
        const Value = Render(<TextArea Focused={ false }
            Value={ "one\ntwo" } />);
        expect(Value).toContain("one");
        expect(Value).toContain("two");
    });

    it("Select renders its selected label", () =>
    {
        expect(Render(<Select
            Focused={ false }
            Items={ [ { Label: "First", Value: "first" } ] }
            Value="first" />)).toContain("First");
    });

    it("VarText renders variable tokens", () =>
    {
        expect(Render(<VarText Text="$HOME"
            Values={ { HOME: "/home" } } />))
            .toContain("$HOME");
    });

    it("CompletionMenu renders suggestions", () =>
    {
        expect(Render(<CompletionMenu Items={ [ "HOME", "HOST" ] } />))
            .toContain("$HOME");
    });

    it("VarInput renders matching suggestions", () =>
    {
        expect(Render(<VarInput
            Focused={ false }
            Value="$HO"
            Values={ { HOME: "/home", HOST: "localhost" } } />))
            .toContain("$HOME");
    });
});
