/**
 * ScrollView layout and interaction tests.
 *
 * @module @sorrell/ink-ui/Test/ScrollView
 *
 * @file      ScrollView.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { Focusable, InteractionProvider } from "../Source/Interaction/index.js";
import { MouseProvider } from "../Source/Mouse/index.js";
import { GetScrollbarGeometry, ScrollView } from "../Source/ScrollView.js";
import { ThemeProvider } from "../Source/Theme.js";

const Rows = (): React.ReactElement => (
    <Ink.Box flexDirection="column">
        <Ink.Text>zero</Ink.Text>
        <Ink.Text>one</Ink.Text>
        <Ink.Text>two</Ink.Text>
        <Ink.Text>three</Ink.Text>
        <Ink.Text>four</Ink.Text>
    </Ink.Box>
);

function Providers({ children, Mouse = false }: React.PropsWithChildren<{
    readonly Mouse?: boolean;
}>): React.ReactElement
{
    const Content = Mouse ? <MouseProvider>{ children }</MouseProvider> : children;
    return (
        <ThemeProvider>
            <InteractionProvider ShowFooter={ false }>{ Content }</InteractionProvider>
        </ThemeProvider>
    );
}

describe("ScrollView geometry", () =>
{
    it("sizes and positions proportional thumbs", () =>
    {
        expect(GetScrollbarGeometry(10, 5, 20, 0)).toEqual({ Length: 2.5, Start: 0 });
        expect(GetScrollbarGeometry(10, 5, 20, 15)).toEqual({ Length: 2.5, Start: 7.5 });
        expect(GetScrollbarGeometry(7, 3, 10, 0)).toEqual({ Length: 2.125, Start: 0 });
        expect(GetScrollbarGeometry(4, 8, 8, 0)).toEqual({ Length: 4, Start: 0 });
    });
});

describe("ScrollView layout", () =>
{
    it("grows to unconstrained contents without creating auto scrollbars", async () =>
    {
        const App = render(
            <Providers>
                <ScrollView><Ink.Text>natural</Ink.Text></ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("natural"));
        expect(App.lastFrame()).not.toContain("░");
        expect(App.lastFrame()).not.toContain("█");
    });

    it("adds auto scrollbars only when constrained content overflows", async () =>
    {
        const App = render(
            <Providers>
                <ScrollView HorizontalScrollbarThumb="="
                    HorizontalScrollbarTrack="-"
                    height={ 3 }
                    width={ 6 }>
                    <Rows />
                </ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("█"));
        expect(App.lastFrame()).not.toContain("░");
        expect(App.lastFrame()?.split("\n")).toHaveLength(3);
        expect(App.lastFrame()).not.toContain("-");
        expect(App.lastFrame()).not.toContain("=");
        expect(App.lastFrame()).toContain("zero");
        expect(App.lastFrame()).not.toContain("three");
    });

    it("uses fractional block elements for vertical thumb endpoints", async () =>
    {
        const App = render(
            <Providers>
                <ScrollView AutoFocus
                    height={ 4 }
                    overflowX="hidden"
                    width={ 8 }>
                    <Ink.Box flexDirection="column">
                        { Array.from({ length: 12 }, (_: unknown, Index: number) =>
                            <Ink.Text key={ Index }>row { Index }</Ink.Text>) }
                    </Ink.Box>
                </ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("█"));

        App.stdin.write("\u001B[B");

        await vi.waitFor(() => expect(App.lastFrame()).toContain("▅"));
        expect(App.lastFrame()).toContain("▂");
    });

    it("uses fractional block elements for horizontal thumb endpoints", async () =>
    {
        const App = render(
            <Providers>
                <ScrollView AutoFocus
                    height={ 2 }
                    overflowY="hidden"
                    width={ 8 }>
                    <Ink.Box width={ 20 }>
                        <Ink.Text wrap="truncate-end">abcdefghijklmnopqrst</Ink.Text>
                    </Ink.Box>
                </ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("█"));

        App.stdin.write("\u001B[C");

        await vi.waitFor(() => expect(App.lastFrame()).toContain("▍"));
        expect(App.lastFrame()).toContain("▋");
        expect(App.lastFrame()).toContain("█");
    });

    it("supports always-visible customized bars on both axes", async () =>
    {
        const App = render(
            <Providers>
                <ScrollView
                    HorizontalScrollbarThumb="H"
                    ScrollbarCorner="C"
                    VerticalScrollbarThumb="V"
                    height={ 3 }
                    overflow="scroll"
                    width={ 8 }>
                    <Ink.Text>small</Ink.Text>
                </ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("C"));
        expect(App.lastFrame()).toContain("H");
        expect(App.lastFrame()).toContain("V");
    });

    it("clips without reserving scrollbars when overflow is hidden", async () =>
    {
        const OnScroll = vi.fn();
        const App = render(
            <Providers>
                <ScrollView
                    HorizontalScrollbarThumb="H"
                    OnScroll={ OnScroll }
                    VerticalScrollbarThumb="V"
                    height={ 3 }
                    overflow="hidden"
                    width={ 6 }>
                    <Rows />
                </ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("zero"));
        expect(App.lastFrame()).not.toContain("H");
        expect(App.lastFrame()).not.toContain("V");
        App.stdin.write("\u001B[B");
        await new Promise((Resolve) => setImmediate(Resolve));
        expect(OnScroll).not.toHaveBeenCalled();
    });
});

describe("ScrollView interaction", () =>
{
    it("receives Interaction focus and scrolls vertically and horizontally", async () =>
    {
        const OnScroll = vi.fn();
        const App = render(
            <Providers>
                <Focusable Id="before"><Ink.Text>before</Ink.Text></Focusable>
                <ScrollView
                    Id="scroll"
                    OnScroll={ OnScroll }
                    ScrollStep={ 1 }
                    height={ 3 }
                    width={ 6 }>
                    <Ink.Box flexDirection="column"
                        width={ 10 }>
                        <Ink.Text wrap="truncate-end">abcdefghij</Ink.Text>
                        <Ink.Text wrap="truncate-end">klmnopqrst</Ink.Text>
                        <Ink.Text wrap="truncate-end">uvwxyzABCD</Ink.Text>
                        <Ink.Text wrap="truncate-end">EFGHIJKLMN</Ink.Text>
                    </Ink.Box>
                </ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("█"));
        App.stdin.write("\t");
        await new Promise((Resolve) => setImmediate(Resolve));
        App.stdin.write("\u001B[C");
        await new Promise((Resolve) => setImmediate(Resolve));
        App.stdin.write("\u001B[B");
        await vi.waitFor(() => expect(OnScroll).toHaveBeenCalledWith({ Left: 1, Top: 1 }));
        expect(App.lastFrame()).toContain("lmnop");
    });

    it("supports mouse-wheel scrolling and vertical thumb dragging", async () =>
    {
        const OnScroll = vi.fn();
        const App = render(
            <Providers Mouse>
                <ScrollView
                    OnScroll={ OnScroll }
                    ScrollStep={ 1 }
                    height={ 3 }
                    overflowX="hidden"
                    width={ 6 }>
                    <Rows />
                </ScrollView>
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("█"));
        App.stdin.write("\u001B[<65;2;2M");
        await vi.waitFor(() => expect(OnScroll).toHaveBeenCalledWith({ Left: 0, Top: 1 }));

        App.stdin.write("\u001B[<0;6;2M");
        await new Promise((Resolve) => setImmediate(Resolve));
        App.stdin.write("\u001B[<32;6;3M");
        await vi.waitFor(() => expect(OnScroll).toHaveBeenCalledWith({ Left: 0, Top: 2 }));
        expect(App.lastFrame()).toContain("four");
    });
});
