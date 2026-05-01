/**
 * @file      IpcNavigator.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { type NavigateFunction, useLocation, useNavigate } from "react-router-dom";
// import { UseIpcEvent, UseSendIpcEventDeferred } from "@/Event";
import { SendIpcEvent } from "@/Temp";
import { useEffect } from "react";
// import type { FNavigateRequest } from "../../Shared/Event/Navigate.Types";

export const UseIpcNavigatorState = (): Readonly<[ State: unknown ]> =>
{
    const { state } = useLocation();
    return [ state ] as const;
};

export const IpcNavigator = (): undefined =>
{
    const Navigator: NavigateFunction = useNavigate();
    // type FOnNavigateCallback = (In: FNavigateRequest) => ReturnType<Promise<any>>;
    // const OnNavigate: FOnNavigateCallback = useCallback(
    //     async ({ Route, State }: FNavigateRequest): ReturnType<any> =>
    //     {
    //         const HasState: boolean = (
    //             State !== undefined &&
    //             typeof State === "object" &&
    //             State !== null
    //         );

    //         if (HasState)
    //         {
    //             Navigator(Route, { state: State });
    //         }
    //         else
    //         {
    //             Navigator(Route);
    //         }

    //         return { Data: undefined, Error: undefined };
    //     },
    //     [ Navigator ]
    // );

    // UseIpcEvent("Navigate", OnNavigate);

    // const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    useEffect((): void =>
    {
        SendIpcEvent("ReadyForRoute", undefined);
    }, [ Navigator, SendIpcEvent ]);

    return undefined;
};
