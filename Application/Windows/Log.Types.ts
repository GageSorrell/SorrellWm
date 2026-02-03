/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type FLogOrigin =
    | "Frontend"
    | "Backend"
    | "Native";

export type FLogOriginInternal =
    | FLogOrigin
    | "Meta";

export type FLogLevel =
    | "Verbose"
    | "Normal"
    | "Warn"
    | "Error";
