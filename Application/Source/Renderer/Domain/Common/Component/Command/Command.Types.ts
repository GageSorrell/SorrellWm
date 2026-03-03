/* File:      Command.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FAction } from "../../../../../Shared/Settings";
import type { FSimpleCallback } from "../../../../../Shared/Utility";

export type FCommandBase =
{
    Description: string;
    /**
     * The user-facing name of the command.
     * @TODO Extend this property to also allow `Name`
     * to also be a function that returns a `string`,
     * or a `Promise<string>`.
     */
    Name: string;
};

export type FSimpleCommand =
    FCommandBase &
    {
        Action: FAction;
        Callback: FSimpleCallback;
    };

export type FSubCommand = Omit<FSimpleCommand, "Description" | "Name">;

export type FCompoundCommand =
    FCommandBase &
    {
        SubCommands: Array<FSubCommand>;
    };

export type FCommand =
    | FSimpleCommand
    | FCompoundCommand;

export type PCommand = FSimpleCommand;
