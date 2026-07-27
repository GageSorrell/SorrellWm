/**
 * LaTeX component tests.
 *
 * @module @sorrell/ink-ui/Test/LaTeX
 *
 * @file      LaTeX.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { LaTeX } from "../Source/LaTeX/index.js";
import { render } from "ink-testing-library";

vi.mock("../Source/Support/Query.js", () => ({
    QueryTerminalSupport: async () => ({ Sixel: false })
}));

const ErrorFallback = ({ error }: { readonly error: Error }): React.ReactElement =>
    <Ink.Text>{ error.message }</Ink.Text>;

describe("LaTeX", () =>
{
    it("passes malformed TeX errors to the fallback", async () =>
    {
        const App = render(
            <LaTeX fallback={ ErrorFallback }>{ "\\frac{" }</LaTeX>
        );

        await WaitForFrame(App, (Frame: string) => Frame.includes("brace"));
        expect(App.lastFrame()).toContain("brace");
    });

    it("converts valid TeX to SVG before using the unsupported-terminal fallback", async () =>
    {
        const App = render(
            <LaTeX color="#ff00ff"
                display={ false }
                fallback={ ErrorFallback }>
                { "E = mc^2" }
            </LaTeX>
        );

        await WaitForFrame(App, (Frame: string) => Frame.includes("Sixel"));
        expect(App.lastFrame())
            .toBe("The terminal does not support iTerm2 image or Sixel rendering.");
    });
});

async function WaitForFrame(
    App: ReturnType<typeof render>,
    Predicate: (Frame: string) => boolean
): Promise<void>
{
    for (let Attempt: number = 0; Attempt < 100; Attempt += 1)
    {
        const Frame: string = App.lastFrame() ?? "";
        if (Predicate(Frame)) {return;}
        await new Promise((Resolve) => setTimeout(Resolve, 10));
    }

    throw new Error(`Timed out waiting for a rendered frame. Last frame: ${ App.lastFrame() }`);
}
