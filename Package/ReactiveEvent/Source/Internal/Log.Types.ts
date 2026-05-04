/**
 * @file      Log.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
