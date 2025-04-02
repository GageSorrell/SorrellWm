/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

/**
 * This gives type safety to logging.
 * Any log category in the project should be listed here.
 */
export type FLogCategory =
    | "Blur"
    | ""
    | ""
    | ""
    | ""
    | ""
    | "";

export type FLogOrigin =
    | "Frontend"
    | "Backend"
    | "Native";

export type FLogLevel =
    | "Verbose"
    | "Normal"
    | "Warn"
    | "Error";
