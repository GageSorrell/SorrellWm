/**
 * Box component tests.
 *
 * @module @sorrell/ink-ui/Test/Box
 *
 * @file      Box.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import { Box } from "../Source/Box/index.js";
import { GetBoxMouseBounds } from "../Source/Box/Mouse.js";
import { MouseProvider } from "../Source/Mouse/index.js";
import {
    type CompactBorderOptions,
    type CompactCornerOptions,
    type CornerShapeValue,
    ParseCornerShape,
    ParseCssLength,
    RenderCompactBorder
} from "../Source/Box/CompactBorder.js";

const Context = {
    CellHeight: 20,
    CellWidth: 10,
    Height: 80,
    Width: 100
} as const;

const White = [ 255, 255, 255, 255 ] as const;

function Options(
    Shape: CornerShapeValue,
    Radius?: number | string,
    OuterBackgroundColor?: CompactBorderOptions["OuterBackgroundColor"]
): CompactBorderOptions
{
    const Corner: CompactCornerOptions = { Radius, Shape };

    return {
        Bottom: true,
        BottomColor: White,
        BottomLeft: Corner,
        BottomRight: Corner,
        CellHeight: 20,
        CellWidth: 10,
        Height: 60,
        Left: true,
        LeftColor: White,
        OuterBackgroundColor,
        Right: true,
        RightColor: White,
        Top: true,
        TopColor: White,
        TopLeft: Corner,
        TopRight: Corner,
        Width: 50
    };
}

function Alpha(Pixels: Buffer, Width: number, X: number, Y: number): number
{
    return Pixels[(Y * Width + X) * 4 + 3] ?? 0;
}

describe("Box", () =>
{
    it("passes ordinary border styles through to Ink", () =>
    {
        const Frame: string = render(
            <Box borderStyle="single"
                width={ 3 }>
                <Ink.Text>X</Ink.Text>
            </Box>
        ).lastFrame() ?? "";

        expect(Frame).toContain("┌─┐");
        expect(Frame).toContain("│X│");
        expect(Frame).toContain("└─┘");
    });

    it("retains border-cell layout when compact rendering is unavailable", () =>
    {
        const Frame: string = render(
            <Box borderRadius="1em"
                borderStyle="compact"
                cornerShape="round">
                <Ink.Text>X</Ink.Text>
            </Box>
        ).lastFrame() ?? "";

        expect(Frame).toContain("X");
        expect(Frame).not.toMatch(/[┌─┐│└┘]/u);
        expect(Frame.split("\n")).toHaveLength(3);
    });

    it("routes DOM-style mouse handlers through MouseProvider", () =>
    {
        const Events: Array<string> = [];
        const App = render(
            <MouseProvider>
                <Box height={ 2 }
                    onClick={ (Event) => Events.push(
                        `click:${ Event.LocalPosition.X },${ Event.LocalPosition.Y }`
                    ) }
                    onMouseDown={ () => Events.push("down") }
                    onMouseEnter={ () => Events.push("enter") }
                    onMouseLeave={ () => Events.push("leave") }
                    onMouseUp={ () => Events.push("up") }
                    width={ 4 }>
                    <Ink.Text>X</Ink.Text>
                </Box>
            </MouseProvider>
        );

        App.stdin.write(
            "\x1b[<0;2;1M\x1b[<0;2;1m\x1b[<35;6;1M"
            + "\x1b[<0;6;1M\x1b[<0;2;1m"
        );

        expect(Events).toEqual([
            "enter", "down", "up", "click:1,0", "leave", "enter", "up"
        ]);
    });

    it("recognizes double clicks and right-button context clicks", () =>
    {
        const Events: Array<string> = [];
        const App = render(
            <MouseProvider>
                <Box height={ 1 }
                    onAuxClick={ () => Events.push("aux") }
                    onClick={ () => Events.push("click") }
                    onContextMenu={ () => Events.push("context") }
                    onDoubleClick={ () => Events.push("double") }
                    width={ 2 } />
            </MouseProvider>
        );

        App.stdin.write(
            "\x1b[<0;1;1M\x1b[<0;1;1m"
            + "\x1b[<0;1;1M\x1b[<0;1;1m"
            + "\x1b[<2;1;1M\x1b[<2;1;1m"
        );

        expect(Events).toEqual([ "click", "click", "double", "aux", "context" ]);
    });

    it("clips hit-test bounds to hidden-overflow ancestors", () =>
    {
        let Target: Ink.DOMElement | null = null;
        render(
            <Ink.Box height={ 1 }
                overflowX="hidden"
                width={ 3 }>
                <Box flexShrink={ 0 }
                    height={ 1 }
                    ref={ (Value) => {Target = Value;} }
                    width={ 5 } />
            </Ink.Box>
        );

        expect(Target).not.toBeNull();
        const Bounds = GetBoxMouseBounds(Target as unknown as Ink.DOMElement);
        expect(Bounds).toMatchObject({ Left: 1, Right: 4 });
    });

    it("does not install resize painters for ordinary text-layout boxes", () =>
    {
        const App = render(<></>);
        const InitialListeners: number = App.stdout.listenerCount("resize");

        App.rerender(
            <>
                { Array.from({ length: 20 }, (_, Index: number) => (
                    <Box key={ Index }>
                        <Ink.Text>{ Index }</Ink.Text>
                    </Box>
                )) }
            </>
        );

        expect(App.stdout.listenerCount("resize")).toBe(InitialListeners);
    });
});

describe("compact border CSS lengths", () =>
{
    it("resolves pixel, font-relative, percentage, viewport, and physical units", () =>
    {
        expect(ParseCssLength("20px", Context)).toBe(20);
        expect(ParseCssLength("2em", Context)).toBe(40);
        expect(ParseCssLength("3ch", Context)).toBe(30);
        expect(ParseCssLength("50%", Context)).toBe(40);
        expect(ParseCssLength("10vw", Context)).toBe(10);
        expect(ParseCssLength("1in", Context)).toBe(96);
    });

    it("rejects unsupported or malformed quantities", () =>
    {
        expect(ParseCssLength("calc(1em + 2px)", Context)).toBeUndefined();
        expect(ParseCssLength("ten pixels", Context)).toBeUndefined();
        expect(ParseCssLength(Number.NaN, Context)).toBeUndefined();
    });
});

describe("compact CSS corner shapes", () =>
{
    it("maps every predefined shape to its CSS superellipse parameter", () =>
    {
        expect(ParseCornerShape("square")).toBe(Number.POSITIVE_INFINITY);
        expect(ParseCornerShape("squircle")).toBe(2);
        expect(ParseCornerShape("round")).toBe(1);
        expect(ParseCornerShape("bevel")).toBe(0);
        expect(ParseCornerShape("scoop")).toBe(-1);
        expect(ParseCornerShape("notch")).toBe(Number.NEGATIVE_INFINITY);
    });

    it("parses finite and infinite superellipse functions", () =>
    {
        expect(ParseCornerShape("superellipse( 1.5 )")).toBe(1.5);
        expect(ParseCornerShape("superellipse(-2e1)")).toBe(-20);
        expect(ParseCornerShape("superellipse(infinity)"))
            .toBe(Number.POSITIVE_INFINITY);
        expect(ParseCornerShape("superellipse(nope)")).toBeUndefined();
    });
});

describe("compact border rasterization", () =>
{
    it("draws straight sides at the inside edges of their border cells", () =>
    {
        const Pixels: Buffer = RenderCompactBorder(Options("square"));

        expect(Alpha(Pixels, 50, 25, 19)).toBe(255);
        expect(Alpha(Pixels, 50, 25, 40)).toBe(255);
        expect(Alpha(Pixels, 50, 9, 30)).toBe(255);
        expect(Alpha(Pixels, 50, 40, 30)).toBe(255);
        expect(Alpha(Pixels, 50, 25, 18)).toBe(0);
    });

    it("cuts chamfered corners at 45 degrees", () =>
    {
        const Pixels: Buffer = RenderCompactBorder(Options("bevel", "4px"));

        expect(Alpha(Pixels, 50, 9, 19)).toBe(0);
        expect(Alpha(Pixels, 50, 9, 23)).toBe(255);
        expect(Alpha(Pixels, 50, 11, 21)).toBe(255);
        expect(Alpha(Pixels, 50, 13, 19)).toBe(255);
    });

    it("rounds corners while keeping side endpoints joined", () =>
    {
        const Pixels: Buffer = RenderCompactBorder(Options("round", 4));

        expect(Alpha(Pixels, 50, 9, 19)).toBe(0);
        expect(Alpha(Pixels, 50, 9, 23)).toBe(255);
        expect(Alpha(Pixels, 50, 13, 19)).toBe(255);
    });

    it("applies radius and shape overrides per corner", () =>
    {
        const Value: CompactBorderOptions = Options("square");
        const Pixels: Buffer = RenderCompactBorder({
            ...Value,
            TopLeft: { Radius: 8, Shape: "round" }
        });

        expect(Alpha(Pixels, 50, 9, 19)).toBe(0);
        expect(Alpha(Pixels, 50, 40, 19)).toBe(255);
    });

    it("restores the inherited background outside a shaped border", () =>
    {
        const Background = [ 12, 34, 56, 255 ] as const;
        const Pixels: Buffer = RenderCompactBorder(Options("round", 8, Background));
        const Offset: number = (20 * 50 + 10) * 4;

        expect([ ...Pixels.subarray(Offset, Offset + 4) ]).toEqual(Background);
        expect(Alpha(Pixels, 50, 20, 25)).toBe(0);
    });
});
