/**
 *
 *
 * @module @sorrell/log/Node/FileSink
 *
 * @file      FileSink.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as NodePath from "node:path";
import {
    type FileHandle,
    mkdir,
    open,
    readdir,
    rename,
    rm,
    stat
} from "node:fs/promises";
import { Duration, type Duration as DurationType, Effect } from "effect";
import { Format as FormatJsonLine } from "../Formatting/JsonLinesFormatter.js";
import {
    Pretty as PrettyFormatter,
    type PrettyOptions
} from "../Formatting/PrettyFormatter.js";
import type { LogRecord } from "../LogRecord.js";
import { type LogSink, LogSinkError } from "../Sink.js";

/** File output and size-based rotation configuration. */
export interface FileSinkOptions
{
    readonly Path: string;
    readonly FlushInterval?: DurationType.FilePath;
    readonly MaximumFileSizeBytes?: number;
    readonly MaximumRetainedFiles?: number;
    readonly CreateParentDirectories?: boolean;
    readonly Format?: "JsonLines" | "PrettyText";
    readonly Pretty?: Omit<PrettyOptions, "ColorMode">;
}

/**
 *
 */
function ErrorFor(
    Cause: unknown,
    Operation: "Write" | "Flush" | "Shutdown"
): LogSinkError
{
    return new LogSinkError({
        Cause,
        Operation,
        Sink: "FileSink"
    });
}

/** Construct an asynchronously written NDJSON file sink. */
export function JsonLines(Options: FileSinkOptions): LogSink
{
    const AbsolutePath = NodePath.resolve(Options.Path);
    const Directory = NodePath.dirname(AbsolutePath);
    const BaseName = NodePath.basename(AbsolutePath);
    const MaximumRetainedFiles = Math.max(0, Options.MaximumRetainedFiles ?? 5);
    const Pretty = PrettyFormatter({
        ...Options.Pretty,
        ColorMode: "Never"
    });
    let Handle: FileHandle | undefined;
    let CurrentSize = 0;
    let RotationSequence = 0;
    let Closed = false;
    let Tail: Promise<void> = Promise.resolve();
    let Timer: ReturnType<typeof setInterval> | undefined;

    const Enqueue = (Operation: () => Promise<void>): Promise<void> =>
    {
        const Task = Tail.catch(() => undefined).then(Operation);
        Tail = Task;
        return Task;
    };

    const EnsureOpen = async (): Promise<FileHandle> =>
    {
        if (Closed)
        {
            throw new Error("The file sink has been shut down.");
        }

        if (Handle !== undefined)
        {
            return Handle;
        }

        if (Options.CreateParentDirectories !== false)
        {
            await mkdir(Directory, { recursive: true });
        }

        Handle = await open(AbsolutePath, "a+");
        CurrentSize = (await Handle.stat()).size;
        return Handle;
    };

    const CleanupRotated = async (): Promise<void> =>
    {
        const Entries = await readdir(Directory, { withFileTypes: true });
        const Rotated = await Promise.all(Entries
            .filter((Entry) =>
                Entry.isFile() && Entry.name.startsWith(`${ BaseName }.`))
            .map(async (Entry) =>
            {
                const PathValue = NodePath.join(Directory, Entry.name);
                return {
                    Modified: (await stat(PathValue)).mtimeMs,
                    Path: PathValue
                };
            }));
        Rotated.sort((Left, Right) => Right.Modified - Left.Modified);

        for (const Entry of Rotated.slice(MaximumRetainedFiles))
        {
            await rm(Entry.Path, { force: true });
        }
    };

    const Rotate = async (): Promise<void> =>
    {
        if (Handle !== undefined)
        {
            await Handle.sync();
            await Handle.close();
            Handle = undefined;
        }

        const Timestamp = new Date().toISOString().replaceAll(":", "-");
        let RotatedPath: string;

        do
        {
            RotationSequence += 1;
            RotatedPath = `${ AbsolutePath }.${ Timestamp }.${ RotationSequence }`;
        }
        while (await stat(RotatedPath).then(() => true, () => false));

        await rename(AbsolutePath, RotatedPath);
        CurrentSize = 0;
        await EnsureOpen();
        await CleanupRotated();
    };

    const WriteRecord = async (Record: LogRecord): Promise<void> =>
    {
        const Text = Options.Format === "PrettyText"
            ? Pretty.Format(Record)
            : FormatJsonLine(Record);
        const Size = Buffer.byteLength(Text);
        await EnsureOpen();

        if (Options.MaximumFileSizeBytes !== undefined
            && CurrentSize > 0
            && CurrentSize + Size > Options.MaximumFileSizeBytes)
        {
            await Rotate();
        }

        const ActiveFile = await EnsureOpen();
        await ActiveFile.write(Text);
        CurrentSize += Size;
    };

    if (Options.FlushInterval !== undefined)
    {
        const Milliseconds = Math.max(1, Duration.toMillis(Options.FlushInterval));
        Timer = setInterval(() =>
        {
            void Enqueue(async () =>
            {
                if (Handle !== undefined)
                {
                    await Handle.sync();
                }
            }).catch(() => undefined);
        }, Milliseconds);
        Timer.unref();
    }

    return {
        Flush: Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Flush"),
            try: () => Enqueue(async () =>
            {
                if (Handle !== undefined)
                {
                    await Handle.sync();
                }
            })
        }),
        Name: "FileSink",
        Shutdown: Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Shutdown"),
            try: () => Enqueue(async () =>
            {
                if (Closed)
                {
                    return;
                }

                Closed = true;
                if (Timer !== undefined)
                {
                    clearInterval(Timer);
                    Timer = undefined;
                }

                if (Handle !== undefined)
                {
                    await Handle.sync();
                    await Handle.close();
                    Handle = undefined;
                }
            })
        }),
        Write: (Record: LogRecord) => Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Write"),
            try: () => Enqueue(() => WriteRecord(Record))
        })
    };
}
