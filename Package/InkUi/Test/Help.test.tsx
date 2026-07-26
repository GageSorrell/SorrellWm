/**
 * Contextual help tests.
 *
 * @module @sorrell/ink-ui/Test/Help
 *
 * @file      Help.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { Box } from "../Source/Box/index.js";
import {
    ChooseTooltipPlacement,
    HelpProvider,
    Tooltip
} from "../Source/Help/index.js";
import { InteractionProvider } from "../Source/Interaction/index.js";
import { MouseProvider } from "../Source/Mouse/index.js";

const Flush = (): Promise<void> => new Promise((Resolve) => setImmediate(Resolve));

function Providers({ children, delay = 0 }: React.PropsWithChildren<{
    readonly delay?: number;
}>): React.ReactElement
{
    return (
        <InteractionProvider ShowFooter={ false }>
            <MouseProvider>
                <Ink.Box flexDirection="column"
                    height={ 24 }
                    width={ 80 }>
                    <HelpProvider delay={ delay }
                        icon={ <Ink.Text>?</Ink.Text> }>
                        { children }
                    </HelpProvider>
                </Ink.Box>
            </MouseProvider>
        </InteractionProvider>
    );
}

describe("tooltip placement", () =>
{
    it("tries the nearest cardinal position when the preferred side is clipped", () =>
    {
        expect(ChooseTooltipPlacement(
            { Height: 1, Left: 10, Top: 2, Width: 2 },
            { Height: 2, Width: 5 },
            { Height: 6, Width: 12 },
            "right"
        )).toMatchObject({ FullyVisible: true, Position: "bottom" });
    });

    it("uses the candidate with the greatest visible area when none fit", () =>
    {
        expect(ChooseTooltipPlacement(
            { Height: 1, Left: 1, Top: 1, Width: 2 },
            { Height: 4, Width: 6 },
            { Height: 3, Width: 4 },
            "top"
        )).toMatchObject({ FullyVisible: false, Position: "top", VisibleArea: 4 });
    });
});

describe("HelpProvider", () =>
{
    it("preserves ordinary child output and shows a tooltip only after hover delay", async () =>
    {
        const Enter = vi.fn();
        const App = render(
            <Providers delay={ 5 }>
                <Tooltip content="Context">
                    <Box onMouseEnter={ Enter }><Ink.Text>Target</Ink.Text></Box>
                </Tooltip>
            </Providers>
        );

        expect(App.lastFrame()).toContain("Target");
        expect(App.lastFrame()).not.toContain("Context");
        await Flush();
        App.stdin.write("\u001B[<0;2;1M");
        expect(Enter).toHaveBeenCalledOnce();
        await new Promise((Resolve) => setTimeout(Resolve, 10));
        await Flush();
        expect(App.lastFrame()).toContain("Context");
        App.stdin.write("\u001B[<0;20;20m");
        await vi.waitFor(() => expect(App.lastFrame()).not.toContain("Context"));
    });

    it("enters Help Mode with question mark and cycles visible tooltips", async () =>
    {
        const App = render(
            <Providers>
                <Tooltip content="First help">
                    <Box><Ink.Text>One</Ink.Text></Box>
                </Tooltip>
                <Tooltip content="Second help">
                    <Box><Ink.Text>Two</Ink.Text></Box>
                </Tooltip>
            </Providers>
        );

        App.stdin.write("?");
        await vi.waitFor(() => expect(App.lastFrame()).toContain("First help"));
        App.stdin.write("\t");
        await vi.waitFor(() => expect(App.lastFrame()).toContain("Second help"));
        expect(App.lastFrame()).not.toContain("First help");
        App.stdin.write("\u001B");
        await vi.waitFor(() => expect(App.lastFrame()).not.toContain("Second help"));
    });
});
