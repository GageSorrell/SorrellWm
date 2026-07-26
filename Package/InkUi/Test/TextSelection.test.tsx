/**
 * Text navigation and selection tests.
 *
 * @module @sorrell/ink-ui/Test/TextSelection
 *
 * @file      TextSelection.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import {
    GetNextWordOffset,
    GetPreviousWordOffset,
    GetTextNavigationOffset
} from "../Source/Internal/Input.js";
import { Key } from "../Source/Interaction/Key.js";
import { MouseProvider } from "../Source/Mouse/index.js";
import { TextArea } from "../Source/TextArea.js";
import { TextInput } from "../Source/TextInput.js";
import { ThemeProvider } from "../Source/Theme.js";
import { VarInput } from "../Source/VarInput.js";

const Flush = (): Promise<void> => new Promise((Resolve) => setImmediate(Resolve));

function ControlledTextInput({ Focused = true }: { readonly Focused?: boolean }): React.ReactElement
{
    const [ Value, SetValue ] = React.useState("one two");
    return (
        <Ink.Box flexDirection="column">
            <TextInput Focused={ Focused }
                OnChange={ SetValue }
                Value={ Value } />
            <Ink.Text>value:{ Value }</Ink.Text>
        </Ink.Box>
    );
}

function ControlledTextArea(): React.ReactElement
{
    const [ Value, SetValue ] = React.useState("one two\nabc\ndef");
    return (
        <Ink.Box flexDirection="column">
            <TextArea Height={ 2 }
                OnChange={ SetValue }
                Value={ Value } />
            <Ink.Text>value:{ Value.replaceAll("\n", "|") }</Ink.Text>
        </Ink.Box>
    );
}

function ControlledVarInput(): React.ReactElement
{
    const [ Value, SetValue ] = React.useState("$HOME");
    return (
        <Ink.Box flexDirection="column">
            <VarInput
                OnChange={ SetValue }
                Value={ Value }
                Values={ { HOME: "home" } } />
            <Ink.Text>value:{ Value }</Ink.Text>
        </Ink.Box>
    );
}

describe("text navigation", () =>
{
    it("moves by words, lines, pages, paragraphs, and document bounds", () =>
    {
        expect(GetPreviousWordOffset("one two", 7)).toBe(4);
        expect(GetNextWordOffset("one two", 0)).toBe(4);
        expect(GetTextNavigationOffset("one\ntwo\nthree", 13, Key({ pageUp: true }), {
            Multiline: true,
            PageRows: 2,
            PreferredColumn: 3
        })).toBe(3);
        expect(GetTextNavigationOffset("one\n\ntwo", 8, Key({ ctrl: true, upArrow: true }), {
            Multiline: true
        })).toBe(0);
        expect(GetTextNavigationOffset("one\ntwo", 2, Key({ ctrl: true, end: true }), {
            Multiline: true
        })).toBe(7);
    });

    it("uses Control+Arrow movement and page navigation in the components", async () =>
    {
        const Input = render(<ThemeProvider><ControlledTextInput /></ThemeProvider>);
        Input.stdin.write("\u001B[1;5D");
        await Flush();
        Input.stdin.write("X");
        await Flush();
        expect(Input.lastFrame()).toContain("value:one Xtwo");

        const Area = render(<ThemeProvider><ControlledTextArea /></ThemeProvider>);
        Area.stdin.write("\u001B[5~");
        await Flush();
        Area.stdin.write("X");
        await Flush();
        expect(Area.lastFrame()).toContain("value:oneX two|abc|def");
    });
});

describe("text selection", () =>
{
    it("extends with Shift, replaces the selection, and clears it on plain navigation", async () =>
    {
        const App = render(<ThemeProvider><ControlledTextInput /></ThemeProvider>);
        App.stdin.write("\u001B[1;6D");
        await Flush();
        App.stdin.write("X");
        await Flush();
        expect(App.lastFrame()).toContain("value:one X");

        App.stdin.write("\u001B[1;2D");
        await Flush();
        App.stdin.write("\u001B[C");
        await Flush();
        App.stdin.write("Y");
        await Flush();
        expect(App.lastFrame()).toContain("value:one XY");
    });

    it("clears the selection when focus moves away", async () =>
    {
        const RenderValue = (Focused: boolean): React.ReactElement => (
            <ThemeProvider><ControlledTextInput Focused={ Focused } /></ThemeProvider>
        );
        const App = render(RenderValue(true));
        App.stdin.write("\u001B[1;6D");
        await Flush();
        App.rerender(RenderValue(false));
        await Flush();
        App.rerender(RenderValue(true));
        await Flush();
        App.stdin.write("X");
        await Flush();
        expect(App.lastFrame()).toContain("value:one Xtwo");
    });

    it("selects and replaces multiline text", async () =>
    {
        const App = render(<ThemeProvider><ControlledTextArea /></ThemeProvider>);
        App.stdin.write("\u001B[1;6D");
        await Flush();
        App.stdin.write("X");
        await Flush();
        expect(App.lastFrame()).toContain("value:one two|abc|X");
    });

    it("lets VarInput pass modified arrows through to TextInput", async () =>
    {
        const App = render(<ThemeProvider><ControlledVarInput /></ThemeProvider>);
        App.stdin.write("\u001B[1;6D");
        await Flush();
        App.stdin.write("X");
        await Flush();
        expect(App.lastFrame()).toContain("value:$X");
    });

    it("supports primary-button drag selection in TextInput", async () =>
    {
        const App = render(
            <ThemeProvider>
                <MouseProvider>
                    <ControlledTextInput />
                </MouseProvider>
            </ThemeProvider>
        );
        App.stdin.write("\u001B[<0;2;1M");
        await Flush();
        App.stdin.write("\u001B[<32;5;1M");
        await Flush();
        App.stdin.write("X");
        await Flush();
        expect(App.lastFrame()).toContain("value:oXtwo");
    });

    it("supports primary-button drag selection across TextArea lines", async () =>
    {
        const App = render(
            <ThemeProvider>
                <MouseProvider>
                    <ControlledTextArea />
                </MouseProvider>
            </ThemeProvider>
        );
        App.stdin.write("\u001B[<0;1;1M");
        await Flush();
        App.stdin.write("\u001B[<32;3;2M");
        await Flush();
        App.stdin.write("X");
        await Flush();
        expect(App.lastFrame()).toContain("value:one two|Xf");
    });

    it("inherits primary-button drag selection in VarInput", async () =>
    {
        const App = render(
            <ThemeProvider>
                <MouseProvider>
                    <ControlledVarInput />
                </MouseProvider>
            </ThemeProvider>
        );
        App.stdin.write("\u001B[<0;2;1M");
        await Flush();
        App.stdin.write("\u001B[<32;6;1M");
        await Flush();
        App.stdin.write("X");
        await Flush();
        expect(App.lastFrame()).toContain("value:$X");
    });
});
