/**
 * Effect-based discovery and streaming for local `@sorrell/log` pipes.
 *
 * @module @sorrell/log-client/Client
 *
 * @file      Client.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { readdir } from "node:fs/promises";
import {
    createConnection,
    type Socket
} from "node:net";
import {
    Cause,
    Data,
    Effect,
    pipe,
    Queue,
    Stream
} from "effect";
import {
    Deserialize,
    type WireMessage
} from "@sorrell/log/Forward";
import * as NamedPipe from "@sorrell/log/Node/NamedPipe";

/** Operation that can fail while discovering or consuming a log pipe. */
export type LogClientOperation =
    | "Discover"
    | "Connect"
    | "Read"
    | "Protocol";

/** Typed failure produced by the local log client. */
export class LogClientError extends Data.TaggedError("LogClientError")<{
    readonly Cause: unknown;
    readonly Message: string;
    readonly Operation: LogClientOperation;
}> { }

/** Options controlling a named-pipe message stream. */
export interface MessageStreamOptions
{
    readonly Port?: number;
    readonly BufferCapacity?: number;
    readonly MaximumLineBytes?: number;
}

const DefaultBufferCapacity = 4_096;
const DefaultMaximumLineBytes = 1_048_576;

/**
 *
 */
function ErrorFor(
    Operation: LogClientOperation,
    Message: string,
    CauseValue?: unknown
): LogClientError
{
    return new LogClientError({
        Cause: CauseValue,
        Message,
        Operation
    });
}

/**
 *
 */
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
 * Discover all active `@sorrell/log` named-pipe ports for the current Windows session.
 *
 * The returned ports are sorted numerically so automatic selection is
 * deterministic.
 *
 * @category Client
 * @since 1.0.0
 */
export function DiscoverPipePorts(): Effect.Effect<
    ReadonlyArray<number>,
    LogClientError
>
{
    if (process.platform !== "win32")
    {
        return Effect.fail(ErrorFor(
            "Discover",
            "Named-pipe log discovery is currently supported only on Windows."
        ));
    }

    return Effect.tryPromise({
        catch: (CauseValue: unknown) => ErrorFor(
            "Discover",
            "Could not enumerate the Windows named-pipe directory.",
            CauseValue
        ),
        try: async () =>
        {
            const Names = await readdir(NamedPipe.Directory);
            return Names
                .map(NamedPipe.ParseName)
                .filter((Port): Port is number => Port !== undefined)
                .sort((Left: number, Right: number) => Left - Right);
        }
    });
}

/**
 * Resolve an explicit port or select the first discoverable log pipe.
 *
 * @category Client
 * @since 1.0.0
 */
export function ResolvePipePort(
    PortValue?: number
): Effect.Effect<number, LogClientError>
{
    if (PortValue !== undefined)
    {
        return Effect.try({
            catch: (CauseValue: unknown) => ErrorFor(
                "Connect",
                "The requested log port is invalid.",
                CauseValue
            ),
            try: () => NamedPipe.Port(PortValue)
        });
    }

    return pipe(DiscoverPipePorts(), Effect.flatMap((Ports: ReadonlyArray<number>) =>
        {
            const First = Ports[0];
            return First === undefined
                ? Effect.fail(ErrorFor(
                    "Discover",
                    `No named pipes matching ${ NamedPipe.NamePrefix }<port> are active.`
                ))
                : Effect.succeed(First);
        }));
}

/**
 *
 */
function ConnectedStream(
    PortValue: number,
    Options: MessageStreamOptions
): Stream.Stream<WireMessage, LogClientError>
{
    let BufferCapacity: number;
    let MaximumLineBytes: number;
    let PipePath: string;

    try
    {
        BufferCapacity = PositiveInteger(
            Options.BufferCapacity,
            DefaultBufferCapacity,
            "BufferCapacity"
        );
        MaximumLineBytes = PositiveInteger(
            Options.MaximumLineBytes,
            DefaultMaximumLineBytes,
            "MaximumLineBytes"
        );
        PipePath = NamedPipe.Path(PortValue);
    }
    catch (CauseValue)
    {
        return Stream.fail(ErrorFor(
            "Connect",
            "The named-pipe stream options are invalid.",
            CauseValue
        ));
    }

    return Stream.callback<WireMessage, LogClientError>((QueueValue) =>
    {
        const Acquire = Effect.tryPromise({
            catch: (CauseValue: unknown) => ErrorFor(
                "Connect",
                `Could not connect to ${ PipePath }.`,
                CauseValue
            ),
            try: () => new Promise<Socket>((Resolve, Reject) =>
            {
                const SocketValue = createConnection(PipePath);
                const OnError = (CauseValue: Error): void =>
                {
                    Reject(CauseValue);
                };
                const OnConnect = (): void =>
                {
                    SocketValue.off("error", OnError);
                    Resolve(SocketValue);
                };
                SocketValue.once("error", OnError);
                SocketValue.once("connect", OnConnect);
            })
        });

        return Effect.acquireRelease(
            pipe(Acquire, Effect.tap((SocketValue: Socket) => Effect.sync(() =>
                {
                    let BufferValue = "";
                    let Ended = false;
                    let SawHello = false;

                    const Fail = (ErrorValue: LogClientError): void =>
                    {
                        if (Ended)
                        {
                            return;
                        }
                        Ended = true;
                        Queue.failCauseUnsafe(QueueValue, Cause.fail(ErrorValue));
                        SocketValue.destroy();
                    };

                    const Offer = (Message: WireMessage): void =>
                    {
                        if (!SawHello)
                        {
                            if (Message.Type !== "Hello")
                            {
                                Fail(ErrorFor(
                                    "Protocol",
                                    "The first named-pipe message was not a Hello handshake."
                                ));
                                return;
                            }
                            SawHello = true;
                        }
                        else if (Message.Type === "Hello")
                        {
                            Fail(ErrorFor(
                                "Protocol",
                                "The named pipe sent more than one Hello handshake."
                            ));
                            return;
                        }

                        Queue.offerUnsafe(QueueValue, Message);

                        if (Message.Type === "Goodbye")
                        {
                            Ended = true;
                            Queue.endUnsafe(QueueValue);
                        }
                    };

                    SocketValue.setEncoding("utf8");
                    SocketValue.on("data", (Chunk: string | Buffer) =>
                    {
                        if (Ended)
                        {
                            return;
                        }

                        BufferValue += String(Chunk);
                        const Lines = BufferValue.split("\n");
                        BufferValue = Lines.pop() ?? "";

                        for (const Line of Lines)
                        {
                            if (Line.trim().length === 0)
                            {
                                continue;
                            }

                            if (Buffer.byteLength(Line) > MaximumLineBytes)
                            {
                                Fail(ErrorFor(
                                    "Protocol",
                                    "A named-pipe message exceeded MaximumLineBytes."
                                ));
                                return;
                            }

                            const Message = Deserialize(Line);
                            if (Message === undefined)
                            {
                                Fail(ErrorFor(
                                    "Protocol",
                                    "The named pipe emitted an invalid protocol message."
                                ));
                                return;
                            }
                            Offer(Message);
                        }

                        if (Buffer.byteLength(BufferValue) > MaximumLineBytes)
                        {
                            Fail(ErrorFor(
                                "Protocol",
                                "An incomplete named-pipe message exceeded MaximumLineBytes."
                            ));
                        }
                    });
                    SocketValue.on("error", (CauseValue: Error) =>
                    {
                        Fail(ErrorFor(
                            "Read",
                            `The connection to ${ PipePath } failed.`,
                            CauseValue
                        ));
                    });
                    SocketValue.on("close", () =>
                    {
                        if (!Ended)
                        {
                            Ended = true;
                            Queue.endUnsafe(QueueValue);
                        }
                    });
                }))),
            (SocketValue: Socket) => Effect.sync(() =>
            {
                SocketValue.removeAllListeners();
                SocketValue.destroy();
            })
        );
    }, {
        bufferSize: BufferCapacity,
        strategy: "sliding"
    });
}

/**
 * Connect to one explicit `@sorrell/log` Windows named-pipe port.
 *
 * The returned Effect stream validates the handshake and every versioned NDJSON
 * message. Interrupting its consumer closes the underlying socket.
 *
 * @category Client
 * @since 1.0.0
 */
export function ConnectToPipe(
    PortValue: number,
    Options: Omit<MessageStreamOptions, "Port"> = { }
): Stream.Stream<WireMessage, LogClientError>
{
    return ConnectedStream(PortValue, Options);
}

/**
 * Discover or select a port, connect, and stream validated wire messages.
 *
 * @category Client
 * @since 1.0.0
 */
export function Messages(
    Options: MessageStreamOptions = { }
): Stream.Stream<WireMessage, LogClientError>
{
    return Stream.unwrap(
        pipe(ResolvePipePort(Options.Port), Effect.map((PortValue: number) => ConnectedStream(PortValue, Options)))
    );
}
