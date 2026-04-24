/**
 * @file      ansi-escape-codes.constants.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** Indicates an UNICODE characters is coming up. */
export const ANSI_ESCAPE: string = "\u001B[";

/** Generic ANSI escape characters for terminal based operations. */
export const ANSI_ESCAPE_CODES: Record<"CURSOR_HIDE" | "CURSOR_SHOW", string> =
    {
        CURSOR_HIDE: ANSI_ESCAPE + "?25l",
        CURSOR_SHOW: ANSI_ESCAPE + "?25h"
    };
