/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type LogLevel =
    | "Debug"
    | "Error"
    | "Info"
    | "Warn";

export type LogOptions =
    {
        Level: LogLevel;
    };

export type LogStatements<ElementType = unknown> =
    ElementType extends LogOptions
        ? never
        : Array<ElementType>;
