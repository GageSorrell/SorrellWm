/**
 * Tests Effect behavior for `@sorrell/log`.
 *
 * @module @sorrell/log/Test/Effect.test
 *
 * @file      Effect.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Cause, Effect, pipe } from "effect";
import { describe, expect, it } from "vitest";
import { Layer, WithCategory } from "../Source/Effect/index.js";
import { Make as MakeMemorySink } from "../Source/Testing/InMemorySink.js";

describe("Effect logger integration", () =>
{
    it("preserves severities, messages, annotations, spans, causes, and fiber data", async () =>
    {
        const Sink = MakeMemorySink();
        const Logging = Layer({
            CategoryMinimumLevels: {
                "Application.Window.Layout": "Trace"
            },
            DefaultCategory: "Application",
            MinimumLevel: "Info",
            Sinks: [ Sink ]
        });

        const Program = pipe(Effect.gen(function*()
        {
            yield* Effect.logTrace("trace", { Count: 1 });
            yield* Effect.logDebug("debug");
            yield* Effect.logInfo("info", 2);
            yield* Effect.logWarning("warn");
            yield* Effect.logError(Cause.fail("boom"), "error");
            yield* Effect.logFatal("fatal");
        }), Effect.annotateLogs({
                RequestIdentifier: "request-1"
            }),
            Effect.withLogSpan("work"),
            WithCategory("Layout"),
            WithCategory("Window"),
            Effect.provide(Logging));

        await Effect.runPromise(Program);

        expect(Sink.Records.map((Record) => Record.Level)).toEqual([
            "Trace", "Debug", "Info", "Warn", "Error", "Fatal"
        ]);
        expect(Sink.Records[0]).toMatchObject({
            Annotations: { RequestIdentifier: "request-1" },
            Category: "Application.Window.Layout",
            Fiber: { Identifier: expect.any(Number) },
            Message: [ "trace", { _tag: "Object", Value: { Count: 1 } } ],
            Source: "Effect",
            Spans: [
                {
                    DurationMilliseconds: expect.any(Number),
                    Label: "work"
                }
            ]
        });
        expect(Sink.Records[4]?.Cause).toBeDefined();
    });

    it("removes the reserved manual category annotation", async () =>
    {
        const Sink = MakeMemorySink();
        await Effect.runPromise(
            pipe(Effect.logInfo("manual"), Effect.annotateLogs("@sorrell/log/category", "Manual"),
                Effect.provide(Layer({
                    DefaultCategory: "Application",
                    Sinks: [ Sink ]
                })))
        );

        expect(Sink.Records[0]?.Category).toBe("Application.Manual");
        expect(Sink.Records[0]?.Annotations).not.toHaveProperty("@sorrell/log/category");
    });
});
