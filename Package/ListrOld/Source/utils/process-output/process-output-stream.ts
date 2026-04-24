/**
 * @file      process-output-stream.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ProcessOutputBuffer } from "./process-output-buffer.js";
import type { ProcessOutputBufferEntry } from "@utils/index.js";

// taken from https://github.com/keindev/stdout-update/blob/main/src/Hook.ts
// with all credits to keindev, wish i could integrate the stdout-update

export class ProcessOutputStream
{
    private readonly method: NodeJS.WriteStream["write"];
    private readonly buffer: ProcessOutputBuffer;

    constructor(private stream: NodeJS.WriteStream)
    {
        this.method = stream.write;
        this.buffer = new ProcessOutputBuffer({ stream });
    }

    get out(): NodeJS.WriteStream
    {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: ProcessOutputStream = this;

        return new Proxy(
            this.stream,
            {
                get(target: NodeJS.WriteStream, prop: string | symbol, receiver: unknown): unknown
                {
                    if (prop === "write")
                    {
                        return self.write.bind(self);
                    }

                    return Reflect.get(target, prop, receiver);
                }
            }
        );
    }

    public hijack(): void
    {
        this.stream.write = this.buffer.write.bind(this.buffer);
    }

    public release(): Array<ProcessOutputBufferEntry>
    {
        this.stream.write = this.method;

        const buffer: Array<ProcessOutputBufferEntry> = [ ...this.buffer.all ];

        this.buffer.reset();

        return buffer;
    }

    public write(...args: Parameters<NodeJS.WriteStream["write"]>): ReturnType<NodeJS.WriteStream["write"]>
    {
        return this.method.apply(this.stream, args);
    }
}
