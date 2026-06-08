/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

/** The formatters and linters that can be disabled via {@link Config!DisabledFormatters}. */
export type CodeFormatter =
    | "eslint"
    | "ox"
    | "prettier";

export type LineOrder =
    | "before"
    | "after";
