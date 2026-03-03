/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FLogHandler = (Statement: unknown, Statements: Array<unknown>) => unknown;

export type FShortTimestamp = `${ string }:${ string }.${ string }`;
