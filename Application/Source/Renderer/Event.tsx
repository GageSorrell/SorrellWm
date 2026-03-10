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
    type Context,
    type DependencyList,
    type EffectCallback,
    type MutableRefObject,
    type PropsWithChildren,
    type ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState } from "react";
import type {
    FBackendChannelTagged,
    FBackendChannelTagger,
    FFrontendChannelTagged,
    FFrontendChannelTagger,
    FIpcBackendChannel,
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
    FSendIpcEvent,
    FSendIpcEventCallback,
    TIpcState,
    TIpcStateStrict,
    TUseSendIpcEventReturnType,
    TUseSendIpcEventStrictReturnType } from "./Event.Types";
import { MakeTagBackend, MakeTagFrontend } from "../Shared/Event/Event";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Log";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("IPC");

/** Receive an event received by Main. */
export const UseIpcEvent = <ChannelType extends keyof FIpcBackendEvents>(
    Channel: ChannelType,
    Callback: TEventCallback<ChannelType>,
    DependencyArray: DependencyList = [ ]
): void =>
{

    const { TagBackend } = UseTaggers();

    const ChannelTagged: FBackendChannelTagged | undefined = TagBackend(Channel);

    const PrincipalDependencyArray: DependencyList = AppendDependencyList(
        DependencyArray,
        Callback,
        ChannelTagged,
        window.electron
    );

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const Wrapper = useCallback(async (_Event: unknown, Request: TRequest<ChannelType>): Promise<void> =>
    {
        type FCallback =
            (ArgumentVector: TRequest<ChannelType>) => TGetResponse<FIpcEvents[ChannelType]["Response"]>;

        const Response: Awaited<ReturnType<TEventCallback<ChannelType>>> =
            await CallMaybeAsync(
                Callback as unknown as FCallback,
                Request
            ) as Awaited<ReturnType<TEventCallback<ChannelType>>>;
            // await (async (): Promise<ReturnType<TEventCallback<Type>>> =>
            // {
            //     return (Callback instanceof Promise)
            //         ? await Callback(Request) as Awaited<ReturnType<TEventCallback<Type>>>
            //         : Callback(Request) as Awaited<ReturnType<TEventCallback<Type>>>;
            // })() as Awaited<ReturnType<TEventCallback<Type>>>;
        if (ChannelTagged !== undefined)
        {
            window.electron.ipcRenderer.Send(ChannelTagged, Response);
        }

    }, PrincipalDependencyArray);

    const DependencyListWithWrapper: DependencyList = AppendDependencyList(PrincipalDependencyArray, Wrapper);

    useEffect((): ReturnType<EffectCallback> =>
    {
        if (ChannelTagged !== undefined)
        {
            return window.electron.ipcRenderer.On(ChannelTagged, Wrapper);
        }
    }, DependencyListWithWrapper);
};

/**
 * Send an event to Main.
 * @TODO Find a better name for this.
 *
 * @param Channel - The IPC channel.
 * @param Request - The payload sent with the event.
 * @param RemoveListenerRef - A reference to a function that makes
 *        the relevant call to `ipcRenderer.removeListener`; it is
 *        unset just before the promise resolves.
 */
export const UseSendIpcEventDeferred = (): Readonly<[ FSendIpcEvent ]> =>
{
    const { TagFrontend } = UseTaggers();

    const SendIpcEvent: FSendIpcEvent = useCallback(<ChannelType extends FIpcFrontendChannel>(
        Channel: ChannelType,
        Request: TRequest<ChannelType>,
        RemoveListenerRef?: MutableRefObject<FSimpleCallback | undefined>
    ): Promise<TIpcState<ChannelType>> =>
    {
        type FResponse = TGetResponseFromKey<ChannelType>;

        const ChannelTagged: FFrontendChannelTagged | undefined = TagFrontend(Channel);

        return new Promise<TGetResponseFromKey<ChannelType>>(
            (Resolve: TResolveFunction<FResponse>, _Reject: FRejectFunction): void =>
            {
                if (ChannelTagged !== undefined)
                {
                    const Wrapper = (...ArgumentVector: TArray<unknown>): void =>
                    {
                        const Response: FResponse = ArgumentVector[0] as FResponse;

                        if (RemoveListenerRef?.current !== undefined)
                        {
                            RemoveListenerRef.current = undefined;
                        }

                        /* eslint-disable-next-line @stylistic/max-len */
                        // Log(`Resolving promise in SendIpcEvent, Response is ${ JSON.stringify(Response) }.`);

                        Resolve(Response);
                    };

                    if (RemoveListenerRef !== undefined)
                    {
                        RemoveListenerRef.current = (): void =>
                        {
                            window.electron.ipcRenderer.RemoveListener(ChannelTagged, Wrapper);
                        };
                    }

                    /* eslint-disable-next-line @stylistic/max-len */
                    Log(`UseSendIpcEventDeferred: ChannelTagged == ${ ChannelTagged }.`);

                    window.electron.ipcRenderer.Once(ChannelTagged, Wrapper);
                    window.electron.ipcRenderer.Send(ChannelTagged, Request);
                }
            });
    }, [ TagFrontend ]);

    return [ SendIpcEvent ] as const;
};

export const UseSendIpcEventDeferredCallback = (): Readonly<[ FSendIpcEventCallback ]> =>
{
    const [ SendIpcEvent ] = UseSendIpcEventDeferred();
    const MakeCallback: FSendIpcEventCallback = useCallback(<ChannelType extends FIpcFrontendChannel>(
        Channel: ChannelType,
        Request: TRequest<ChannelType>
    ): FSimpleCallback =>
    {
        return (): void =>
        {
            SendIpcEvent(Channel, Request);
        };
    }, [ ]);

    return [ MakeCallback ] as const;
};

const UseTaggers = (): Readonly<{
    TagFrontend: FFrontendChannelTagger,
    TagBackend: FBackendChannelTagger
}> =>
{
    const { TagBackend, TagFrontend } = useContext<CEvent>(EventContext);
    return { TagBackend, TagFrontend } as const;
};

/** `SendIpcEvent` wrapped into a hook. */
export const UseSendIpcEvent = <
    ChannelType extends FIpcFrontendChannel,
    OnResponseReturnType = unknown>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>,
    OnResponse?: ((Response: TIpcState<ChannelType> | undefined) => OnResponseReturnType),
    Catch?: TPromiseCatchFunction
): TUseSendIpcEventReturnType<ChannelType> =>
{
    const EmptyResponse: TIpcState<ChannelType> =
    {
        Data: undefined,
        Error: undefined
    };

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const IpcEventPromise: Promise<TIpcState<ChannelType>> = useMemo(
        (): Promise<TIpcState<ChannelType>> => SendIpcEvent(Channel, Request),
        [ Channel, Request ]
    );

    const [ Response ] = UsePromise<TIpcState<ChannelType>>(
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
export const UseSendIpcEventStrict = <ChannelType extends keyof FRichFrontendEvents>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>,
    DefaultData: TGetDefaultRichResponseData<ChannelType>,
    DependencyArray: TArray<unknown> = [ ]
): TUseSendIpcEventStrictReturnType<ChannelType> =>
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

    const EmptyResponse: TIpcStateStrict<ChannelType> =
    {
        Data: DefaultData,
        Error: undefined
    };

    const [ Response, SetResponse ] = useState<TIpcStateStrict<ChannelType>>(EmptyResponse);
    // const RemoveListenerRef: MutableRefObject<FSimpleCallback | undefined> =
    //     useRef<FSimpleCallback | undefined>(undefined);

    DependencyArray.push(Request, SetResponse);

    const IsResponseSuccess =
        (In: TGetRichResponseFromKey<ChannelType>): In is TGetRichResponseAsSuccess<ChannelType> =>
        {
            return "Data" in In && In.Data !== undefined;
        };

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SideEffect = useCallback(async (AbortSignal: AbortSignal): Promise<void> =>
    {
        // Log(`Going to await SendIpcEvent for event ${ Channel }.`);
        const NewResponse: TGetRichResponseFromKey<ChannelType> =
            (await SendIpcEvent(Channel, Request)) as TGetRichResponseFromKey<ChannelType>;

        // Log(`Response is ${ JSON.stringify(NewResponse) }.`);
        if (!AbortSignal.aborted)
        {
            if (IsResponseSuccess(NewResponse))
            {
                // Log(`Event ${ Channel } responded successfully!`);
                SetResponse((_Old: TIpcStateStrict<ChannelType>): TIpcStateStrict<ChannelType> =>
                {
                    return NewResponse;
                });
            }
            else
            {
                const NewResponseFailure: TGetRichResponseAsFailure<ChannelType> = NewResponse;

                // Log(`Event ${ Channel } responded as a FAILURE!`);
                SetResponse((_Old: TIpcStateStrict<ChannelType>): TIpcStateStrict<ChannelType> =>
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

type CEvent =
{
    Id: number | undefined;
    TagBackend: FBackendChannelTagger;
    TagFrontend: FFrontendChannelTagger;
};

const EmptyEventContext: CEvent =
{
    Id: undefined,
    TagBackend: (_Channel: FIpcBackendChannel) => undefined,
    TagFrontend: (_Channel: FIpcFrontendChannel) => undefined
};

const EventContext: Context<CEvent> = createContext<CEvent>(EmptyEventContext);

export const EventProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ Id ] = UsePromise<number | undefined>(
        window.electron.ipcRenderer.GetId(),
        undefined
    );

    Log(`EventProvider: Id == ${ Id }.`);

    const TagBackend: FBackendChannelTagger =
        useCallback((Channel: FIpcBackendChannel): FBackendChannelTagged | undefined =>
        {
            return MakeTagBackend(Id)(Channel);
        }, [ Id ]);

    const TagFrontend: FFrontendChannelTagger =
        useCallback((Channel: FIpcFrontendChannel): FFrontendChannelTagged | undefined =>
        {
            return MakeTagFrontend(Id)(Channel);
        }, [ Id ]);

    const value: CEvent =
    {
        Id,
        TagBackend,
        TagFrontend
    };
    return (
        <EventContext.Provider { ...{ value } }>
            { children }
        </EventContext.Provider>
    );
};
