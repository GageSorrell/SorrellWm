/**
 * @file      Dependency.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type ConsoleLogFunctionKey =
    Extract<
        keyof typeof console,
        | "log"
        | "info"
        | "debug"
        | "dir"
        | "warn"
        | "error"
    >;
