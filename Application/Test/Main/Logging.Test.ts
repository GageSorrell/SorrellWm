/**
 * SorrellWm logging configuration and global telemetry tests.
 *
 * @module @sorrell/wm/Test/Logging
 *
 * @file      Logging.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "../../Source/Main/Logging.ts";
import * as SorrellLogging from "@sorrell/log/Effect";
import * as TilingTree from "../../Source/Main/Tiling/Tree.ts";
import { describe, expect, it } from "vitest";
import { Box } from "@sorrell/math";
import { Effect } from "effect";
import type { Handle } from "@sorrell/windows";
import { InMemorySink } from "@sorrell/log/Testing";

const Bounds = Box.Box(0, 1_920, 1_080, 0);
const ManagedWindow = (Value: number): TilingTree.WindowNode =>
    TilingTree.Window({
        InitialBounds: Bounds,
        Window: BigInt(Value) as Handle.HWND
    });

describe("Logging", () =>
{
    it("emits categorized structured application events", async () =>
    {
        const Sink = InMemorySink.Make();
        const LoggingLayer = SorrellLogging.Layer({
            DefaultCategory: "Application",
            MinimumLevel: "Debug",
            Sinks: [ Sink ]
        });

        await Effect.runPromise(Logging.LogWarning(
            "Overlay.Preview",
            "Preview operation failed.",
            new Error("test failure"),
            {
                Operation: "Ensure",
                Window: "FocusPreviewLeft"
            }
        ).pipe(Effect.provide(LoggingLayer)));

        expect(Sink.Records).toHaveLength(1);
        expect(Sink.Records[0]).toMatchObject({
            Annotations: {
                Operation: "Ensure",
                Window: "FocusPreviewLeft"
            },
            Category: "Application.Overlay.Preview",
            Level: "Warn",
            Message: [
                "Preview operation failed.",
                expect.objectContaining({ _tag: "Error" })
            ]
        });
    });

    it("resolves the default and configured log-client ports", () =>
    {
        expect(Logging.ResolveLogClientPort({ })).toBe(Logging.DefaultLogClientPort);
        expect(Logging.ResolveLogClientPort({
            [Logging.LogClientPortEnvironmentVariable]: "54321"
        })).toBe(54_321);
        expect(() => Logging.ResolveLogClientPort({
            [Logging.LogClientPortEnvironmentVariable]: "not-a-port"
        })).toThrow(RangeError);
    });

    it("counts managed windows across workspaces", () =>
    {
        const State: TilingTree.State = {
            Workspaces: [
                {
                    Bounds,
                    Id: "primary",
                    Root: TilingTree.Panel(
                        TilingTree.Orientation.Horizontal,
                        ManagedWindow(1),
                        ManagedWindow(2)
                    )
                },
                {
                    Bounds,
                    Id: "secondary",
                    Root: ManagedWindow(3)
                }
            ]
        };

        expect(Logging.CountManagedWindows(State)).toBe(3);
    });

    it("emits current tiling counts as global log records", async () =>
    {
        const Sink = InMemorySink.Make();
        const Runtime = SorrellLogging.Make({
            Now: () => new Date("2026-07-24T12:00:00.000Z"),
            Sinks: [ Sink ]
        });
        const State: TilingTree.State = {
            Workspaces: [
                {
                    Bounds,
                    Id: "primary",
                    Root: ManagedWindow(1)
                }
            ]
        };

        await Effect.runPromise(
            Logging.LogTilingState(State).pipe(
                Effect.provideService(SorrellLogging.LogRuntime, Runtime)
            )
        );
        await Effect.runPromise(Runtime.Flush);
        await Effect.runPromise(Runtime.Shutdown);

        expect(Sink.Records.map((Record: (typeof Sink.Records)[number]) => ({
            Key: Record.Global?.Definition.Key,
            Value: Record.Global?.Value
        }))).toEqual([
            {
                Key: Logging.ManagedWindowCount.Key,
                Value: 1
            },
            {
                Key: Logging.WorkspaceCount.Key,
                Value: 1
            }
        ]);
    });
});
