/**
 *
 *
 * @module @sorrell/log/Test/Native.test
 *
 * @file      Native.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { Make as MakeRuntime } from "../Source/Effect/LogRuntime.js";
import { CreateCallback } from "../Source/Native/NativeBridge.js";
import { GetIncludeDirectory } from "../Source/Native/GetIncludeDirectory.js";
import { Validate } from "../Source/Native/NativeValidation.js";
import { Make as MakeMemorySink } from "../Source/Testing/InMemorySink.js";

describe("native JavaScript integration", () =>
{
    interface NativeFixture
    {
        readonly Emit: (
            Callback: (Record: unknown) => void,
            Count: number,
            ThreadCount: number,
            QueueSize: number
        ) => bigint;
    }

    const Require = createRequire(import.meta.url);
    const Fixture = Require(
        "./NativeFixture/build/Release/SorrellLogNativeFixture.node"
    ) as NativeFixture;

    it("validates and publishes native records through the common runtime", async () =>
    {
        const NativeRecord = {
            Category: "Windows.Hotkeys",
            Fields: {
                Modifiers: 3,
                VirtualKey: 65n
            },
            Level: "Info",
            Message: "Registered global hotkey",
            ThreadIdentifier: "worker-1"
        };
        expect(Validate(NativeRecord)).toEqual(NativeRecord);
        expect(Validate({ ...NativeRecord, Level: "All" })).toBeUndefined();

        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({ Sinks: [ Sink ] });
        CreateCallback(Runtime)(NativeRecord);
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records[0]).toMatchObject({
            Category: "Native.Windows.Hotkeys",
            Level: "Info",
            Process: {
                ProcessType: "NativeWorker",
                ThreadIdentifier: "worker-1"
            },
            Source: "Native"
        });
    });

    it("exposes the shipped include directory", () =>
    {
        expect(GetIncludeDirectory().replaceAll("\\", "/"))
            .toMatch(/Package\/Log\/native\/include$/u);
    });

    it("forwards real main-thread and multi-worker-thread C++ records nonblockingly", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({
            MinimumLevel: "Trace",
            Sinks: [ Sink ]
        });
        const Callback = CreateCallback(Runtime);

        expect(Fixture.Emit(Callback, 3, 0, 64)).toBe(0n);
        expect(Fixture.Emit(Callback, 5, 3, 64)).toBe(0n);
        await Effect.runPromise(Effect.sleep("25 millis"));
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records).toHaveLength(18);
        expect(Sink.Records.every((Record) => Record.Source === "Native")).toBe(true);
    });

    it("bounds the native queue and releases safely after worker shutdown", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({ Sinks: [ Sink ] });
        const Dropped = Fixture.Emit(CreateCallback(Runtime), 1_000, 4, 1);

        expect(Dropped).toBeGreaterThan(0n);
        await Effect.runPromise(Effect.sleep("25 millis"));
        await Effect.runPromise(Runtime.Flush);
        await Effect.runPromise(Runtime.Shutdown);
    });
});
