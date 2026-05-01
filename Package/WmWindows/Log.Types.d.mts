/**
 * @file      Log.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
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
