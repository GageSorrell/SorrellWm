/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export const Log = (...Statements: TArray<unknown>): void =>
{
    /* eslint-disable-next-line no-console */
    console.log("📦", ...Statements);
};

export const LogError = (...Statements: TArray<unknown>): void =>
{
    /* eslint-disable-next-line no-console */
    console.log("📦🚨", ...Statements);
};
