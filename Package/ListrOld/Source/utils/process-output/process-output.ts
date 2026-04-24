/**
 * @file      process-output.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type ProcessOutputBufferEntry, cleanseAnsi } from "@utils/index.js";
import type { ProcessOutputOptions, ProcessOutputStreamMap } from "./process-output.interface.js";
import { ANSI_ESCAPE_CODES } from "@constants/index.js";
import { EOL } from "os";
import { ProcessOutputStream } from "./process-output-stream.js";

/**
 * Creates a new Listr2 process-output controller.
 *
 * This is used to control the flow to `process.stdout` and `process.stderr` for all renderers.
 *
 * @see {@link https://listr2.kilic.dev/renderer/process-output.html}
 */
export class ProcessOutput
{
    public readonly Stream: ProcessOutputStreamMap;
    protected Active: boolean;

    constructor(
        Stdout?: NodeJS.WriteStream,
        Stderr?: NodeJS.WriteStream,
        private readonly Options?: ProcessOutputOptions
    )
    {
        this.Stream =
            {
                stderr: new ProcessOutputStream(Stderr ?? process.stderr),
                stdout: new ProcessOutputStream(Stdout ?? process.stdout)
            };

        this.Options =
            {
                dump: [ "stdout", "stderr" ],
                leaveEmptyLine: true,
                ...Options
            };
    }

    get stdout(): NodeJS.WriteStream
    {
        return this.Stream.stdout.out;
    }

    get stderr(): NodeJS.WriteStream
    {
        return this.Stream.stderr.out;
    }

    public hijack(): void
    {
        if (this.Active)
        {
            throw new Error("ProcessOutput has been already hijacked!");
        }

        this.Stream.stdout.write(ANSI_ESCAPE_CODES.CURSOR_HIDE);
        Object.values(this.Stream).forEach((stream: ProcessOutputStream) => stream.hijack());
        this.Active = true;
    }

    public release(): void
    {
        // not the most performant of functions, since creating a lots of memory
        // maybe refactor this sometime, but shouldnt be concern since we do not expect
        // huge number of outputs being buffered
        type OutputBase =
            {
                name: string;
                buffer: Array<ProcessOutputBufferEntry>;
            };

        const ToOutput = ([ name, Stream ]: [ string, ProcessOutputStream ]): OutputBase =>
        {
            return {
                buffer: Stream.release(),
                name
            };
        };

        const SortByTime = (A: ProcessOutputBufferEntry, B: ProcessOutputBufferEntry) => A.time - B.time;

        const IncludedByOptions = ({ name }: OutputBase): boolean =>
        {
            return this.Options.dump.includes(name as keyof ProcessOutputStreamMap);
        };

        const ToBuffer = ({ buffer }: OutputBase) => buffer;

        const HasEntry = (Message: ProcessOutputBufferEntry): boolean => Message.entry as unknown as boolean;
        const Outputs: Array<ProcessOutputBufferEntry> = Object.entries(this.Stream)
            .map(ToOutput)
            .filter(IncludedByOptions)
            .flatMap(ToBuffer)
            .sort(SortByTime)
            .map((Message: ProcessOutputBufferEntry): ProcessOutputBufferEntry =>
            {
                return {
                    ...Message,
                    entry: cleanseAnsi(Message.entry)
                };
            })
            .filter(HasEntry);

        if (Outputs.length > 0)
        {
            if (this.Options.leaveEmptyLine)
            {
                this.stdout.write(EOL);
            }

            Outputs.forEach((Message: ProcessOutputBufferEntry) =>
            {
                const Stream: NodeJS.WriteStream = Message.stream ?? this.stdout;

                Stream.write(Message.entry + EOL);
            });
        }

        this.Stream.stdout.write(ANSI_ESCAPE_CODES.CURSOR_SHOW);

        this.Active = false;
    }

    public toStdout(buffer: string, eol: boolean = true): boolean
    {
        if (eol)
        {
            buffer = buffer + EOL;
        }

        return this.Stream.stdout.write(buffer);
    }

    public toStderr(buffer: string, eol: boolean = true): boolean
    {
        if (eol)
        {
            buffer = buffer + EOL;
        }

        return this.Stream.stderr.write(buffer);
    }
}
