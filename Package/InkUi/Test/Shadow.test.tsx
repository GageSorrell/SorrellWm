/**
 * Box shadow tests.
 *
 * @module @sorrell/ink-ui/Test/Shadow
 *
 * @file      Shadow.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { QueueBoxPaint } from "../Source/Box/Paint.js";
import {
    type BoxShadowOptions,
    type RenderedBoxShadow,
    RenderBoxShadow
} from "../Source/Box/Shadow.js";
import {
    type ShadowContextValue,
    ShadowProvider,
    useShadowDefaults
} from "../Source/Shadow/index.js";

const BaseOptions: BoxShadowOptions = {
    BackgroundColor: [ 240, 240, 240, 255 ],
    BoxHeight: 40,
    BoxWidth: 60,
    CellHeight: 20,
    CellWidth: 10,
    Elevation: 3,
    Lofi: false,
    ShadowColor: [ 0, 0, 0, 255 ]
};

describe("Box shadow rasterization", () =>
{
    it("grows with elevation and casts farther below than above", () =>
    {
        const Low: RenderedBoxShadow = RenderBoxShadow({ ...BaseOptions, Elevation: 1 });
        const High: RenderedBoxShadow = RenderBoxShadow({ ...BaseOptions, Elevation: 5 });
        const Bounds = OpaqueBounds(High);
        const TopReach: number = High.Insets.Top - Bounds.Top;
        const BottomReach: number = Bounds.Bottom
            - (High.Insets.Top + BaseOptions.BoxHeight - 1);

        expect(High.Width).toBeGreaterThan(Low.Width);
        expect(High.Height).toBeGreaterThanOrEqual(Low.Height);
        expect(BottomReach).toBeGreaterThan(TopReach);
    });

    it("never paints over the source component", () =>
    {
        const Result: RenderedBoxShadow = RenderBoxShadow(BaseOptions);

        for (let Y: number = Result.Insets.Top;
            Y < Result.Insets.Top + BaseOptions.BoxHeight;
            Y += 1)
        {
            for (let X: number = Result.Insets.Left;
                X < Result.Insets.Left + BaseOptions.BoxWidth;
                X += 1)
            {
                expect(Alpha(Result, X, Y)).toBe(0);
            }
        }
    });

    it("blends the base shadow color with the initial background", () =>
    {
        const Black: RenderedBoxShadow = RenderBoxShadow(BaseOptions);
        const Red: RenderedBoxShadow = RenderBoxShadow({
            ...BaseOptions,
            ShadowColor: [ 255, 0, 0, 255 ]
        });
        const Point = {
            X: Black.Insets.Left + Math.floor(BaseOptions.BoxWidth / 2),
            Y: Black.Insets.Top + BaseOptions.BoxHeight
        };
        const BlackPixel = Pixel(Black, Point.X, Point.Y);
        const RedPixel = Pixel(Red, Point.X, Point.Y);

        expect(BlackPixel[0]).toBeGreaterThan(0);
        expect(BlackPixel[0]).toBeLessThan(BaseOptions.BackgroundColor[0]);
        expect(RedPixel[0]).toBeGreaterThan(RedPixel[1]);
    });

    it("uses stable, splotchy ordered dithering in lofi mode", () =>
    {
        const Smooth: RenderedBoxShadow = RenderBoxShadow(BaseOptions);
        const First: RenderedBoxShadow = RenderBoxShadow({ ...BaseOptions, Lofi: true });
        const Second: RenderedBoxShadow = RenderBoxShadow({ ...BaseOptions, Lofi: true });

        expect(First.Pixels.equals(Second.Pixels)).toBe(true);
        expect(CountOpaque(First)).toBeLessThan(CountOpaque(Smooth));
    });
});

describe("ShadowProvider", () =>
{
    it("merges direct, general, nested, and per-elevation defaults", () =>
    {
        let Captured: ShadowContextValue | undefined;
        const Consumer = (): null =>
        {
            Captured = useShadowDefaults();
            return null;
        };

        render(
            <ShadowProvider defaults={ { elevation: 2, shadowColor: "black", zOrder: 1 } }
                elevationDefaults={ { 3: { shadowColor: "blue" } } }>
                <ShadowProvider elevation={ 3 }
                    lofi
                    zOrder={ 7 }>
                    <Consumer />
                </ShadowProvider>
            </ShadowProvider>
        );

        expect(Captured).toMatchObject({
            Defaults: { elevation: 3, shadowColor: "black", zOrder: 7 },
            ElevationDefaults: { 3: { shadowColor: "blue" } },
            Lofi: true
        });
    });
});

describe("Box Sixel paint ordering", () =>
{
    it("writes lower z-orders first and retains the latest paint per Box", async () =>
    {
        const Write = vi.fn();
        const Stream = { write: Write } as unknown as NodeJS.WriteStream;
        const Low = { };
        const High = { };

        QueueBoxPaint(Stream, High, 5, "high-old");
        QueueBoxPaint(Stream, Low, 1, "low");
        QueueBoxPaint(Stream, High, 5, "high");
        await new Promise((Resolve) => setImmediate(Resolve));

        expect(Write.mock.calls.map((Call) => Call[0])).toEqual([ "low", "high" ]);

        Write.mockClear();
        QueueBoxPaint(Stream, Low, 1, "low-new");
        await new Promise((Resolve) => setImmediate(Resolve));
        expect(Write.mock.calls.map((Call) => Call[0])).toEqual([ "low-new", "high" ]);
    });
});

function Alpha(Result: RenderedBoxShadow, X: number, Y: number): number
{
    return Result.Pixels[(Y * Result.Width + X) * 4 + 3] ?? 0;
}

function CountOpaque(Result: RenderedBoxShadow): number
{
    let Count: number = 0;
    for (let Index: number = 3; Index < Result.Pixels.length; Index += 4)
    {
        if (Result.Pixels[Index] !== 0) {Count += 1;}
    }
    return Count;
}

function OpaqueBounds(Result: RenderedBoxShadow): {
    readonly Bottom: number;
    readonly Left: number;
    readonly Right: number;
    readonly Top: number;
}
{
    let Bottom: number = Number.NEGATIVE_INFINITY;
    let Left: number = Number.POSITIVE_INFINITY;
    let Right: number = Number.NEGATIVE_INFINITY;
    let Top: number = Number.POSITIVE_INFINITY;

    for (let Y: number = 0; Y < Result.Height; Y += 1)
    {
        for (let X: number = 0; X < Result.Width; X += 1)
        {
            if (Alpha(Result, X, Y) === 0) {continue;}
            Bottom = Math.max(Bottom, Y);
            Left = Math.min(Left, X);
            Right = Math.max(Right, X);
            Top = Math.min(Top, Y);
        }
    }
    return { Bottom, Left, Right, Top };
}

function Pixel(
    Result: RenderedBoxShadow,
    X: number,
    Y: number
): readonly [ number, number, number, number ]
{
    const Offset: number = (Y * Result.Width + X) * 4;
    return [
        Result.Pixels[Offset] ?? 0,
        Result.Pixels[Offset + 1] ?? 0,
        Result.Pixels[Offset + 2] ?? 0,
        Result.Pixels[Offset + 3] ?? 0
    ];
}
