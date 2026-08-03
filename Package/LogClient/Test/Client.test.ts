/**
 * Effect named-pipe client tests.
 *
 * @module @sorrell/log-client/Test/Client.test
 *
 * @file      Client.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Effect,
    pipe,
    Stream
} from "effect";
import { describe, expect, it } from "vitest";
import { Make } from "@sorrell/log/Node/NamedPipeSink";
import {
    ConnectToPipe,
    DiscoverPipePorts,
    ResolvePipePort
} from "../Source/Client.js";
import { Record } from "./Fixture.js";

/**
 *
 */
function TestPort(): number
{
    return 20_000 + ((process.pid + Math.floor(Math.random() * 20_000)) % 30_000);
}

describe("Effect log client", () =>
{
    it("validates explicit ports", async () =>
    {
        await expect(Effect.runPromise(ResolvePipePort(0))).rejects.toBeDefined();
        await expect(Effect.runPromise(ResolvePipePort(4_317))).resolves.toBe(4_317);
    });

    it.runIf(process.platform === "win32")(
        "discovers and consumes an application pipe",
        async () =>
        {
            const Port = TestPort();
            const Sink = Make({
                Application: { Name: "Client test" },
                Port
            });

            try
            {
                await Effect.runPromise(Sink.Ready);
                await Effect.runPromise(Sink.Write({
                    ...Record,
                    Global: {
                        Definition: {
                            Key: "active-count",
                            Level: "Info",
                            Name: "Active count",
                            Type: "Integer"
                        },
                        UpdatedAt: "2026-07-24T05:00:00.000Z",
                        Value: 3
                    }
                }));

                const Ports = await Effect.runPromise(DiscoverPipePorts());
                expect(Ports).toContain(Port);
                await expect(Effect.runPromise(ResolvePipePort()))
                    .resolves.toBe(Port);

                const Messages = await Effect.runPromise(
                    pipe(ConnectToPipe(Port), Stream.take(3),
                        Stream.runCollect,
                        Effect.map((Values) => Array.from(Values)))
                );
                expect(Messages.map((Message) => Message.Type))
                    .toEqual([ "Hello", "Log", "GlobalSnapshot" ]);
                expect(Messages[1]).toMatchObject({
                    Record: {
                        Message: [ "streamed message" ]
                    },
                    Type: "Log"
                });
                expect(Messages[2]).toMatchObject({
                    Type: "GlobalSnapshot",
                    Values: [ {
                        Definition: { Key: "active-count" },
                        Value: 3
                    } ]
                });
            }
            finally
            {
                await Effect.runPromise(Sink.Shutdown).catch(() => undefined);
            }
        }
    );
});
