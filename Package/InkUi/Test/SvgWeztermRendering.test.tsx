/**
 * WezTerm image-protocol tests for Svg.
 *
 * @module @sorrell/ink-ui/Test/SvgWeztermRendering
 *
 * @file      SvgWeztermRendering.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { Svg } from "../Source/Svg/index.js";

vi.mock("../Source/Support/Query.js", () => ({
    QueryTerminalSupport: async () => ({
        CellSizePixels: { X: 8, Y: 16 },
        ItermImages: true,
        Sixel: true,
        Terminal: { Kind: "wezterm", Name: "WezTerm" }
    })
}));

const Flush = async (): Promise<void> =>
{
    for (let Index: number = 0; Index < 6; Index += 1)
    {
        await new Promise<void>((Resolve) => setImmediate(Resolve));
    }
};

const RedSquare = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"16\">"
    + "<rect width=\"8\" height=\"16\" fill=\"#f00\"/>"
    + "</svg>";

describe("Svg WezTerm rendering", () =>
{
    it("uses OSC 1337 without allowing WezTerm to move the cursor", async () =>
    {
        const App = render(
            <Svg height={ 1 }
                width={ 1 }>
                { RedSquare }
            </Svg>
        );
        await Flush();

        const Paint: string = [ ...App.frames ].reverse().find((Frame: string) =>
            Frame.includes("\u001B]1337;File=")) ?? "";

        expect(Paint).toContain(";preserveAspectRatio=1;doNotMoveCursor=1:");
        expect(Paint).not.toContain("\u001BP0;1;q");
    });
});
