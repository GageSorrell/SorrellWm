/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import type { FIpcBackendEvents, FIpcFrontendChannel, TEventCallback, TRequest, TResponse } from "?/Event";
import type { FRejectFunction, FSimpleCallback, TResolveFunction } from "?/Utility.Types";
import { useCallback, useEffect } from "react";

/** Respond to an event received by Main. */
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

/** Send an event to Main. */
export const SendIpcEvent = <T extends FIpcFrontendChannel>(
    Channel: T,
    Request: TRequest<T>
): Promise<TResponse<T>> =>
{
    return new Promise<TResponse<T>>(
        (Resolve: TResolveFunction<TResponse<T>>, _Reject: FRejectFunction): void =>
        {
            window.electron.ipcRenderer.once(
                Channel,
                (_Event: Electron.Event, ...ArgumentVector: Array<unknown>): void =>
                {
                    const Response: TResponse<T> = ArgumentVector[0] as TResponse<T>;
                    Resolve(Response);
                });

            window.electron.ipcRenderer.sendMessage(Channel, Request);
        });
};
