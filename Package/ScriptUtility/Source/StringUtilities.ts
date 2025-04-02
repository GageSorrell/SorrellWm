/* File:      String.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/** Insert a line at a given index, or provide an in-line rule to determine the index. */
export const InsertLine = (Contents: string, Line: string, Index: number | (() => number)): string =>
{
    const Lines: Array<string> = Contents.split("\n");
    const ActualIndex: number = typeof Index === "number"
        ? Index
        : Index();

    Lines.splice(ActualIndex, 0, Line);

    return Lines.join("\n");
};
