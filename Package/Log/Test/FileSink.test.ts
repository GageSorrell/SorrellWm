/**
 *
 *
 * @module @sorrell/log/Test/FileSink.test
 *
 * @file      FileSink.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    mkdtemp,
    readFile,
    readdir
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { JsonLines } from "../Source/Node/FileSink.js";
import { RecordFixture } from "./Fixture.js";

describe("FileSink", () =>
{
    it("creates directories, preserves order, flushes, and rotates whole JSON records", async () =>
    {
        const Directory = await mkdtemp(join(tmpdir(), "sorrell-log-"));
        const Path = join(Directory, "nested", "application.ndjson");
        const Sink = JsonLines({
            MaximumFileSizeBytes: 320,
            MaximumRetainedFiles: 2,
            Path
        });

        for (let Sequence = 1; Sequence <= 6; Sequence += 1)
        {
            await Effect.runPromise(Sink.Write(RecordFixture({
                Message: [ `record-${ Sequence }-${ "x".repeat(80) }` ],
                Sequence
            })));
        }
        await Effect.runPromise(Sink.Flush);
        await Effect.runPromise(Sink.Shutdown);

        const Files = await readdir(join(Directory, "nested"));
        expect(Files.filter((Name: string) => Name.startsWith("application.ndjson.")))
            .toHaveLength(2);

        const Active = await readFile(Path, "utf8");
        const ActiveLines = Active.trim().split("\n").filter(Boolean).map(
            (Line: string) => JSON.parse(Line) as { Sequence: number; }
        );
        expect(ActiveLines.at(-1)?.Sequence).toBe(6);
    });

    it("returns a typed error when its parent is absent and creation is disabled", async () =>
    {
        const Directory = await mkdtemp(join(tmpdir(), "sorrell-log-"));
        const Sink = JsonLines({
            CreateParentDirectories: false,
            Path: join(Directory, "absent", "application.ndjson")
        });

        await expect(Effect.runPromise(Sink.Write(RecordFixture()))).rejects.toBeDefined();
    });
});
