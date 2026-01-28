/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import type { FIpcBackendEvents, FIpcFrontendChannel, TEventCallback, TRequest, TResponse } from "?/Event";
import type { FRejectFunction, FSimpleCallback, TResolveFunction } from "?/Utility.Types";
import { type MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import type { TIpcState, TUseSendIpcEventReturnType } from "./Event.Types";
import { UseEffectAsync } from "./Utility";
import { Log } from "./Api";

/** Receive an event received by Main. */
export const UseIpcEvent = <T extends keyof FIpcBackendEvents>(
    Channel: T,
    Callback: TEventCallback<FIpcBackendEvents[T]>,
    DependencyArray: Array<unknown> = [ ]
): void =>
{
    DependencyArray.push(Callback, Channel);

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const Wrapper = useCallback((Request: TRequest<T>): void =>
    {
        const Response: ReturnType<TEventCallback<FIpcBackendEvents[T]>> = Callback(Request);
        window.electron.ipcRenderer.Send(Channel, Response);
    }, DependencyArray);

    DependencyArray.push(Wrapper);

    useEffect((): FSimpleCallback =>
    {
        window.electron.ipcRenderer.On(Channel, Wrapper);

        return (): void =>
        {
            window.electron.ipcRenderer.RemoveListener(Channel);
        };
    }, DependencyArray);
};

/**
 * Send an event to Main.
 *
 * @param Channel - The IPC channel.
 * @param Request - The payload sent with the event.
 * @param RemoveListenerRef - A reference to a function that makes
 *        the relevant call to `ipcRenderer.removeListener`; it is
 *        unset just before the promise resolves.
 */
export const SendIpcEvent = <T extends FIpcFrontendChannel>(
    Channel: T,
    Request: TRequest<T>,
    RemoveListenerRef?: MutableRefObject<FSimpleCallback | undefined>
): Promise<TResponse<T>> =>
{
    return new Promise<TResponse<T>>(
        (Resolve: TResolveFunction<TResponse<T>>, _Reject: FRejectFunction): void =>
        {
            const Wrapper = (...ArgumentVector: Array<unknown>): void =>
            {
                const Response: TResponse<T> = ArgumentVector[0] as TResponse<T>;

                if (RemoveListenerRef?.current !== undefined)
                {
                    RemoveListenerRef.current = undefined;
                }

                Log(`Resolving promise in SendIpcEvent, Response is ${ JSON.stringify(Response) }.`);

                Resolve(Response);
            };

            if (RemoveListenerRef !== undefined)
            {
                RemoveListenerRef.current = (): void =>
                {
                    window.electron.ipcRenderer.RemoveListener(Channel, Wrapper);
                };
            }

            window.electron.ipcRenderer.Once(Channel, Wrapper);
            window.electron.ipcRenderer.Send(Channel, Request);
        });
};

/** `SendIpcEvent` wrapped into a hook. */
export const UseSendIpcEvent = <T extends FIpcFrontendChannel>(
    Channel: T,
    Request: TRequest<T>,
    DependencyArray: Array<unknown> = [ ]
): TUseSendIpcEventReturnType<T> =>
{
    const EmptyResponse: TIpcState<T> =
    {
        Data: undefined,
        Error: undefined
    };

    Log("UseSendIpcEvent was called.");

    const [ Response, SetResponse ] = useState<TIpcState<T>>(EmptyResponse);
    const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
        useRef<FSimpleCallback | undefined>(undefined);

    DependencyArray.push(Request, SetResponse);

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const CleanupFunction = useCallback((): void =>
    {
        // if (RemoveListenerRef.current !== undefined)
        // {
        //     RemoveListenerRef.current();
        // }
    }, DependencyArray);

    DependencyArray.push(CleanupFunction);

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
    {
        Log("Going to await SendIpcEvent");
        const NewResponse: TResponse<T> = await SendIpcEvent(Channel, Request);
        Log(`Response is ${ JSON.stringify(NewResponse) }.`);
        if (!AbortSignal.aborted)
        {
            SetResponse((_Old: TIpcState<T>): TIpcState<T> =>
            {
                Log("Going to set Response via SetResponse.");
                /* @ts-expect-error TypeScript cannot infer whether `NewResponse` has the `Data` property. */
                return NewResponse;
            });
        }
    }, [ Channel, Request, SendIpcEvent, SetResponse ]);

    UseEffectAsync(SideEffect, CleanupFunction, DependencyArray);

    return {
        Data: (Response?.Data === undefined ? undefined : Response.Data),
        Error: (Response?.Error === undefined ? undefined : Response.Error)
    } as const;
};
