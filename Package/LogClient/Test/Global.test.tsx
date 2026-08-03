/**
 * Global value presentation tests.
 *
 * @module @sorrell/log-client/Test/Global.test
 *
 * @file      Global.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { render } from "ink-testing-library";
import {
    afterEach,
    describe,
    expect,
    it,
    vi
} from "vitest";
import type { GlobalLogValue } from "@sorrell/log/Global";
import {
    FormatGlobalDuration,
    GlobalDateTimeRefreshMilliseconds,
    GlobalGridColumnCount,
    GlobalGridRowCount,
    GlobalValueCard,
    GlobalValueGrid
} from "../Source/Global.js";

function IntegerValue(
    Key: string,
    Value: number
): GlobalLogValue
{
    return {
        Definition: {
            Key,
            Level: "Info",
            MaximumValue: 10,
            MinimumValue: 0,
            Name: `Counter ${ Key }`,
            Type: "Integer"
        },
        UpdatedAt: "2026-07-24T05:00:00.000Z",
        Value
    };
}

afterEach(() =>
{
    vi.useRealTimers();
});

describe("global value components", () =>
{
    it("selects one through four columns and computes wrapped rows", () =>
    {
        expect(GlobalGridColumnCount(20)).toBe(1);
        expect(GlobalGridColumnCount(50)).toBe(2);
        expect(GlobalGridColumnCount(75)).toBe(3);
        expect(GlobalGridColumnCount(100)).toBe(4);
        expect(GlobalGridRowCount(5, 100)).toBe(2);
    });

    it("renders bounded integers above a gradient range bar", () =>
    {
        const View = render(
            <GlobalValueCard
                Value={ IntegerValue("one", 7) }
                Width={ 25 } />
        );

        expect(View.lastFrame()).toContain("Counter one");
        expect(View.lastFrame()).toContain("7 / 10");
        expect(View.lastFrame()).toContain("█");
        expect(View.lastFrame()).toContain("░");
        View.unmount();
    });

    it("centers responsive rows and preserves registration order", () =>
    {
        const Values = Array.from(
            { length: 5 },
            (_Unused: unknown, Index: number) =>
                IntegerValue(String(Index + 1), Index + 1)
        );
        const View = render(
            <GlobalValueGrid
                Values={ Values }
                Width={ 100 } />
        );

        const Frame = View.lastFrame() ?? "";
        expect(Frame.indexOf("Counter 1")).toBeLessThan(Frame.indexOf("Counter 4"));
        expect(Frame.indexOf("Counter 4")).toBeLessThan(Frame.indexOf("Counter 5"));
        View.unmount();
    });

    it("scrolls constrained multi-row global grids", async () =>
    {
        const Values = Array.from(
            { length: 5 },
            (_Unused: unknown, Index: number) =>
                IntegerValue(String(Index + 1), Index + 1)
        );
        const View = render(
            <GlobalValueGrid
                MaximumRows={ 1 }
                Values={ Values }
                Width={ 50 } />
        );

        expect(View.lastFrame()).toContain("Counter 1");
        expect(View.lastFrame()).not.toContain("Counter 3");
        View.stdin.write("\u001B[B");
        await new Promise<void>((Resolve) => setTimeout(Resolve, 20));
        expect(View.lastFrame()).toContain("Counter 3");
        expect(View.lastFrame()).not.toContain("Counter 1");
        View.unmount();
    });

    it("formats DateTime durations and chooses unit-aware refresh rates", () =>
    {
        expect(GlobalDateTimeRefreshMilliseconds(
            "2026-07-24T04:59:59.500Z",
            new Date("2026-07-24T05:00:00.000Z").getTime()
        )).toBe(250);
        expect(GlobalDateTimeRefreshMilliseconds(
            "2026-07-24T04:59:50.000Z",
            new Date("2026-07-24T05:00:00.000Z").getTime()
        )).toBe(1_000);
        expect(GlobalDateTimeRefreshMilliseconds(
            "2026-07-24T04:50:00.000Z",
            new Date("2026-07-24T05:00:00.000Z").getTime()
        )).toBe(60_000);
        expect(FormatGlobalDuration(
            "2026-07-24T04:59:58.500Z",
            new Date("2026-07-24T05:00:00.000Z").getTime()
        )).toBe("1s 500ms");
    });

    it("displays a stringified DateTime with its live elapsed duration", () =>
    {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-24T05:00:00.000Z"));
        const View = render(
            <GlobalValueCard
                Value={ {
                    Definition: {
                        DisplayTimeSince: true,
                        Key: "started",
                        Level: "Info",
                        Name: "Started",
                        Type: "DateTime"
                    },
                    UpdatedAt: "2026-07-24T05:00:00.000Z",
                    Value: "2026-07-24T04:59:00.000Z"
                } }
                Width={ 50 } />
        );

        expect(View.lastFrame()).toContain("2026-07-24T04:59:00.000Z (1m ago)");
        View.unmount();
    });
});
