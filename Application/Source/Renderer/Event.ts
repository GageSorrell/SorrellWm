/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import { AppendDependencyList, UsePromise } from "./Utility";
import {
    CallMaybeAsync,
    type FRejectFunction,
    type FSimpleCallback,
    type TPromiseCatchFunction,
    type TResolveFunction } from "../Shared/Utility";
import {
    type DependencyList,
    type MutableRefObject,
    useCallback,
    useEffect,
    useMemo } from "react";
import type {
    FIpcBackendEvents,
    FIpcEvents,
    FIpcFrontendChannel,
    FRichFrontendEvents,
    FSingleRichFrontendChannels,
    TEventCallback,
    TGetDefaultRichResponseData,
    TGetResponse,
    TGetResponseFromKey,
    TGetSingleRichResponseData,
    TRequest } from "../Shared/Event";
import type {
    TIpcState,
    TUseSendIpcEventReturnType,
    TUseSendIpcEventStrictReturnType,
    TUseSendIpcEventStrictSingleReturnType } from "./Event.Types";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Log";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("IPC");

/** Receive an event received by Main. */
export const UseIpcEvent = <T extends keyof FIpcBackendEvents>(
    Channel: T,
    Callback: TEventCallback<T>,
    DependencyArray: DependencyList = [ ]
): void =>
{
    const PrincipalDependencyArray: DependencyList = AppendDependencyList(
        DependencyArray,
        Callback,
        Channel,
        window.electron
    );

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const Wrapper = useCallback(async (_Event: unknown, Request: TRequest<T>): Promise<void> =>
    {
        type FCallback = (ArgumentVector_0: TRequest<T>) => TGetResponse<FIpcEvents[T]["Response"]>;
        const Response: Awaited<ReturnType<TEventCallback<T>>> =
            await CallMaybeAsync(
                Callback as unknown as FCallback,
                Request
            ) as Awaited<ReturnType<TEventCallback<T>>>;
            // await (async (): Promise<ReturnType<TEventCallback<T>>> =>
            // {
            //     return (Callback instanceof Promise)
            //         ? await Callback(Request) as Awaited<ReturnType<TEventCallback<T>>>
            //         : Callback(Request) as Awaited<ReturnType<TEventCallback<T>>>;
            // })() as Awaited<ReturnType<TEventCallback<T>>>;

        window.electron.ipcRenderer.Send(Channel, Response);
    }, PrincipalDependencyArray);

    const DependencyListWithWrapper: DependencyList = AppendDependencyList(PrincipalDependencyArray, Wrapper);

    useEffect((): FSimpleCallback =>
    {
        return window.electron.ipcRenderer.On(Channel, Wrapper);
    }, DependencyListWithWrapper);
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

                // Log(`Resolving promise in SendIpcEvent, Response is ${ JSON.stringify(Response) }.`);

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
export const UseSendIpcEvent = <
    T extends FIpcFrontendChannel,
    OnResponseReturnType  = unknown>(
    Channel: T,
    Request: TRequest<T>,
    OnResponse?: ((Response: TIpcState<T>) => OnResponseReturnType),
    Catch?: TPromiseCatchFunction
): TUseSendIpcEventReturnType<T> =>
{
    const EmptyResponse: TIpcState<T> =
    {
        Data: undefined,
        Error: undefined
    };

    const IpcEventPromise: Promise<TIpcState<T>> = useMemo(
        (): Promise<TIpcState<T>> => SendIpcEvent(Channel, Request),
        [ Channel, Request ]
    );

    const [ Response ] = UsePromise<TIpcState<T>>(
        IpcEventPromise,
        EmptyResponse,
        OnResponse,
        Catch
    );

    return Response;
};

/* eslint-disable @stylistic/max-len */
// {
//     const EmptyResponse: TIpcState<T> =
//     {
//         Data: undefined,
//         Error: undefined
//     };

//     // Log("UseSendIpcEvent was called.");

//     /* eslint-disable-next-line @stylistic/max-len */
//     // Log(`UseSendIpcEvent: Channel is ${ Channel }, Request is ${ JSON.stringify(Request) }, DependencyArray is ${ JSON.stringify(DependencyArray) }.`);

//     const [ Response, SetResponse ] = useState<TIpcState<T>>(EmptyResponse);
//     // const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
//     //     useRef<FSimpleCallback | undefined>(undefined);

//     DependencyArray.push(Request, SetResponse);

//     /* eslint-disable-next-line @typescript-eslint/typedef */
//     const CleanupFunction = useCallback((): void =>
//     {
//         // if (RemoveListenerRef.current !== undefined)
//         // {
//         //     RemoveListenerRef.current();
//         // }
//     }, DependencyArray);

//     const OtherDependencyArray: Array<unknown> = [ ...DependencyArray, CleanupFunction ];

//     /* eslint-disable-next-line @typescript-eslint/typedef */
//     const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
//     {
//         // Log(`Going to await SendIpcEvent for event ${ Channel }.`);
//         const NewResponse: TGetResponseFromKey<T> = await SendIpcEvent(Channel, Request);
//         // Log(`Response is ${ JSON.stringify(NewResponse) }.`);
//         if (!AbortSignal.aborted)
//         {
//             SetResponse((_Old: TIpcState<T>): TIpcState<T> =>
//             {
//                 // Log("Going to set Response via SetResponse.");
//                 return NewResponse;
//             });
//         }
//     }, [ Channel, Request, SendIpcEvent, SetResponse ]);

//     UseEffectAsync(SideEffect, CleanupFunction, OtherDependencyArray);

//     return {
//         Data: (Response?.Data === undefined ? undefined : Response.Data),
//         Error: (Response?.Error === undefined ? undefined : Response.Error)
//     } as const;
// };
/* eslint-enable @stylistic/max-len */

/** `SendIpcEvent` wrapped into a hook, with a required argument for a default value for `Data`. */
export const UseSendIpcEventStrict = <T extends keyof FRichFrontendEvents>(
    Channel: T,
    Request: TRequest<T>,
    DefaultData: TGetDefaultRichResponseData<T>
): TUseSendIpcEventStrictReturnType<T> =>
{
    const Result: TIpcState<T> = UseSendIpcEvent(Channel, Request);

    if (Result.Data === undefined && Result.Error === undefined)
    {
        return {
            Data: DefaultData,
            Error: undefined
        };
    }
    else
    {
        return Result as TUseSendIpcEventStrictReturnType<T>;
    }

    // const EmptyResponse: TIpcStateStrict<T> =
    // {
    //     Data: DefaultData,
    //     Error: undefined
    // };

    // const [ Response, SetResponse ] = useState<TIpcStateStrict<T>>(EmptyResponse);
    // // const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
    // //     useRef<FSimpleCallback | undefined>(undefined);

    // DependencyArray.push(Request, SetResponse);

    // const IsResponseSuccess = (In: TGetRichResponseFromKey<T>): In is TGetRichResponseAsSuccess<T> =>
    // {
    //     return "Data" in In && In.Data !== undefined;
    // };

    // /* eslint-disable-next-line @typescript-eslint/typedef */
    // const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
    // {
    //     // Log(`Going to await SendIpcEvent for event ${ Channel }.`);
    //     const NewResponse: TGetRichResponseFromKey<T> =
    //         (await SendIpcEvent(Channel, Request)) as TGetRichResponseFromKey<T>;

    //     // Log(`Response is ${ JSON.stringify(NewResponse) }.`);
    //     if (!AbortSignal.aborted)
    //     {
    //         if (IsResponseSuccess(NewResponse))
    //         {
    //             // Log(`Event ${ Channel } responded successfully!`);
    //             SetResponse((_Old: TIpcStateStrict<T>): TIpcStateStrict<T> =>
    //             {
    //                 return NewResponse;
    //             });
    //         }
    //         else
    //         {
    //             const NewResponseFailure: TGetRichResponseAsFailure<T> = NewResponse;

    //             // Log(`Event ${ Channel } responded as a FAILURE!`);
    //             SetResponse((_Old: TIpcStateStrict<T>): TIpcStateStrict<T> =>
    //             {
    //                 return {
    //                     Data: EmptyResponse.Data,
    //                     Error: NewResponseFailure.Error
    //                 };
    //             });
    //         }
    //     }
    // }, [ Channel, Request, SendIpcEvent, SetResponse ]);

    // UseEffectAsync(SideEffect, undefined, DependencyArray);

    // return {
    //     Data: Response.Data,
    //     Error: Response.Error
    // } as const;
};

/**
 * This is the hook that is intended to be used most often, since most events
 * are expected to be rich and only contain a single argument.
 *
 * This hook wraps `UseSendIpcEventSingle` to provide a more React-style signature.
 */
export const UseSendIpcEventStrictSingle = <T extends FSingleRichFrontendChannels>(
    Channel: T,
    Request: TRequest<T>,
    DefaultData: TGetDefaultRichResponseData<T>,
    DependencyArray: Array<unknown> = [ ]
): TUseSendIpcEventStrictSingleReturnType<T> =>
{
    const { Data, Error } = UseSendIpcEventStrict(Channel, Request, DefaultData, DependencyArray);
    const DataKeys: Array<PropertyKey> = Object.keys(Data);
    const ZerothDataProperty: TGetSingleRichResponseData<T> =
        (Data[DataKeys[0] as keyof typeof Data] as TGetSingleRichResponseData<T>);

    return [ ZerothDataProperty, Error ] as const;
};
