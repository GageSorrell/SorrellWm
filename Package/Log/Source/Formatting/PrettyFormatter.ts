/**
 *
 *
 * @module @sorrell/log/Formatting/PrettyFormatter
 *
 * @file      PrettyFormatter.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Chalk } from "chalk";
import type { ChalkInstance } from "chalk";
import type { Formatter } from "../Formatter.js";
import type { LogRecord } from "../LogRecord.js";
import type { LogValue } from "../LogValue.js";

/** Console color selection policy. */
export type ColorMode = "Auto" | "Always" | "Never";

/** A Chalk-backed styling function. */
export type ChalkStyle = (Text: string) => string;

/** Customizable styles for every pretty-output role. */
export interface PrettyTheme
{
    readonly Timestamp: ChalkStyle;
    readonly Category: ChalkStyle;
    readonly Message: ChalkStyle;
    readonly Key: ChalkStyle;
    readonly StringValue: ChalkStyle;
    readonly NumberValue: ChalkStyle;
    readonly TypeName: ChalkStyle;
    readonly TraceLevel: ChalkStyle;
    readonly DebugLevel: ChalkStyle;
    readonly InfoLevel: ChalkStyle;
    readonly WarnLevel: ChalkStyle;
    readonly ErrorLevel: ChalkStyle;
    readonly FatalLevel: ChalkStyle;
}

/** Pretty console layout and styling configuration. */
export interface PrettyOptions
{
    readonly ColorMode?: ColorMode;
    readonly IncludeTimestamp?: boolean;
    readonly IncludeSource?: boolean;
    readonly IncludeProcess?: boolean;
    readonly IncludeFiber?: boolean;
    readonly MultilineObjects?: boolean;
    readonly MaximumLineWidth?: number;
    readonly Theme?: Partial<PrettyTheme>;

    /** Destination color capability used by `Auto`; normally supplied by ConsoleSink. */
    readonly ColorLevel?: 0 | 1 | 2 | 3;
}

/**
 *
 */
function DefaultTheme(ChalkValue: ChalkInstance): PrettyTheme
{
    return {
        Category: ChalkValue.cyan,
        DebugLevel: ChalkValue.blue,
        ErrorLevel: ChalkValue.red,
        FatalLevel: ChalkValue.bgRed.white.bold,
        InfoLevel: ChalkValue.green,
        Key: ChalkValue.gray,
        Message: ChalkValue.white,
        NumberValue: ChalkValue.yellow,
        StringValue: ChalkValue.white,
        Timestamp: ChalkValue.gray,
        TraceLevel: ChalkValue.dim,
        TypeName: ChalkValue.magenta,
        WarnLevel: ChalkValue.yellow
    };
}

/**
 *
 */
function ResolveColorLevel(Options: PrettyOptions): 0 | 1 | 2 | 3
{
    switch (Options.ColorMode ?? "Auto")
    {
        case "Always":
            return Options.ColorLevel === 2 || Options.ColorLevel === 3
                ? Options.ColorLevel
                : 1;
        case "Never":
            return 0;
        case "Auto":
            return Options.ColorLevel ?? 0;
    }
}

/**
 *
 */
function IsTagged(Value: LogValue): Value is Exclude<LogValue, null | boolean | number | string>
{
    return typeof Value === "object" && Value !== null && "_tag" in Value;
}

/**
 *
 */
function FormatValue(
    Value: LogValue,
    Theme: PrettyTheme,
    Multiline: boolean,
    Depth = 0
): string
{
    if (Value === null)
    {
        return Theme.TypeName("null");
    }

    if (typeof Value === "string")
    {
        return Theme.StringValue(Value);
    }

    if (typeof Value === "number")
    {
        return Theme.NumberValue(String(Value));
    }

    if (typeof Value === "boolean")
    {
        return Theme.TypeName(String(Value));
    }

    if (!IsTagged(Value))
    {
        return Theme.TypeName("<unavailable>");
    }

    switch (Value._tag)
    {
        case "BigInt":
            return Theme.NumberValue(`${ Value.Value }n`);
        case "Date":
            return Theme.TypeName(`Date(${ Value.Value })`);
        case "Symbol":
            return Theme.TypeName(
                Value.GlobalKey === undefined
                    ? `Symbol(${ Value.Description ?? "" })`
                    : `Symbol.for(${ Value.GlobalKey })`
            );
        case "Function":
            return Theme.TypeName(`[Function${ Value.Name === undefined ? "" : ` ${ Value.Name }` }]`);
        case "Redacted":
            return Theme.TypeName(
                Value.Label === undefined ? "[REDACTED]" : `[REDACTED: ${ Value.Label }]`
            );
        case "CircularReference":
            return Theme.TypeName(`[Circular -> ${ Value.Path }]`);
        case "Truncated":
            return Theme.TypeName(
                `[Truncated: ${ Value.Reason }${ Value.Omitted === undefined
                    ? ""
                    : `; ${ Value.Omitted } omitted` }]`
            );
        case "Unavailable":
            return Theme.TypeName(`[Unavailable: ${ Value.Reason }]`);
        case "Error":
        {
            const Header = `${ Value.Name }: ${ Value.Message }`;
            if (!Multiline)
            {
                return Theme.ErrorLevel(Header);
            }

            const Stack = Value.Stack === undefined
                ? ""
                : `\n${ Value.Stack.split("\n").map((Line: string) => `    ${ Line }`).join("\n") }`;
            const Cause = Value.Cause === undefined
                ? ""
                : `\n    Caused by: ${ FormatValue(Value.Cause, Theme, false, Depth + 1) }`;
            return Theme.ErrorLevel(`${ Header }${ Stack }${ Cause }`);
        }
        case "Array":
        case "Set":
        {
            const Open = Value._tag === "Set" ? "Set([" : "[";
            const Close = Value._tag === "Set" ? "])" : "]";
            const Type = Value._tag === "Array" ? Value.Type ?? "" : "";
            const Values = Value.Value.map(
                (Item: LogValue) => FormatValue(Item, Theme, false, Depth + 1)
            );
            return `${ Theme.TypeName(Type) }${ Open }${ Values.join(", ") }${ Close }`;
        }
        case "Map":
            return `Map({ ${ Value.Value.map(
                ([ Key, MapValue ]: readonly [LogValue, LogValue]) =>
                    `${ FormatValue(Key, Theme, false, Depth + 1) } => `
                    + FormatValue(MapValue, Theme, false, Depth + 1)
            ).join(", ") } })`;
        case "Object":
        {
            const Entries = Object.entries(Value.Value);
            const Type = Value.Type === undefined ? "" : `${ Theme.TypeName(Value.Type) } `;

            if (Multiline && Entries.length > 0)
            {
                const Indent = "    ".repeat(Depth + 1);
                const ClosingIndent = "    ".repeat(Depth);
                return `${ Type }{\n${ Entries.map(([ Key, Item ]: [string, LogValue]) =>
                    `${ Indent }${ Theme.Key(Key) }: ${ FormatValue(
                        Item,
                        Theme,
                        true,
                        Depth + 1
                    ) }`).join(",\n") }\n${ ClosingIndent }}`;
            }

            return `${ Type }{ ${ Entries.map(([ Key, Item ]: [string, LogValue]) =>
                `${ Theme.Key(Key) }: ${ FormatValue(Item, Theme, false, Depth + 1) }`
            ).join(", ") } }`;
        }
    }
}

/**
 *
 */
function LimitLineWidth(Text: string, Maximum: number | undefined): string
{
    if (Maximum === undefined || Text.length <= Maximum)
    {
        return Text;
    }

    return `${ Text.slice(0, Math.max(0, Maximum - 1)) }…`;
}

/** Construct a deterministic human-readable formatter. */
export function Pretty(Options: PrettyOptions = { }): Formatter
{
    const ChalkValue = new Chalk({ level: ResolveColorLevel(Options) });
    const Theme: PrettyTheme = {
        ...DefaultTheme(ChalkValue),
        ...Options.Theme
    };

    return {
        Format: (Record: LogRecord): string =>
        {
            const Time = Record.Timestamp.slice(11, 23);
            const LevelStyle = Theme[`${ Record.Level }Level`];
            const HeaderParts = [
                ...(Options.IncludeTimestamp === false ? [] : [ Theme.Timestamp(Time) ]),
                LevelStyle(Record.Level.toUpperCase().padEnd(5)),
                Theme.Category(Record.Category),
                ...(Options.IncludeSource === true ? [ Theme.TypeName(Record.Source) ] : []),
                ...(Options.IncludeProcess === true && Record.Process?.ProcessType !== undefined
                    ? [ Theme.TypeName(Record.Process.ProcessType) ]
                    : []),
                ...(Options.IncludeFiber === true && Record.Fiber !== undefined
                    ? [ Theme.TypeName(`#${ Record.Fiber.Identifier }`) ]
                    : []),
                Theme.Message(Record.Message.map(
                    (Value: LogValue) => FormatValue(Value, Theme, false)
                ).join(" "))
            ];
            const Lines = [ LimitLineWidth(HeaderParts.join(" "), Options.MaximumLineWidth) ];

            for (const [ Key, Value ] of Object.entries(Record.Annotations))
            {
                Lines.push(`    ${ Theme.Key(Key) }: ${ FormatValue(
                    Value,
                    Theme,
                    Options.MultilineObjects ?? true
                ) }`);
            }

            for (const Span of Record.Spans)
            {
                Lines.push(
                    `    ${ Theme.Key(Span.Label) }: `
                    + Theme.NumberValue(`${ Span.DurationMilliseconds }ms`)
                );
            }

            if (Record.Cause !== undefined)
            {
                Lines.push(
                    `    ${ Theme.Key("Cause") }: ${ FormatValue(Record.Cause, Theme, true) }`
                );
            }

            return `${ Lines.join("\n") }\n`;
        }
    };
}
