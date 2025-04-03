/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export const Log = (...Statements: Array<unknown>): void =>
{
    console.log("📦", ...Statements);
};

export const LogError = (...Statements: Array<unknown>): void =>
{
    console.log("📦🚨", ...Statements);
};
