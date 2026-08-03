/**
 * Node.js logging support for console sink.
 *
 * @module @sorrell/log/Node/ConsoleSink
 *
 * @file      ConsoleSink.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import {
    Pretty as PrettyFormatter,
    type PrettyOptions
} from "../Formatting/PrettyFormatter.js";
import type { LogSink } from "../Sink.js";

/** A stream-like destination accepted by the console sink. */
export interface ConsoleStream
{
    readonly isTTY?: boolean;
    readonly write: (Text: string) => unknown;
}

/** Pretty console sink configuration. */
export interface ConsoleSinkOptions extends PrettyOptions
{
    readonly Stream?: ConsoleStream;
}

/** Construct a Chalk-formatted console sink. */
export function Pretty(Options: ConsoleSinkOptions = { }): LogSink
{
    const Stream = Options.Stream ?? process.stdout;
    const ColorLevel = Options.ColorMode === "Auto" || Options.ColorMode === undefined
        ? Stream.isTTY === true ? 1 : 0
        : Options.ColorLevel;
    const Formatter = PrettyFormatter(
        ColorLevel === undefined
            ? Options
            : { ...Options, ColorLevel }
    );

    return {
        Flush: Effect.void,
        Name: "ConsoleSink",
        Shutdown: Effect.void,
        Write: (Record) => Effect.sync(() =>
        {
            Stream.write(Formatter.Format(Record));
        })
    };
}
