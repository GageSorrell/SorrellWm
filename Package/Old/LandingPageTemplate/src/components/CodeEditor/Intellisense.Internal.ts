/**
 * @file      Intellisense.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { FCodeChangeResolved, FIntellisenseContent } from "./CodeEditor.Internal.Types";

export function GetChangeIntellisense(
    Change: FCodeChangeResolved,
    CurrentIntellisense: FIntellisenseContent | undefined
): FIntellisenseContent | undefined
{
    return Change.Intellisense === undefined
        ? CurrentIntellisense
        : Change.Intellisense;
}
