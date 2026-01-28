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
        window.electron.ipcRenderer.sendMessage(Channel, Response);
    }, DependencyArray);

    DependencyArray.push(Wrapper);

    useEffect((): FSimpleCallback =>
    {
        window.electron.ipcRenderer.on(Channel, Wrapper);

        return (): void =>
        {
            window.electron.ipcRenderer.removeListener(Channel);
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
            const Wrapper = (_Event: Electron.Event, ...ArgumentVector: Array<unknown>): void =>
            {
                const Response: TResponse<T> = ArgumentVector[0] as TResponse<T>;

                if (RemoveListenerRef?.current !== undefined)
                {
                    RemoveListenerRef.current = undefined;
                }

                Resolve(Response);
            };

            if (RemoveListenerRef !== undefined)
            {
                RemoveListenerRef.current = (): void =>
                {
                    window.electron.ipcRenderer.removeListener(Channel, Wrapper);
                };
            }

            window.electron.ipcRenderer.once(Channel, Wrapper);
            window.electron.ipcRenderer.sendMessage(Channel, Request);
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

    const [ Response, SetResponse ] = useState<TIpcState<T>>(EmptyResponse);
    const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
        useRef<FSimpleCallback | undefined>(undefined);

    DependencyArray.push(Request, Response, SetResponse);

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const CleanupFunction = useCallback((): void =>
    {
        if (RemoveListenerRef.current !== undefined)
        {
            RemoveListenerRef.current();
        }
    }, DependencyArray);

    DependencyArray.push(CleanupFunction);

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
    {
        const NewResponse: TResponse<T> = await SendIpcEvent(Channel, Request);
        if (!AbortSignal.aborted)
        {
            SetResponse((_Old: TIpcState<T>): TIpcState<T> =>
            {
                /* @ts-expect-error TypeScript cannot infer whether `NewResponse` has the `Data` property. */
                return NewResponse;
            });
        }
    }, [ Channel, Request, SendIpcEvent, SetResponse ]);

    UseEffectAsync(SideEffect, CleanupFunction, DependencyArray);

    return {
        Data: Response.Data,
        Error: Response.Error
    } as const;
};
