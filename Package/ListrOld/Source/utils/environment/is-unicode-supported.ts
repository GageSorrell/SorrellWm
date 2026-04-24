/**
 * @file      is-unicode-supported.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ListrEnvironmentVariables } from "@constants/index.js";

export function isUnicodeSupported(): boolean
{
    return (
        !!process.env[ListrEnvironmentVariables.FORCE_UNICODE] ||
        process.platform !== "win32" ||
        !!process.env.CI ||
        !!process.env.WT_SESSION ||
        process.env.TERM_PROGRAM === "vscode" ||
        process.env.TERM === "xterm-256color" ||
        process.env.TERM === "alacritty"
    );
}
