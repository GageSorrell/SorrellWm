/**
 * @file      Common.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

export const Log = (...Statements: Array<unknown>): void =>
{
    /* eslint-disable-next-line no-console */
    console.log("📦", ...Statements);
};

export const LogError = (...Statements: Array<unknown>): void =>
{
    /* eslint-disable-next-line no-console */
    console.log("📦🚨", ...Statements);
};
