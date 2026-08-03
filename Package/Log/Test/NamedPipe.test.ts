/**
 * Named-pipe sink tests.
 *
 * @module @sorrell/log/Test/NamedPipe.test
 *
 * @file      NamedPipe.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    createConnection,
    type Socket
} from "node:net";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { Deserialize, type WireMessage } from "../Source/Forward/Protocol.js";
import * as NamedPipe from "../Source/Node/NamedPipe.js";
import { Make } from "../Source/Node/NamedPipeSink.js";
import { RecordFixture } from "./Fixture.js";

function TestPort(): number
{
    return 40_000 + ((process.pid + Math.floor(Math.random() * 10_000)) % 20_000);
}

function Reader(
    PipePath: string,
    Count: number
): {
    readonly Connected: Promise<void>;
    readonly Messages: Promise<ReadonlyArray<WireMessage>>;
    readonly Socket: Socket;
}
{
    const SocketValue = createConnection(PipePath);
    SocketValue.setEncoding("utf8");
    let BufferValue = "";
    const Values: Array<WireMessage> = [];
    const Connected = new Promise<void>((Resolve, Reject) =>
    {
        SocketValue.once("connect", Resolve);
        SocketValue.once("error", Reject);
    });
    const Messages = new Promise<ReadonlyArray<WireMessage>>((Resolve, Reject) =>
    {
        SocketValue.on("data", (Chunk: string) =>
        {
            BufferValue += Chunk;
            const Lines = BufferValue.split("\n");
            BufferValue = Lines.pop() ?? "";

            for (const Line of Lines)
            {
                const Message = Deserialize(Line);
                if (Message === undefined)
                {
                    Reject(new Error("The sink emitted an invalid wire message."));
                    return;
                }
                Values.push(Message);
            }

            if (Values.length >= Count)
            {
                Resolve(Values);
            }
        });
        SocketValue.on("error", Reject);
    });

    return {
        Connected,
        Messages,
        Socket: SocketValue
    };
}


async function Within<Value>(
    PromiseValue: Promise<Value>,
    Label: string
): Promise<Value>
{
    let Timer: ReturnType<typeof setTimeout> | undefined;

    try
    {
        return await Promise.race([
            PromiseValue,
            new Promise<never>((_Resolve, Reject) =>
            {
                Timer = setTimeout(
                    () => Reject(new Error(`Timed out while ${ Label }.`)),
                    1_000
                );
            })
        ]);
    }
    finally
    {
        if (Timer !== undefined)
        {
            clearTimeout(Timer);
        }
    }
}

describe("Windows named-pipe logging", () =>
{
    it("creates and parses the versioned pipe naming scheme", () =>
    {
        expect(NamedPipe.Name(4_321)).toBe("sorrell-log-v1-4321");
        expect(NamedPipe.Path(4_321)).toBe("\\\\.\\pipe\\sorrell-log-v1-4321");
        expect(NamedPipe.ParseName("sorrell-log-v1-4321")).toBe(4_321);
        expect(NamedPipe.ParseName("another-pipe")).toBeUndefined();
        expect(() => NamedPipe.Port(0)).toThrow(RangeError);
    });

    it.runIf(process.platform === "win32")(
        "streams a handshake, records, and shutdown over a named pipe",
        async () =>
        {
            const Port = TestPort();
            const Sink = Make({
                Application: {
                    Name: "Pipe test",
                    Version: "1.0.0"
                },
                Port
            });
            await Effect.runPromise(Sink.Ready);
            const Stream = Reader(Sink.PipePath, 2);

            try
            {
                await Within(Stream.Connected, "connecting to the named pipe");
                await Within(
                    Effect.runPromise(Sink.Write(RecordFixture())),
                    "writing a log record"
                );
                const Messages = await Within(
                    Stream.Messages,
                    "reading named-pipe messages"
                );
                const Shutdown = Effect.runPromise(Sink.Shutdown);
                await Within(Shutdown, "shutting down the named-pipe sink");

                expect(Messages.map((Message) => Message.Type))
                    .toEqual([ "Hello", "Log", "GlobalSnapshot", "Goodbye" ]);
                expect(Messages[1]).toMatchObject({
                    Record: {
                        Category: "Application.Test",
                        Message: [ "message" ]
                    },
                    Type: "Log"
                });
            }
            finally
            {
                Stream.Socket.destroy();
                await Effect.runPromise(Sink.Shutdown).catch(() => undefined);
            }
        }
    );

    it.runIf(process.platform === "win32")(
        "replays current global values until the configured retention expires",
        async () =>
        {
            let Now = 1_000;
            const Sink = Make({
                Application: { Name: "Global retention test" },
                GlobalRetention: "1 second",
                Now: () => Now,
                Port: TestPort()
            });
            const Record = RecordFixture({
                Global: {
                    Definition: {
                        Key: "counter",
                        Level: "Info",
                        MaximumValue: 10,
                        MinimumValue: 0,
                        Name: "Counter",
                        Type: "Integer"
                    },
                    UpdatedAt: "2026-07-24T05:00:00.000Z",
                    Value: 4
                }
            });

            try
            {
                await Effect.runPromise(Sink.Ready);
                await Effect.runPromise(Sink.Write(Record));

                const Current = Reader(Sink.PipePath, 3);
                await Within(Current.Connected, "connecting for a global snapshot");
                const CurrentMessages = await Within(
                    Current.Messages,
                    "reading the current global snapshot"
                );
                expect(CurrentMessages[2]).toMatchObject({
                    Type: "GlobalSnapshot",
                    Values: [ {
                        Definition: { Key: "counter" },
                        Value: 4
                    } ]
                });
                Current.Socket.destroy();

                Now = 2_001;
                const Expired = Reader(Sink.PipePath, 3);
                await Within(Expired.Connected, "reconnecting after global expiry");
                const ExpiredMessages = await Within(
                    Expired.Messages,
                    "reading the expired global snapshot"
                );
                expect(ExpiredMessages[2]).toEqual({
                    Type: "GlobalSnapshot",
                    Values: []
                });
                Expired.Socket.destroy();
            }
            finally
            {
                await Effect.runPromise(Sink.Shutdown).catch(() => undefined);
            }
        }
    );
});
