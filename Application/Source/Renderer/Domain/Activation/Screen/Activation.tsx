/* File:      Activation.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { CommandContainer, type FCommand, type FSimpleCommand } from "$/Common/Component";
import { type ReactElement, useEffect } from "react";
import { Action } from "@/Action";
import type { FLogger } from "../../../../Shared/Log.Types";
import { GetLogger } from "@/Log";
import { UseIpcNavigatorState } from "@/Router";
import { UseNavigator } from "@/Utility";
import { MakeSendIpcEventCallback, SendIpcEvent, UseSendIpcEvent, UseSendIpcEventStrict } from "@/Event";
import type { FSimpleCallback } from "()/Utility";

const Log: FLogger = GetLogger("Activation");

const ActivationTiled = (): ReactElement =>
{
    const [ Navigate ] = UseNavigator();

    const Commands: TArray<FCommand> =
    [
        {
            Action: [ "Direction.Up" ],
            Callback: Navigate("/Insert"),
            Description: "@TODO",
            Name: "Insert"
        },
        {
            Action:  [ "Direction.Down" ],
            Callback: Navigate("/Move"),
            Description: "@TODO",
            Name: "Move"
        },
        {
            Action: [ "Direction.Right" ],
            Callback: Navigate("/Resize"),
            Description: "@TODO",
            Name: "Resize"
        }
    ];

    const FocusCommand: FSimpleCommand =
    {
        Action: [ "Direction.Left" ],
        Callback: Navigate("/Focus"),
        Description: "@TODO",
        Name: "Focus"
    };

    const { Data: FocusData } = UseSendIpcEvent("GetFocusData", undefined);
    if (FocusData?.CanMoveWithinPanel || FocusData?.CanStepDown || FocusData?.CanStepUp)
    {
        Commands.unshift(FocusCommand);
    }

    const BottomShelfCommands: TArray<FCommand> =
    [
        {
            Action: [ "Miscellaneous.Settings" ],
            Callback: () => Log("Settings was selected."),
            Description: "@TODO",
            Name: "Settings"
        }
    ];

    return (
        <CommandContainer { ...{ BottomShelfCommands, Commands } } />
    );
};

const ActivationNotTiled = (): ReactElement =>
{
    const [ Navigate ] = UseNavigator();

    Log("ActivationNotTiled.");

    // const { Data } = UseSendIpcEventStrict();

    const MaximizeCommand: FSimpleCommand =
    {
        Action: [ "Primary[0]" ],
        Callback: MakeSendIpcEventCallback("MaximizeFloatingWindow", undefined),
        Description: "@TODO",
        Name: "Maximize"
    };

    const RestoreCommand: FSimpleCommand =
    {
        Action: [ "Primary[0]" ],
        Callback: MakeSendIpcEventCallback("RestoreFloatingWindow", undefined),
        Description: "@TODO",
        Name: "Restore"
    };

    const Commands: TArray<FCommand> =
    [
        {
            Action: [ "Direction.Left" ],
            Callback: Navigate("/Tile"),
            Description: "@TODO",
            Name: "Tile (Bring into Panel)"
        },
        {
            Action: [ "Direction.Up" ],
            Callback: Navigate("/Move"),
            Description: "@TODO",
            Name: "Move"
        },
        {
            Action: [ "Direction.Down" ],
            Callback: Navigate("/Resize"),
            Description: "@TODO",
            Name: "Resize"
        },
        // {
        //     Action: [ "Primary[0]" ],
        //     Callback: Navigate("/Resize"),
        //     Description: "@TODO",
        //     Name: "Maximize"
        // },
        // {
        //     Action: [ "Primary[0]" ],
        //     Callback: Navigate("/Resize"),
        //     Description: "@TODO",
        //     Name: "Maximize"
        // }
    ];

    const BottomShelfCommands: TArray<FCommand> =
    [
        {
            Action: [ "Miscellaneous.Peek" ],
            Callback: () => Log("Peek was selected."),
            Description: "@TODO",
            Name: "Peek"
        }
    ];

    return (
        <Action>
            <CommandContainer { ...{ BottomShelfCommands, Commands } } />
        </Action>
    );
};

export const Activation = (): ReactElement =>
{
    const [ State ] = UseIpcNavigatorState();

    const GetIsTiled = (): boolean =>
    {
        type FNavigatorState =
        {
            IsTiled: boolean;
        };

        const IsStateValid = (State: unknown): State is FNavigatorState =>
        {
            return (
                State !== null &&
                State !== undefined &&
                typeof State === "object" &&
                "IsTiled" in State
            );
        };

        return IsStateValid(State)
            ? State.IsTiled
            : true;
    };

    useEffect((): void =>
    {
        window.electron.ipcRenderer.On("TearDown", (): void =>
        {
            setTimeout((): void =>
            {
                window.electron.ipcRenderer.Send("TearDown");
            }, 100);
        });
    }, [ ]);

    /** @TODO Use Action component. */
    /** @TODO Hide "SorrellWm" if document.body.height is less than 500. */
    /** @TODO Set color of "SorrellWm" just as other elements, based upon color of underlying window. */
    return (
        <div
            style={ {
                alignItems: "center",
                background: "none",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "flex-start",
                width: "100%"
            } }>
            <div style={ {
                color: "black",
                fontSize: 64,
                marginBottom: 96
            } }>
                SorrellWm
            </div>
            {
                GetIsTiled()
                    ? <ActivationTiled />
                    : <ActivationNotTiled />
            }
        </div>
    );
};
