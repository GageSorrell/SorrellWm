/**
 * Tests runtime behavior for `@sorrell/log`.
 *
 * @module @sorrell/log/Test/Runtime.test
 *
 * @file      Runtime.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";
import * as Category from "../Source/Category.js";
import { Make as MakeRuntime } from "../Source/Effect/LogRuntime.js";
import { MakeLogger } from "../Source/Logger.js";
import { type LogSink, LogSinkError } from "../Source/Sink.js";
import { Make as MakeMemorySink } from "../Source/Testing/InMemorySink.js";

describe("LogRuntime and direct logger", () =>
{
    it("normalizes all direct levels and composes category and annotations", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({
            MinimumLevel: "Trace",
            Now: () => new Date("2026-07-23T00:00:00.000Z"),
            Sinks: [ Sink ]
        });
        const Logger = MakeLogger(Runtime, Category.Make("Application.Direct"), {
            Annotations: { Request: 1 }
        }).WithAnnotations({ Child: true }).Child("Window");

        Logger.Trace("trace");
        Logger.Debug("debug");
        Logger.Info("info");
        Logger.Warn("warn");
        Logger.Error("error");
        Logger.Fatal("fatal");
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records.map((Record) => Record.Level)).toEqual([
            "Trace", "Debug", "Info", "Warn", "Error", "Fatal"
        ]);
        expect(Sink.Records[0]).toMatchObject({
            Annotations: {
                Child: true,
                Request: 1
            },
            Category: "Application.Direct.Window",
            Sequence: 1,
            Source: "JavaScript",
            Timestamp: "2026-07-23T00:00:00.000Z"
        });
    });

    it("bounds overflow, reports drops, and tolerates calls after shutdown", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({
            MinimumLevel: "Trace",
            Queue: {
                Capacity: 2,
                OverflowStrategy: "DropNewest"
            },
            Sinks: [ Sink ]
        });
        const Logger = MakeLogger(Runtime);

        for (let Index = 0; Index < 10; Index += 1)
        {
            Logger.Info("record", Index);
        }

        await Effect.runPromise(Runtime.Flush);
        expect(Sink.Records.some((Record) =>
            JSON.stringify(Record.Message).includes("Dropped 8 log records"))).toBe(true);
        expect(Sink.Records.map((Record) => Record.Sequence)).toEqual([ 1, 2, 3 ]);

        await Effect.runPromise(Runtime.Shutdown);
        expect(() => Logger.Info("after shutdown")).not.toThrow();
        await Effect.runPromise(Runtime.Flush);
        expect(Sink.Records).toHaveLength(3);
    });

    it("isolates a failing sink and still delivers to healthy sinks", async () =>
    {
        const ConsoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const Healthy = MakeMemorySink();
        const Failing: LogSink = {
            Flush: Effect.void,
            Name: "FailingSink",
            Shutdown: Effect.void,
            Write: () => Effect.fail(new LogSinkError({
                Cause: new Error("failure"),
                Operation: "Write",
                Sink: "FailingSink"
            }))
        };
        const Runtime = MakeRuntime({
            Sinks: [ Failing, Healthy ]
        });

        MakeLogger(Runtime).Info("healthy");
        await Effect.runPromise(Runtime.Flush);

        expect(Healthy.Records).toHaveLength(1);
        expect(ConsoleError).toHaveBeenCalledTimes(1);
        ConsoleError.mockRestore();
    });

    it("redacts configured annotation keys before persistence", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({ Sinks: [ Sink ] });
        MakeLogger(Runtime).WithAnnotations({
            Authorization: "Bearer secret",
            Safe: "visible"
        }).Info("request");

        await Effect.runPromise(Runtime.Flush);
        expect(Sink.Records[0]?.Annotations).toMatchObject({
            Authorization: { _tag: "Redacted", Label: "Authorization" },
            Safe: "visible"
        });
        expect(JSON.stringify(Sink.Records[0])).not.toContain("Bearer secret");
    });

    it("filters before invoking expensive normalization and honors sink filters", async () =>
    {
        let ProtocolInvocations = 0;
        const Sink = MakeMemorySink();
        const FilteredSink: LogSink = {
            ...Sink,
            Accepts: (Record) => Record.Level === "Error"
        };
        const Runtime = MakeRuntime({
            MinimumLevel: "Info",
            Sinks: [ FilteredSink ]
        });
        const Value = {
            [Symbol.for("@sorrell/log/Loggable")](): string
            {
                ProtocolInvocations += 1;
                return "normalized";
            }
        };
        const Logger = MakeLogger(Runtime);

        Logger.Debug(Value);
        Logger.Info(Value);
        Logger.Error(Value);
        await Effect.runPromise(Runtime.Flush);

        expect(ProtocolInvocations).toBe(2);
        expect(Sink.Records).toHaveLength(1);
        expect(Sink.Records[0]?.Level).toBe("Error");
    });
});
