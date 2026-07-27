/**
 * Skeleton component tests.
 *
 * @module @sorrell/ink-ui/Test/Skeleton
 *
 * @file      Skeleton.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Skeleton } from "../Source/Skeleton.js";
import { render } from "ink-testing-library";

const Track = "─";
const ShadingPattern = /[░▒▓]/u;

afterEach(() =>
{
    vi.useRealTimers();
});

describe("Skeleton", () =>
{
    it("animates one full block with symmetric shading and a quiet interval", async () =>
    {
        vi.useFakeTimers();
        vi.setSystemTime(0);
        const App = render(
            <Skeleton
                FramesPerSecond={ 20 }
                Width={ 20 }
            />
        );

        expect(App.lastFrame()).toBe(Track.repeat(20));

        await vi.advanceTimersByTimeAsync(550);
        const ActiveFrame: string = App.lastFrame() ?? "";
        expect([ ...ActiveFrame ].filter((Character: string) => Character === "█"))
            .toHaveLength(1);
        expect(ActiveFrame).toMatch(ShadingPattern);
        expect(ActiveFrame).toHaveLength(20);
        expect(ActiveFrame).not.toContain("\u001BP");

        await vi.advanceTimersByTimeAsync(600);
        expect(App.lastFrame()).toBe(Track.repeat(20));
        App.unmount();
    });

    it("clamps tails and permits multiple pulses only at sufficiently wide sizes", async () =>
    {
        vi.useFakeTimers();
        vi.setSystemTime(0);
        const App = render(
            <Skeleton FramesPerSecond={ 20 }
                Width={ 120 } />
        );

        await vi.advanceTimersByTimeAsync(1_000);
        const SinglePulse: string = App.lastFrame() ?? "";
        const HighlightCells: ReadonlyArray<string> =
            [ ...SinglePulse ].filter((Character: string) => Character !== Track);
        expect(HighlightCells).toHaveLength(13);

        await vi.advanceTimersByTimeAsync(1_000);
        const WideFrame: string = App.lastFrame() ?? "";
        expect([ ...WideFrame ].filter((Character: string) => Character === "█"))
            .toHaveLength(2);
        App.unmount();
    });

    it("fills its parent when Width is omitted", async () =>
    {
        vi.useFakeTimers();
        vi.setSystemTime(0);
        const App = render(
            <Ink.Box width={ 12 }>
                <Skeleton />
            </Ink.Box>
        );
        await vi.advanceTimersByTimeAsync(0);

        expect(App.lastFrame()).toBe(Track.repeat(12));
        App.unmount();
    });
});
