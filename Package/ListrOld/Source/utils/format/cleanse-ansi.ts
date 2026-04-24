/**
 * @file      cleanse-ansi.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BELL_REGEX, CLEAR_LINE_REGEX } from "./cleanse-ansi.constants.js";

export function cleanseAnsi(chunk: string): string
{
    return String(chunk)
        .replace(new RegExp(CLEAR_LINE_REGEX, "gmi"), "")
        .replace(new RegExp(BELL_REGEX, "gmi"), "")
        .trim();
}
