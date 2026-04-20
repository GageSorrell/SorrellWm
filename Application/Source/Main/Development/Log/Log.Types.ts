/**
 * @file      Log.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type FLogHandler = (Statement: unknown, Statements: TArray<unknown>) => unknown;

export type FShortTimestamp = `${ string }:${ string }.${ string }`;
