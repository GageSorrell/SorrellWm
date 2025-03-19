/* File:      IpcNavigator.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { type NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { IpcRenderer } from "@/Api";
import { Log } from "#/Development";
import { useEffect } from "react";

export const UseIpcNavigatorState = (): Readonly<[ State: object ]> =>
{
    const { state } = useLocation();
    return [ state ] as const;
};

export const IpcNavigator = (): undefined =>
{
    const Navigator: NavigateFunction = useNavigate();
    useEffect((): void =>
    {
        window.electron.ipcRenderer.On("Navigate", (...Arguments: Array<unknown>): void =>
        {
            Log("Frontend received Navigate with Arguments", Arguments.length,  ...Arguments);
            const HasRoute: boolean = Arguments.length > 0 && typeof Arguments[0] === "string";
            if (HasRoute)
            {
                const Route: string = Arguments[0] as string;

                const HasState: boolean =
                    Arguments.length >= 2 &&
                    typeof Arguments[1] === "object" &&
                    Arguments[1] !== null;
                if (HasState)
                {
                    Navigator(Route, { state: Arguments[1] });
                }
                else
                {
                    Navigator(Route);
                }
            }
        });

        window.electron.ipcRenderer.SendMessage("ReadyForRoute");
    }, [ Navigator ]);

    return undefined;
};

