/**
 * Button component tests.
 *
 * @module @sorrell/ink-ui/Test/Button
 *
 * @file      Button.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import * as Ink from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import { Button } from "../Source/Button/index.js";
import { InteractionProvider } from "../Source/Interaction/index.js";
import { MouseProvider } from "../Source/Mouse/index.js";
import {
    DefaultTheme,
    ResolveButtonStyle,
    type Theme,
    ThemeProvider
} from "../Source/Theme.js";

const StateTheme: Theme = {
    ...DefaultTheme,
    Button: {
        secondary: {
            Default: { BorderStyle: "single" },
            Disabled: { BorderStyle: "classic" },
            Focused: { BorderStyle: "double" },
            Hovered: { BorderStyle: "round" },
            Pressed: { BorderStyle: "bold" }
        }
    }
};

const Flush = (): Promise<void> => new Promise((Resolve) => setImmediate(Resolve));

function Providers({
    ButtonValue,
    InitialFocus,
    MouseEnabled = true
}: {
    readonly ButtonValue: React.ReactNode;
    readonly InitialFocus?: string;
    readonly MouseEnabled?: boolean;
}): React.ReactElement
{
    return (
        <ThemeProvider Theme={ StateTheme }>
            <InteractionProvider InitialFocus={ InitialFocus }
                ShowFooter={ false }>
                <MouseProvider IsEnabled={ MouseEnabled }>
                    { ButtonValue }
                </MouseProvider>
            </InteractionProvider>
        </ThemeProvider>
    );
}

describe("Button theme", () =>
{
    it("resolves appearance state overrides over palette-derived defaults", () =>
    {
        expect(ResolveButtonStyle(StateTheme, "secondary", "Default"))
            .toMatchObject({ BorderStyle: "single", Color: DefaultTheme.Text });
        expect(ResolveButtonStyle(StateTheme, "secondary", "Pressed"))
            .toMatchObject({ BorderStyle: "bold" });
        expect(ResolveButtonStyle(DefaultTheme, "primary", "Disabled"))
            .toMatchObject({ Color: DefaultTheme.TextMuted, DimColor: true });
    });
});

describe("Button interaction", () =>
{
    it("lays out box-backed icons beside the text label", () =>
    {
        const App = render(<Providers
            ButtonValue={
                <Button Icon={ <Ink.Box><Ink.Text>!</Ink.Text></Ink.Box> }
                    Id="icon-button">
                    Go
                </Button>
            }
            MouseEnabled={ false } />);

        expect(App.lastFrame()).toContain("! Go");
    });

    it("uses hover and held-mouse styles and commits on a primary click", async () =>
    {
        const Presses: Array<string> = [];
        const App = render(<Providers ButtonValue={
            <Button Id="mouse-button"
                OnPress={ (Event) => Presses.push(Event.Source) }>
                Run
            </Button>
        } />);

        expect(App.lastFrame()).toContain("╔");
        App.stdin.write("\x1b[<35;2;2M");
        await Flush();
        expect(App.lastFrame()).toContain("╭");
        App.stdin.write("\x1b[<0;2;2M");
        await Flush();
        expect(App.lastFrame()).toContain("┏");
        expect(Presses).toEqual([]);
        App.stdin.write("\x1b[<0;2;2m");
        await Flush();
        expect(Presses).toEqual([ "mouse" ]);
        expect(App.lastFrame()).toContain("╭");
    });

    it("keeps the active style for Kitty press/release events", async () =>
    {
        const Presses: Array<string> = [];
        const App = render(<Providers
            ButtonValue={
                <Button Id="keyboard-button"
                    OnPress={ (Event) => Presses.push(Event.Source) }>
                    Save
                </Button>
            }
            InitialFocus="keyboard-button"
            MouseEnabled={ false } />);

        expect(App.lastFrame()).toContain("╔");
        App.stdin.write("\x1b[13;1:1u");
        await Flush();
        expect(Presses).toEqual([]);
        expect(App.lastFrame()).toContain("┏");
        App.stdin.write("\x1b[13;1:3u");
        await Flush();
        expect(App.lastFrame()).toContain("╔");
        expect(Presses).toEqual([ "keyboard" ]);
    });

    it("flashes when release events are unavailable and ignores disabled activation", async () =>
    {
        const Presses: Array<string> = [];
        const App = render(<Providers
            ButtonValue={
                <Button FlashDurationMs={ 15 }
                    Id="fallback-button"
                    OnPress={ (Event) => Presses.push(Event.Source) }>
                    Apply
                </Button>
            }
            InitialFocus="fallback-button"
            MouseEnabled={ false } />);

        App.stdin.write("\r");
        await Flush();
        expect(Presses).toEqual([ "keyboard" ]);
        expect(App.lastFrame()).toContain("┏");
        await new Promise((Resolve) => setTimeout(Resolve, 25));
        await Flush();
        expect(App.lastFrame()).toContain("╔");

        App.rerender(<Providers
            ButtonValue={
                <Button Disabled
                    DisabledFocusable
                    Id="fallback-button"
                    OnPress={ (Event) => Presses.push(Event.Source) }>
                    Apply
                </Button>
            }
            InitialFocus="fallback-button"
            MouseEnabled={ false } />);
        expect(App.lastFrame()).toContain("+");
        App.stdin.write("\r");
        expect(Presses).toEqual([ "keyboard" ]);
    });
});
