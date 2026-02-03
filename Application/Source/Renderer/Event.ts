/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import type {
    FIpcBackendEvents,
    FIpcFrontendChannel,
    FRichFrontendEvents,
    TEventCallback,
    TGetResponseFromKey,
    TGetRichResponseAsFailure,
    TGetRichResponseAsSuccess,
    TGetRichResponseFromKey,
    TRequest } from "?/Event";
import type { FRejectFunction, FSimpleCallback, TResolveFunction } from "?/Utility.Types";
import { type MutableRefObject, useCallback, useEffect, useState} from "react";
import type {
    TIpcState,
    TIpcStateStrict,
    TUseSendIpcEventReturnType,
    TUseSendIpcEventStrictReturnType } from "./Event.Types";
import type { FLogger } from "?/Log.Types";
import { GetLogger } from "./Log";
import { UseEffectAsync } from "./Utility";

const Log: FLogger = GetLogger("Event");

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
): Promise<TGetResponseFromKey<T>> =>
{
    type FResponse = TGetResponseFromKey<T>;
    return new Promise<TGetResponseFromKey<T>>(
        (Resolve: TResolveFunction<FResponse>, _Reject: FRejectFunction): void =>
        {
            const Wrapper = (...ArgumentVector: Array<unknown>): void =>
            {
                const Response: FResponse = ArgumentVector[0] as FResponse;

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
    // const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
    //     useRef<FSimpleCallback | undefined>(undefined);

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
        const NewResponse: TGetResponseFromKey<T> = await SendIpcEvent(Channel, Request);
        Log(`Response is ${ JSON.stringify(NewResponse) }.`);
        if (!AbortSignal.aborted)
        {
            SetResponse((_Old: TIpcState<T>): TIpcState<T> =>
            {
                Log("Going to set Response via SetResponse.");
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

/** `SendIpcEvent` wrapped into a hook, with a required argument for a default value for `Data`. */
export const UseSendIpcEventStrict = <T extends keyof FRichFrontendEvents>(
    Channel: T,
    Request: TRequest<T>,
    DefaultData: TGetRichResponseAsSuccess<T>["Data"],
    DependencyArray: Array<unknown> = [ ]
): TUseSendIpcEventStrictReturnType<T> =>
{
    const EmptyResponse: TIpcStateStrict<T> =
    {
        Data: DefaultData,
        Error: undefined
    };

    const [ Response, SetResponse ] = useState<TIpcStateStrict<T>>(EmptyResponse);
    // const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
    //     useRef<FSimpleCallback | undefined>(undefined);

    DependencyArray.push(Request, SetResponse);

    const IsResponseSuccess = (In: TGetRichResponseFromKey<T>): In is TGetRichResponseAsSuccess<T> =>
    {
        return "Data" in In && In.Data !== undefined;
    };

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
    {
        Log("Going to await SendIpcEvent");
        const NewResponse: TGetRichResponseFromKey<T> =
            (await SendIpcEvent(Channel, Request)) as TGetRichResponseFromKey<T>;
        Log(`Response is ${ JSON.stringify(NewResponse) }.`);
        if (!AbortSignal.aborted)
        {
            if (IsResponseSuccess(NewResponse))
            {
                SetResponse((_Old: TIpcStateStrict<T>): TIpcStateStrict<T> =>
                {
                    return NewResponse;
                });
            }
            else
            {
                const NewResponseFailure: TGetRichResponseAsFailure<T> = NewResponse;

                SetResponse((_Old: TIpcStateStrict<T>): TIpcStateStrict<T> =>
                {
                    return {
                        Data: EmptyResponse.Data,
                        Error: NewResponseFailure.Error
                    };
                });
            }
        }
    }, [ Channel, Request, SendIpcEvent, SetResponse ]);

    UseEffectAsync(SideEffect, undefined, DependencyArray);

    return {
        Data: Response.Data,
        Error: Response.Error
    } as const;
};
