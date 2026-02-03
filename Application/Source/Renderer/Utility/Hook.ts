/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import {
    type Dispatch,
    type MutableRefObject,
    type SetStateAction,
    useEffect,
    useRef,
    useState } from "react";
import type { FIpcFrontendChannel, TRequest, TResponse } from "?/Event";
import type { FUseEffectAsyncCallback, FUseEffectAsyncCleanupFunction } from "./Hook.Types";
import type { FSimpleCallback } from "?/Utility.Types";

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
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const UseIpc_DEPRECATED = <TChannel extends FIpcFrontendChannel>(
    Channel: TChannel,
    RequestData: TRequest<TChannel>
): Readonly<[
    TResponse<TChannel> | undefined,
    Dispatch<SetStateAction<TResponse<TChannel> | undefined>>
]> =>
{
    const [ Response, SetResponse ] = useState<TResponse<TChannel> | undefined>(undefined);
    const HasRunOnceRef: MutableRefObject<boolean> = useRef<boolean>(false);
    useEffect((): void =>
    {
        if (HasRunOnceRef.current)
        {
            return;
        }

        HasRunOnceRef.current = true;
        window.electron.ipcRenderer.On(Channel, (InResponseData: TResponse<TChannel>): void =>
        {
            SetResponse((_Old: TResponse<TChannel> | undefined): TResponse<TChannel> | undefined =>
            {
                return InResponseData;
            });
        });
        window.electron.ipcRenderer.Send(Channel, RequestData);
    }, [ Channel, RequestData ]);
    return [ Response, SetResponse ] as const;
};

/**
 * `useEffect` but for async callbacks.  The callback can be defined to accept
 * an `AbortSignal`, which is called whenever the dependency array updates.
 *
 * If the callback returns a cleanup function, then
 */
export const UseEffectAsync = (
    Function: FUseEffectAsyncCallback,
    CleanupFunction: FUseEffectAsyncCleanupFunction  | undefined = undefined,
    DependencyArray: Array<unknown> = [ ]
): void =>
{
    const [ Controller ] = useState<AbortController>(new AbortController());

    DependencyArray.push(Function, CleanupFunction, Controller);

    useEffect((): void | FSimpleCallback =>
    {
        Function(Controller.signal);

        if (CleanupFunction !== undefined)
        {
            const CleanupFunctionWithSignal = (): void =>
            {
                if (CleanupFunction !== undefined)
                {
                    CleanupFunction(Controller.signal);
                }
            };

            return CleanupFunctionWithSignal;
        }
    }, DependencyArray);
};
