/* File:      Move.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { CommandContainer, type FCommand, type FCompoundCommand } from "@/Domain/Common";
import { Action } from "@/Action";
import type { ReactElement } from "react";
import { UseSendIpcEventDeferred } from "@/Event";

export const Move = (): ReactElement =>
{
    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const StepSizes: TArray<number> = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ];

    // const ChangeMoveModeCommand: FSimpleCommand =
    // {
    //     Description: "@TODO",
    //     Name: ""
    // };

    const MoveLeft = (): void =>
    {
        SendIpcEvent("MoveFloatingWindow", { Direction: "X", Distance: -1 * 32 });
    };

    const MoveUp = (): void =>
    {
        SendIpcEvent("MoveFloatingWindow", { Direction: "Y", Distance: -1 * 32 });
    };

    const MoveDown = (): void =>
    {
        SendIpcEvent("MoveFloatingWindow", { Direction: "Y", Distance: 32 });
    };

    const MoveRight = (): void =>
    {
        SendIpcEvent("MoveFloatingWindow", { Direction: "X", Distance: 32 });
    };

    const DirectionCommands: FCompoundCommand =
    {
        Description: "@TODO",
        Name: "Move the Window",
        SubCommands:
        [
            {
                Action: [ "Direction.Left" ],
                Callback: MoveLeft
            },
            {
                Action: [ "Direction.Up" ],
                Callback: MoveUp
            },
            {
                Action: [ "Direction.Down" ],
                Callback: MoveDown
            },
            {
                Action: [ "Direction.Right" ],
                Callback: MoveRight
            }
        ]
    };

    const Commands: TArray<FCommand> = [ DirectionCommands ];

    return (
        <Action>
            <CommandContainer { ...{ Commands } } />
        </Action>
    );
};
