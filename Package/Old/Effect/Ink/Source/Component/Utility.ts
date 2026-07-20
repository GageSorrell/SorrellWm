/**
 *
 *
 * @module @sorrell/effect-ink/Component/Utility
 * @internal
 *
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import Chalk from "chalk";

export const ApplyCursor = (
    InLine: string,
    CursorIndex: number,
    IsSubmitted: boolean,
    IsValidating: boolean
): string =>
{
    if (IsSubmitted || IsValidating)
    {
        return InLine;
    }

    const Line: string = CursorIndex === InLine.length
        ? InLine + " "
        : InLine;

    return (
        Line.slice(0, CursorIndex) +
        Chalk.inverse(Line[CursorIndex]) +
        Line.slice(CursorIndex + 1)
    );
};
