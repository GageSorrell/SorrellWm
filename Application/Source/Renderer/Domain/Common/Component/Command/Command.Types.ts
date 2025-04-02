/* File:      Command.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type PCommand =
{
    Key: string;
    Title: string;
    Action: () => void;
};
