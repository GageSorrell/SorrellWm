/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
    type Dispatch,
    type MutableRefObject,
    type SetStateAction,
    useEffect,
    useRef,
    useState } from "react";
import type { FIpcFrontendChannel, TRequestData, TResponseData } from "?/Event.Types";

type FUseIndexReturnValue = Readonly<[
    Value: number,
    Increment: () => void,
    Decrement: () => void,
    SetIndex: Dispatch<SetStateAction<number>>
]>;

export const UseIndex = (
    InitialValue: number = 0,
    Minimum: number = 0,
    Maximum?: number
): FUseIndexReturnValue =>
{
    const [ Index, SetIndex ] = useState<number>(InitialValue || 0);

    const Increment = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Maximum !== undefined && Old === Maximum
                ? Minimum
                : Old + 1;
        });
    };

    const Decrement = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Old === Minimum
                ? Maximum !== undefined
                    ? Maximum
                    : Minimum
                : Old - 1;
        });
    };

    return [ Index, Increment, Decrement, SetIndex ] as const;
};

/** Send an event to the backend, and get a response. */
export const UseIpc = <TChannel extends FIpcFrontendChannel>(
    Channel: TChannel,
    RequestData: TRequestData<TChannel>
): Readonly<[
    TResponseData<TChannel> | undefined,
    Dispatch<SetStateAction<TResponseData<TChannel> | undefined>>
]> =>
{
    const [ Response, SetResponse ] = useState<TResponseData<TChannel> | undefined>(undefined);
    const HasRunOnceRef: MutableRefObject<boolean> = useRef<boolean>(false);
    useEffect((): void =>
    {
        if (HasRunOnceRef.current)
        {
            return;
        }

        HasRunOnceRef.current = true;
        window.electron.ipcRenderer.On(Channel, (InResponseData: TResponseData<TChannel>): void =>
        {
            SetResponse((_Old: TResponseData<TChannel> | undefined): TResponseData<TChannel> | undefined =>
            {
                return InResponseData;
            });
        });
        window.electron.ipcRenderer.Send(Channel, RequestData);
    }, [ Channel, RequestData ]);
    return [ Response, SetResponse ] as const;
};
