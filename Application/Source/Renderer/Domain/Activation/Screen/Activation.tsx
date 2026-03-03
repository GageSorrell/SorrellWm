/* File:      Activation.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { CommandContainer, type FCommand } from "$/Common/Component";
import { type ReactElement, useEffect } from "react";
import { Action } from "@/Action";
import type { FLogger } from "../../../../Shared/Log.Types";
import { GetLogger } from "@/Log";
import { UseIpcNavigatorState } from "@/Router";
import { UseNavigator } from "@/Utility";

const Log: FLogger = GetLogger("Activation");

const ActivationTiled = (): ReactElement =>
{
    const [ Navigate ] = UseNavigator();

    const Commands: Array<FCommand> =
    [
        {
            Callback: Navigate("/Focus"),
            Description: "@TODO",
            Action: [ "Direction.Left" ],
            Name: "Focus"
        },
        {
            Callback: Navigate("/Insert"),
            Description: "@TODO",
            Action: [ "Direction.Up" ],
            Name: "Insert"
        },
        {
            Callback: Navigate("/Move"),
            Description: "@TODO",
            Action:  [ "Direction.Down" ],
            Name: "Move"
        },
        {
            Callback: Navigate("/Resize"),
            Description: "@TODO",
            Action: [ "Direction.Right" ],
            Name: "Resize"
        }
    ];

    const BottomShelfCommands: Array<FCommand> =
    [
        {
            Callback: () => Log("Settings was selected."),
            Description: "@TODO",
            Action: [ "Miscellaneous.Settings" ],
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

    const Commands: Array<FCommand> =
    [
        {
            Callback: Navigate("/Tile"),
            Description: "@TODO",
            Action: [ "Direction.Up" ],
            Name: "Tile (Bring into Panel)"
        },
        {
            Callback: Navigate("/Move"),
            Description: "@TODO",
            Action: [ "Direction.Down" ],
            Name: "Move"
        },
        {
            Callback: Navigate("/Resize"),
            Description: "@TODO",
            Action: [ "Direction.Right" ],
            Name: "Resize"
        }
    ];

    const BottomShelfCommands: Array<FCommand> =
    [
        {
            Callback: () => Log("Peek was selected."),
            Description: "@TODO",
            Action: [ "Miscellaneous.Peek" ],
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
