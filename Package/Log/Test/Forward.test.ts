/**
 *
 *
 * @module @sorrell/log/Test/Forward.test
 *
 * @file      Forward.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { Make as MakeRuntime } from "../Source/Effect/LogRuntime.js";
import { Make as MakeForwardSink } from "../Source/Forward/ForwardSink.js";
import {
    Deserialize,
    Serialize
} from "../Source/Forward/Protocol.js";
import { Receive } from "../Source/Forward/Receiver.js";
import { ValidateRecord } from "../Source/Forward/Validation.js";
import { Make as MakeMemorySink } from "../Source/Testing/InMemorySink.js";
import { RecordFixture } from "./Fixture.js";

describe("forwarding", () =>
{
    it("round-trips valid wire messages and rejects malformed input", () =>
    {
        const Message = {
            Record: RecordFixture(),
            Type: "Log"
        } as const;

        expect(Deserialize(Serialize(Message))).toEqual(Message);
        expect(Deserialize("{")).toBeUndefined();
        expect(Deserialize(JSON.stringify({
            Application: { Name: "test" },
            ProtocolVersion: 2,
            Type: "Hello"
        }))).toBeUndefined();
    });

    it("batches to the configured maximum and flushes on shutdown", async () =>
    {
        const Batches: Array<Array<number>> = [];
        const Sink = MakeForwardSink({
            MaximumBatchSize: 2,
            Send: (Records) =>
            {
                Batches.push(Records.map((Record) => Record.Sequence));
            }
        });

        await Effect.runPromise(Sink.Write(RecordFixture({ Sequence: 1 })));
        await Effect.runPromise(Sink.Write(RecordFixture({ Sequence: 2 })));
        await Effect.runPromise(Sink.Write(RecordFixture({ Sequence: 3 })));
        await Effect.runPromise(Sink.Shutdown);

        expect(Batches).toEqual([ [ 1, 2 ], [ 3 ] ]);
    });

    it("flushes Fatal records immediately and rejects oversized records", async () =>
    {
        const Batches: Array<Array<string>> = [];
        const Sink = MakeForwardSink({
            MaximumRecordBytes: 10_000,
            Send: (Records) =>
            {
                Batches.push(Records.map((Record) => Record.Level));
            }
        });

        await Effect.runPromise(Sink.Write(RecordFixture({ Level: "Fatal" })));
        expect(Batches).toEqual([ [ "Fatal" ] ]);

        const Tiny = MakeForwardSink({
            MaximumRecordBytes: 10,
            Send: () => undefined
        });
        await expect(Effect.runPromise(Tiny.Write(RecordFixture()))).rejects.toBeDefined();
    });

    it("flushes a partial batch after its timer expires", async () =>
    {
        const Batches: Array<Array<number>> = [];
        const Sink = MakeForwardSink({
            FlushInterval: "5 millis",
            Send: (Records) =>
            {
                Batches.push(Records.map((Record) => Record.Sequence));
            }
        });

        await Effect.runPromise(Sink.Write(RecordFixture({ Sequence: 7 })));
        await Effect.runPromise(Effect.sleep("20 millis"));
        expect(Batches).toEqual([ [ 7 ] ]);
        await Effect.runPromise(Sink.Shutdown);
    });

    it("validates, preserves origin metadata, and replaces authoritative process data", async () =>
    {
        const Original = RecordFixture({
            Process: {
                ProcessIdentifier: 10,
                ProcessType: "ElectronRenderer"
            },
            Source: "React"
        });
        expect(ValidateRecord(Original)).toEqual(Original);
        expect(ValidateRecord({ ...Original, Level: "All" })).toBeUndefined();
        expect(ValidateRecord({ ...Original, SchemaVersion: 2 })).toBeUndefined();

        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({ Sinks: [ Sink ] });
        expect(Receive(Runtime, Original, {
            ProcessIdentifier: 20,
            ProcessType: "ElectronMain"
        })).toBe(true);
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records[0]).toMatchObject({
            Process: {
                ProcessIdentifier: 20,
                ProcessType: "ElectronMain"
            },
            Source: "Forwarded",
            Annotations: {
                "@sorrell/log/original-source": "React"
            }
        });
    });
});
