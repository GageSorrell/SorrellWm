/**
 * iTerm2 image-protocol tests for Svg.
 *
 * @module @sorrell/ink-ui/Test/SvgItermRendering
 *
 * @file      SvgItermRendering.test.tsx
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
        Terminal: { Kind: "iterm2", Name: "iTerm2" }
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
    + "<rect x=\"2\" y=\"4\" width=\"4\" height=\"8\" fill=\"#f00\"/>"
    + "</svg>";

describe("Svg iTerm2 rendering", () =>
{
    it("prefers a correctly sized PNG over Sixel when both protocols are available", async () =>
    {
        const App = render(
            <Svg height={ 1 }
                width={ 1 }>{ RedSquare }</Svg>
        );
        await Flush();

        const Paint: string = [ ...App.frames ].reverse().find((Frame: string) =>
            Frame.includes("\u001B]1337;File=")) ?? "";
        const Match: RegExpMatchArray | null = Paint.match(new RegExp(
            "\\u001B\\]1337;File=inline=1;size=(\\d+);width=1;height=1;"
                + "preserveAspectRatio=1:([A-Za-z0-9+/=]+)\\u0007",
            "u"
        ));

        expect(Paint).not.toContain("\u001BP0;1;q");
        expect(Match).not.toBeNull();

        const Png: Buffer = Buffer.from(Match?.[2] ?? "", "base64");
        expect(Png.length).toBe(Number(Match?.[1]));
        expect(Png.subarray(0, 8)).toEqual(
            Buffer.from([ 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a ])
        );
    });
});
