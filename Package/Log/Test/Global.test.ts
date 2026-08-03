/**
 * Typed global value tests.
 *
 * @module @sorrell/log/Test/Global.test
 *
 * @file      Global.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    DateTime,
    Effect,
    pipe
} from "effect";
import { describe, expect, it } from "vitest";
import {
    LogGlobal,
    MakeGlobal
} from "../Source/Global.js";
import {
    LogRuntime,
    Make as MakeRuntime
} from "../Source/Effect/LogRuntime.js";
import { Pretty } from "../Source/Formatting/PrettyFormatter.js";
import { Format as JsonLines } from "../Source/Formatting/JsonLinesFormatter.js";
import { Make as MakeMemorySink } from "../Source/Testing/InMemorySink.js";

describe("global values", () =>
{
    it("emits typed structured updates through the active runtime", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({
            Now: () => new Date("2026-07-24T05:00:00.000Z"),
            Sinks: [ Sink ]
        });
        const Counter = MakeGlobal("work-items", {
            MaximumValue: 20,
            MinimumValue: 0,
            Name: "Work items",
            Type: "Integer"
        });

        await Effect.runPromise(
            pipe(LogGlobal(Counter, 7), Effect.provideService(LogRuntime, Runtime))
        );
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records[0]).toMatchObject({
            Global: {
                Definition: {
                    Key: "work-items",
                    MaximumValue: 20,
                    MinimumValue: 0,
                    Name: "Work items",
                    Type: "Integer"
                },
                UpdatedAt: "2026-07-24T05:00:00.000Z",
                Value: 7
            },
            Message: [ "Work items =", 7 ]
        });
        expect(Pretty({ ColorMode: "Never" }).Format(Sink.Records[0]!))
            .toContain("Work items = 7");
        expect(JSON.parse(JsonLines(Sink.Records[0]!).trim()).Global.Value)
            .toBe(7);
    });

    it("encodes DateTime values and rejects values outside numeric bounds", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({ Sinks: [ Sink ] });
        const StartedAt = MakeGlobal("started-at", {
            DisplayTimeSince: true,
            Name: "Started",
            Type: "DateTime"
        });
        const Percentage = MakeGlobal("percentage", {
            MaximumValue: 100,
            MinimumValue: 0,
            Type: "Number"
        });

        await Effect.runPromise(
            pipe(LogGlobal(
                StartedAt,
                DateTime.makeUnsafe("2026-07-24T04:59:00.000Z")
            ), Effect.provideService(LogRuntime, Runtime))
        );
        await expect(Effect.runPromise(
            pipe(LogGlobal(Percentage, 101), Effect.provideService(LogRuntime, Runtime))
        )).rejects.toBeDefined();
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records).toHaveLength(1);
        expect(Sink.Records[0]?.Global).toMatchObject({
            Definition: {
                DisplayTimeSince: true,
                Type: "DateTime"
            },
            Value: "2026-07-24T04:59:00.000Z"
        });
    });
});
