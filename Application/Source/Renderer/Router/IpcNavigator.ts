/* File:      IpcNavigator.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import type { FNavigateRequest } from "()/Event/Navigate.Types";
import type { TEventCallback } from "../../Shared/Event";
import { UseIpcEvent } from "@/Event";

export const UseIpcNavigatorState = (): Readonly<[ State: unknown ]> =>
{
    const { state } = useLocation();
    return [ state ] as const;
};

export const IpcNavigator = (): undefined =>
{
    const Navigator: NavigateFunction = useNavigate();
    type FOnNavigateCallback = (In: FNavigateRequest) => ReturnType<TEventCallback<"Navigate">>;
    const OnNavigate: FOnNavigateCallback = useCallback(
        async ({ Route, State }: FNavigateRequest): ReturnType<TEventCallback<"Navigate">> =>
        {
            const HasState: boolean = (
                State !== undefined &&
                typeof State === "object" &&
                State !== null
            );

            if (HasState)
            {
                Navigator(Route, { state: State });
            }
            else
            {
                Navigator(Route);
            }

            return { Data: undefined, Error: undefined };
        },
        [ Navigator ]
    );

    UseIpcEvent("Navigate", OnNavigate);

    useEffect((): void =>
    {
        window.electron.ipcRenderer.Send("ReadyForRoute");
    }, [ Navigator ]);

    return undefined;
};
