/**
 * Windows named-pipe sink for local structured log viewers.
 *
 * @module @sorrell/log/Node/NamedPipeSink
 *
 * @file      NamedPipeSink.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    createServer,
    type Server,
    type Socket
} from "node:net";
import {
    Duration,
    type Duration as DurationType,
    Effect
} from "effect";
import {
    Serialize,
    type DroppedMessage,
    type HelloMessage,
    type WireMessage
} from "../Forward/Protocol.js";
import type { GlobalLogValue } from "../Global.js";
import type {
    ApplicationMetadata,
    LogRecord,
    ProcessMetadata
} from "../LogRecord.js";
import {
    type LogSink,
    LogSinkError
} from "../Sink.js";
import * as NamedPipe from "./NamedPipe.js";

/** Configuration for a local Windows named-pipe log sink. */
export interface NamedPipeSinkOptions
{
    readonly Port: number;
    readonly Application: ApplicationMetadata;
    readonly Process?: ProcessMetadata;
    readonly MaximumBufferedRecords?: number;
    readonly MaximumClientBufferBytes?: number;
    readonly GlobalRetention?: DurationType.FilePath;
    readonly Now?: () => number;
}

/** A log sink that owns one discoverable Windows named-pipe endpoint. */
export interface NamedPipeSink extends LogSink
{
    readonly PipePath: string;
    readonly Port: number;
    readonly Ready: Effect.Effect<void, LogSinkError>;
}

interface Client
{
    readonly Socket: Socket;
    Dropped: number;
}

interface ReadyResult
{
    readonly Error?: unknown;
}

interface RetainedGlobal
{
    readonly ExpiresAt: number;
    readonly Value: GlobalLogValue;
}

const DefaultMaximumBufferedRecords = 1_000;
const DefaultMaximumClientBufferBytes = 1_048_576;
const DefaultGlobalRetention = "7 days";

function NonNegativeInteger(
    Value: number | undefined,
    Fallback: number,
    Name: string
): number
{
    const Resolved = Value ?? Fallback;

    if (!Number.isSafeInteger(Resolved) || Resolved < 0)
    {
        throw new RangeError(`${ Name } must be a non-negative safe integer.`);
    }

    return Resolved;
}

function PositiveInteger(
    Value: number | undefined,
    Fallback: number,
    Name: string
): number
{
    const Resolved = Value ?? Fallback;

    if (!Number.isSafeInteger(Resolved) || Resolved <= 0)
    {
        throw new RangeError(`${ Name } must be a positive safe integer.`);
    }

    return Resolved;
}

/**
 * Construct a sink that publishes records over a discoverable Windows named pipe.
 *
 * The server starts immediately. Recent records are retained in a bounded replay
 * buffer so a viewer can connect shortly after application startup without
 * losing the first messages.
 *
 * @category Sink
 * @since 1.0.0
 */
export function Make(Options: NamedPipeSinkOptions): NamedPipeSink
{
    if (process.platform !== "win32")
    {
        throw new Error(
            "The @sorrell/log named-pipe sink is currently supported only on Windows."
        );
    }

    const Port = NamedPipe.Port(Options.Port);
    const PipePath = NamedPipe.Path(Port);
    const MaximumBufferedRecords = NonNegativeInteger(
        Options.MaximumBufferedRecords,
        DefaultMaximumBufferedRecords,
        "MaximumBufferedRecords"
    );
    const MaximumClientBufferBytes = PositiveInteger(
        Options.MaximumClientBufferBytes,
        DefaultMaximumClientBufferBytes,
        "MaximumClientBufferBytes"
    );
    const GlobalRetentionMilliseconds = Duration.toMillis(
        Options.GlobalRetention ?? DefaultGlobalRetention
    );
    if (!Number.isFinite(GlobalRetentionMilliseconds)
        || GlobalRetentionMilliseconds <= 0)
    {
        throw new RangeError("GlobalRetention must be a positive finite duration.");
    }
    const Now = Options.Now ?? Date.now;
    const Clients = new Set<Client>();
    const BufferedRecords: Array<LogRecord> = [];
    const Globals = new Map<string, RetainedGlobal>();
    let BufferedDropped = 0;
    let Closed = false;
    let ReadySettled = false;
    let ResolveReady: (Result: ReadyResult) => void = () => undefined;
    const ReadyPromise = new Promise<ReadyResult>((Resolve) =>
    {
        ResolveReady = Resolve;
    });
    const Server: Server = createServer();

    const ErrorFor = (
        Cause: unknown,
        Operation: "Write" | "Flush" | "Shutdown"
    ): LogSinkError => new LogSinkError({
        Cause,
        Operation,
        Sink: "NamedPipeSink"
    });

    const SetReady = (Result: ReadyResult): void =>
    {
        if (!ReadySettled)
        {
            ReadySettled = true;
            ResolveReady(Result);
        }
    };

    const AwaitReady = async (): Promise<void> =>
    {
        const Result = await ReadyPromise;
        if (Result.Error !== undefined)
        {
            throw Result.Error;
        }
    };

    const Write = (ClientValue: Client, Message: WireMessage): void =>
    {
        const SocketValue = ClientValue.Socket;
        if (SocketValue.destroyed || !SocketValue.writable)
        {
            return;
        }

        if (SocketValue.writableLength >= MaximumClientBufferBytes)
        {
            ClientValue.Dropped += Message.Type === "Log" ? 1 : 0;
            return;
        }

        if (ClientValue.Dropped > 0)
        {
            const Dropped: DroppedMessage = {
                Count: ClientValue.Dropped,
                Type: "Dropped"
            };
            SocketValue.write(Serialize(Dropped));
            ClientValue.Dropped = 0;
        }

        SocketValue.write(Serialize(Message));
    };

    const PurgeGlobals = (): void =>
    {
        const Current = Now();
        for (const [ Key, Retained ] of Globals)
        {
            if (Retained.ExpiresAt <= Current)
            {
                Globals.delete(Key);
            }
        }
    };

    const GlobalSweepTimer = setInterval(
        PurgeGlobals,
        Math.max(1, Math.min(GlobalRetentionMilliseconds, 60_000))
    );
    GlobalSweepTimer.unref();

    const Hello: HelloMessage = {
        Application: Options.Application,
        ...(Options.Process === undefined ? { } : { Process: Options.Process }),
        ProtocolVersion: 1,
        Type: "Hello"
    };

    Server.on("connection", (SocketValue: Socket): void =>
    {
        PurgeGlobals();
        const ClientValue: Client = {
            Dropped: 0,
            Socket: SocketValue
        };
        Clients.add(ClientValue);
        SocketValue.on("error", () =>
        {
            Clients.delete(ClientValue);
        });
        SocketValue.on("close", () =>
        {
            Clients.delete(ClientValue);
        });

        Write(ClientValue, Hello);

        if (BufferedDropped > 0)
        {
            Write(ClientValue, {
                Count: BufferedDropped,
                Type: "Dropped"
            });
        }

        for (const Record of BufferedRecords)
        {
            Write(ClientValue, {
                Record,
                Type: "Log"
            });
        }

        Write(ClientValue, {
            Type: "GlobalSnapshot",
            Values: [ ...Globals.values() ].map(
                (Retained: RetainedGlobal) => Retained.Value
            )
        });
    });

    Server.on("error", (Cause: unknown): void =>
    {
        SetReady({ Error: Cause });
    });
    Server.listen(PipePath, (): void =>
    {
        SetReady({ });
    });
    Server.unref();

    const Ready = Effect.tryPromise({
        catch: (Cause: unknown) => ErrorFor(Cause, "Write"),
        try: AwaitReady
    });

    return {
        Flush: Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Flush"),
            try: async () =>
            {
                await AwaitReady();
            }
        }),
        Name: "NamedPipeSink",
        PipePath,
        Port,
        Ready,
        Shutdown: Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Shutdown"),
            try: async () =>
            {
                if (Closed)
                {
                    return;
                }
                Closed = true;
                clearInterval(GlobalSweepTimer);

                const Result = await ReadyPromise;
                if (Result.Error !== undefined)
                {
                    throw Result.Error;
                }

                for (const ClientValue of Clients)
                {
                    ClientValue.Socket.end(Serialize({ Type: "Goodbye" }));
                    const Timer = setTimeout(() =>
                    {
                        ClientValue.Socket.destroy();
                    }, 250);
                    Timer.unref();
                }

                await new Promise<void>((Resolve, Reject) =>
                {
                    Server.close((Cause?: Error) =>
                    {
                        if (Cause === undefined)
                        {
                            Resolve();
                        }
                        else
                        {
                            Reject(Cause);
                        }
                    });
                });
            }
        }),
        Write: (Record: LogRecord) => Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Write"),
            try: async () =>
            {
                if (Closed)
                {
                    return;
                }

                await AwaitReady();
                PurgeGlobals();

                if (Record.Global !== undefined)
                {
                    Globals.set(Record.Global.Definition.Key, {
                        ExpiresAt: Now() + GlobalRetentionMilliseconds,
                        Value: Record.Global
                    });
                }

                if (MaximumBufferedRecords > 0)
                {
                    if (BufferedRecords.length >= MaximumBufferedRecords)
                    {
                        BufferedRecords.shift();
                        BufferedDropped += 1;
                    }
                    BufferedRecords.push(Record);
                }

                for (const ClientValue of Clients)
                {
                    Write(ClientValue, {
                        Record,
                        Type: "Log"
                    });
                }
            }
        })
    };
}
