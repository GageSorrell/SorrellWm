/**
 * @file      process-output-buffer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    ProcessOutputBufferEntry,
    ProcessOutputBufferOptions } from "./process-output-buffer.interface.js";
import { StringDecoder } from "string_decoder";

export class ProcessOutputBuffer
{
    private Buffer: Array<ProcessOutputBufferEntry> = [ ];
    private readonly Decoder: StringDecoder = new StringDecoder();

    constructor(private readonly options?: ProcessOutputBufferOptions) {}

    get all(): Array<ProcessOutputBufferEntry>
    {
        return this.Buffer;
    }

    get last(): ProcessOutputBufferEntry
    {
        return this.Buffer.at(-1);
    }

    get length(): number
    {
        return this.Buffer.length;
    }

    public write(
        Data: Uint8Array | string,
        ...ArgumentVector: [(string | undefined)?, ((err?: Error) => void)?] | [((err?: Error) => void)?]
    ): ReturnType<NodeJS.WriteStream["write"]>
    {
        type Callback =
            | string
            | ((Error?: Error) => void)
            | ((Error?: Error) => void);
        const callback: Callback = ArgumentVector[ArgumentVector.length - 1];

        this.Buffer.push({
            entry: this.Decoder.write(
                typeof Data === "string"
                    ? Buffer.from(
                        Data,
                        typeof ArgumentVector[0] === "string"
                            ? (ArgumentVector[0] as BufferEncoding)
                            : undefined)
                    : Buffer.from(Data)
            ),
            stream: this.options?.stream,
            time: Date.now()
        });

        if (this.options?.limit)
        {
            this.Buffer = this.Buffer.slice(-this.options.limit);
        }

        if (typeof callback === "function")
        {
            callback();
        }

        return true;
    }

    public reset(): void
    {
        this.Buffer = [ ];
    }
}
