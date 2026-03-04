/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import { AppendDependencyList, UseEffectAsync, UsePromise } from "./Utility";
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
    useMemo,
    useState } from "react";
import type {
    FIpcBackendEvents,
    FIpcEvents,
    FIpcFrontendChannel,
    FRichFrontendEvents,
    TEventCallback,
    TGetDefaultRichResponseData,
    TGetResponse,
    TGetResponseFromKey,
    TGetRichResponseAsFailure,
    TGetRichResponseAsSuccess,
    TGetRichResponseFromKey,
    TRequest } from "../Shared/Event";
import type {
    TIpcState,
    TIpcStateStrict,
    TUseSendIpcEventReturnType,
    TUseSendIpcEventStrictReturnType } from "./Event.Types";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Log";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("IPC");

/** Receive an event received by Main. */
export const UseIpcEvent = <Type extends keyof FIpcBackendEvents>(
    Channel: Type,
    Callback: TEventCallback<Type>,
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
    const Wrapper = useCallback(async (_Event: unknown, Request: TRequest<Type>): Promise<void> =>
    {
        type FCallback = (ArgumentVector_0: TRequest<Type>) => TGetResponse<FIpcEvents[Type]["Response"]>;
        const Response: Awaited<ReturnType<TEventCallback<Type>>> =
            await CallMaybeAsync(
                Callback as unknown as FCallback,
                Request
            ) as Awaited<ReturnType<TEventCallback<Type>>>;
            // await (async (): Promise<ReturnType<TEventCallback<Type>>> =>
            // {
            //     return (Callback instanceof Promise)
            //         ? await Callback(Request) as Awaited<ReturnType<TEventCallback<Type>>>
            //         : Callback(Request) as Awaited<ReturnType<TEventCallback<Type>>>;
            // })() as Awaited<ReturnType<TEventCallback<Type>>>;

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
export const SendIpcEvent = <Type extends FIpcFrontendChannel>(
    Channel: Type,
    Request: TRequest<Type>,
    RemoveListenerRef?: MutableRefObject<FSimpleCallback | undefined>
): Promise<TGetResponseFromKey<Type>> =>
{
    type FResponse = TGetResponseFromKey<Type>;
    return new Promise<TGetResponseFromKey<Type>>(
        (Resolve: TResolveFunction<FResponse>, _Reject: FRejectFunction): void =>
        {
            const Wrapper = (...ArgumentVector: TArray<unknown>): void =>
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

export const MakeSendIpcEventCallback = <EventChannel extends FIpcFrontendChannel>(
    Channel: EventChannel,
    Request: TRequest<EventChannel>
): FSimpleCallback =>
{
    return (): void =>
    {
        SendIpcEvent(Channel, Request);
    };
};

/** `SendIpcEvent` wrapped into a hook. */
export const UseSendIpcEvent = <
    Type extends FIpcFrontendChannel,
    OnResponseReturnType = unknown>(
    Channel: Type,
    Request: TRequest<Type>,
    OnResponse?: ((Response: TIpcState<Type>) => OnResponseReturnType),
    Catch?: TPromiseCatchFunction
): TUseSendIpcEventReturnType<Type> =>
{
    const EmptyResponse: TIpcState<Type> =
    {
        Data: undefined,
        Error: undefined
    };

    const IpcEventPromise: Promise<TIpcState<Type>> = useMemo(
        (): Promise<TIpcState<Type>> => SendIpcEvent(Channel, Request),
        [ Channel, Request ]
    );

    const [ Response ] = UsePromise<TIpcState<Type>>(
        IpcEventPromise,
        EmptyResponse,
        OnResponse,
        Catch
    );

    return Response;
};

/* eslint-disable @stylistic/max-len */
// {
//     const EmptyResponse: TIpcState<Type> =
//     {
//         Data: undefined,
//         Error: undefined
//     };

//     // Log("UseSendIpcEvent was called.");

//     /* eslint-disable-next-line @stylistic/max-len */
//     // Log(`UseSendIpcEvent: Channel is ${ Channel }, Request is ${ JSON.stringify(Request) }, DependencyArray is ${ JSON.stringify(DependencyArray) }.`);

//     const [ Response, SetResponse ] = useState<TIpcState<Type>>(EmptyResponse);
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

//     const OtherDependencyArray: TArray<unknown> = [ ...DependencyArray, CleanupFunction ];

//     /* eslint-disable-next-line @typescript-eslint/typedef */
//     const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
//     {
//         // Log(`Going to await SendIpcEvent for event ${ Channel }.`);
//         const NewResponse: TGetResponseFromKey<Type> = await SendIpcEvent(Channel, Request);
//         // Log(`Response is ${ JSON.stringify(NewResponse) }.`);
//         if (!AbortSignal.aborted)
//         {
//             SetResponse((_Old: TIpcState<Type>): TIpcState<Type> =>
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
export const UseSendIpcEventStrict = <Type extends keyof FRichFrontendEvents>(
    Channel: Type,
    Request: TRequest<Type>,
    DefaultData: TGetDefaultRichResponseData<Type>,
    DependencyArray: TArray<unknown> = [ ]
): TUseSendIpcEventStrictReturnType<Type> =>
{
    // const Result: TIpcState<Type> = UseSendIpcEvent(Channel, Request);

    // if (Result.Data === undefined && Result.Error === undefined)
    // {
    //     return {
    //         Data: DefaultData,
    //         Error: undefined
    //     };
    // }
    // else
    // {
    //     return Result as TUseSendIpcEventStrictReturnType<Type>;
    // }

    const EmptyResponse: TIpcStateStrict<Type> =
    {
        Data: DefaultData,
        Error: undefined
    };

    const [ Response, SetResponse ] = useState<TIpcStateStrict<Type>>(EmptyResponse);
    // const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
    //     useRef<FSimpleCallback | undefined>(undefined);

    DependencyArray.push(Request, SetResponse);

    const IsResponseSuccess = (In: TGetRichResponseFromKey<Type>): In is TGetRichResponseAsSuccess<Type> =>
    {
        return "Data" in In && In.Data !== undefined;
    };

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
    {
        // Log(`Going to await SendIpcEvent for event ${ Channel }.`);
        const NewResponse: TGetRichResponseFromKey<Type> =
            (await SendIpcEvent(Channel, Request)) as TGetRichResponseFromKey<Type>;

        // Log(`Response is ${ JSON.stringify(NewResponse) }.`);
        if (!AbortSignal.aborted)
        {
            if (IsResponseSuccess(NewResponse))
            {
                // Log(`Event ${ Channel } responded successfully!`);
                SetResponse((_Old: TIpcStateStrict<Type>): TIpcStateStrict<Type> =>
                {
                    return NewResponse;
                });
            }
            else
            {
                const NewResponseFailure: TGetRichResponseAsFailure<Type> = NewResponse;

                // Log(`Event ${ Channel } responded as a FAILURE!`);
                SetResponse((_Old: TIpcStateStrict<Type>): TIpcStateStrict<Type> =>
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

// /**
//  * This is the hook that is intended to be used most often, since most events
//  * are expected to be rich and only contain a single argument.
//  *
//  * This hook wraps `UseSendIpcEventSingle` to provide a more React-style signature.
//  */
// export const UseSendIpcEventStrictSingle = <Type extends FSingleRichFrontendChannels>(
//     Channel: Type,
//     Request: TRequest<Type>,
//     DefaultData: TGetDefaultRichResponseData<Type>,
//     DependencyArray: TArray<unknown> = [ ]
// ): TUseSendIpcEventStrictSingleReturnType<Type> =>
// {
//     const { Data, Error } = UseSendIpcEventStrict(Channel, Request, DefaultData, DependencyArray);
//     const DataKeys: TArray<PropertyKey> = Object.keys(Data);
//     const ZerothDataProperty: TGetSingleRichResponseData<Type> =
//         (Data[DataKeys[0] as keyof typeof Data] as TGetSingleRichResponseData<Type>);

//     return [ ZerothDataProperty, Error ] as const;
// };
