/**
 *
 *
 * @module @sorrell/ink-ui/Test/SvgRendering.test
 *
 * @file      SvgRendering.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** Regression tests for persistent SVG/Sixel rendering. */

import * as Ink from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { Icon } from "../Source/Icon/index.js";
import { Svg } from "../Source/Svg/index.js";
import { RegisterPainter } from "../Source/Svg/Paint.js";
import { Text } from "../Source/Text/Text.js";

vi.mock("../Source/Support/Query.js", () => ({
    QueryTerminalSupport: async () => ({
        BackgroundColor: { Blue: 0, Green: 0, Red: 0 },
        CellSizePixels: { X: 8, Y: 16 },
        Sixel: true,
        Terminal: { Kind: "windows-terminal", Name: "Windows Terminal" }
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

describe("persistent SVG rendering", () =>
{
    it("paints every initially mounted SVG in one frame", async () =>
    {
        const App = render(
            <Ink.Box>
                <Svg height={ 1 }
                    width={ 1 }>{ RedSquare }</Svg>
                <Svg height={ 1 }
                    width={ 1 }>{ RedSquare }</Svg>
                <Svg height={ 1 }
                    width={ 1 }>{ RedSquare }</Svg>
            </Ink.Box>
        );

        await Flush();

        const PaintFrames: ReadonlyArray<string> = App.frames.filter((Frame: string) =>
            Frame.includes("\u001BP0;1;q"));
        expect(PaintFrames).toHaveLength(1);
        expect((PaintFrames[0]?.split("\u001BP0;1;q").length ?? 1) - 1).toBe(3);
    });

    it("coalesces every synchronized Ink frame with its image repaint", async () =>
    {
        const Writes: Array<string> = [ ];
        const Stream = {
            write: (Value: string): boolean =>
            {
                Writes.push(Value);
                return true;
            }
        } as unknown as NodeJS.WriteStream;
        const Unregister: () => void = RegisterPainter(Stream, (WriteValue) =>
            WriteValue("image"));
        await Flush();
        Writes.length = 0;

        for (let Index: number = 0; Index < 3; Index += 1)
        {
            Stream.write("\u001B[?2026h");
            Stream.write(`frame${ Index }`);
            Stream.write("\u001B[?2026l");
        }

        expect(Writes).toEqual([ 0, 1, 2 ].map((Index: number) =>
            `\u001B[?2026hframe${ Index }image\u001B[?2026l`));
        Unregister();
    });

    it("coalesces ordinary Ink frames with their image repaint", async () =>
    {
        const Writes: Array<string> = [ ];
        const Stream = {
            write: (Value: string): boolean =>
            {
                Writes.push(Value);
                return true;
            }
        } as unknown as NodeJS.WriteStream;
        const Unregister: () => void = RegisterPainter(Stream, (WriteValue) =>
            WriteValue("image"));
        await Flush();
        Writes.length = 0;

        Stream.write("frame");

        expect(Writes).toEqual([
            "\u001B[?2026hframeimage\u001B[?2026l"
        ]);
        Unregister();
    });

    it("emits an initial multi-image restore as one synchronized write", async () =>
    {
        const Writes: Array<string> = [ ];
        const Stream = {
            write: (Value: string): boolean =>
            {
                Writes.push(Value);
                return true;
            }
        } as unknown as NodeJS.WriteStream;
        const UnregisterFirst: () => void = RegisterPainter(Stream, (WriteValue) =>
            WriteValue("first"));
        const UnregisterSecond: () => void = RegisterPainter(Stream, (WriteValue) =>
            WriteValue("second"));

        await Flush();

        expect(Writes).toEqual([
            "\u001B[?2026hfirstsecond\u001B[?2026l"
        ]);
        UnregisterFirst();
        UnregisterSecond();
    });

    it("does not repaint existing images when another painter registers later", async () =>
    {
        const Writes: Array<string> = [ ];
        const Stream = {
            write: (Value: string): boolean =>
            {
                Writes.push(Value);
                return true;
            }
        } as unknown as NodeJS.WriteStream;
        const UnregisterFirst: () => void = RegisterPainter(Stream, (WriteValue) =>
            WriteValue("first"));
        await Flush();
        Writes.length = 0;

        const UnregisterSecond: () => void = RegisterPainter(Stream, (WriteValue) =>
            WriteValue("second"));
        await Flush();

        expect(Writes).toEqual([
            "\u001B[?2026hsecond\u001B[?2026l"
        ]);
        UnregisterFirst();
        UnregisterSecond();
    });

    it("repaints an SVG after an unrelated Ink rerender", async () =>
    {
        const View = (Label: string): React.ReactElement => (
            <Ink.Box flexDirection="column">
                <Ink.Text>{ Label }</Ink.Text>
                <Svg height={ 1 }
                    width={ 1 }>{ RedSquare }</Svg>
                <Ink.Text>below</Ink.Text>
            </Ink.Box>
        );
        const App = render(View("before"));
        await Flush();
        const InitialPaints: number = App.frames.filter((Frame: string) =>
            Frame.includes("\u001BP0;1;q")).length;

        App.rerender(View("after"));
        await Flush();
        const FinalPaints: number = App.frames.filter((Frame: string) =>
            Frame.includes("\u001BP0;1;q")).length;

        expect(InitialPaints).toBeGreaterThan(0);
        expect(FinalPaints).toBeGreaterThan(InitialPaints);
        expect(App.frames.some((Frame: string) =>
            Frame.includes("after") && Frame.includes("\u001BP0;1;q"))).toBe(true);
        expect(App.frames.some((Frame: string) =>
            Frame.includes("\u001B7\u001B[2A\r"))).toBe(true);
    });

    it("does not turn a transparent SVG background into an opaque palette color", async () =>
    {
        const App = render(<Icon src={ RedSquare } />);
        await Flush();
        const Paint: string | undefined = [ ...App.frames ].reverse().find((Frame: string) =>
            Frame.includes("\u001BP0;1;q"));

        expect(Paint).toContain("#0;2;100;0;0");
        expect(Paint).not.toContain(";2;0;0;0");
    });

    it("limits crisp antialiasing to a small Sixel shade palette", async () =>
    {
        const App = render(
            <Svg height={ 2 }
                rasterization="crisp"
                width={ 2 }>
                { "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"32\">"
                    + "<circle cx=\"8\" cy=\"16\" r=\"6.4\" fill=\"#fff\"/></svg>" }
            </Svg>
        );
        await Flush();
        const Paint: string = [ ...App.frames ].reverse().find((Frame: string) =>
            Frame.includes("\u001BP0;1;q")) ?? "";
        const PaletteEntries: ReadonlyArray<string> = Paint.match(/#\d+;2;/gu) ?? [ ];

        expect(PaletteEntries.length).toBeGreaterThan(1);
        expect(PaletteEntries.length).toBeLessThanOrEqual(8);
    });

    it("upgrades CSS-sized Text from its readable interim frame to SVG", async () =>
    {
        const App = render(<Text fontSize="2em">Large</Text>);
        expect(App.lastFrame()).toContain("Large");

        await Flush();

        expect(App.frames.some((Frame: string) =>
            Frame.includes("\u001BP0;1;q"))).toBe(true);
    });
});
