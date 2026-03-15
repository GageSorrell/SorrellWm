/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import { AppendDependencyList, UseEffectAsync, UsePromise } from "./Utility";
import type {
    CEvent,
    FSendIpcEvent,
    FSendIpcEventCallback,
    TGetRichIpcStateAsFailure,
    TGetRichIpcStateAsSuccess,
    TIpcState,
    TIpcStateStrict,
    TUseSendIpcEventReturnType,
    TUseSendIpcEventStrictReturnType } from "./Event.Types";
import {
    CallMaybeAsync,
    type FRejectFunction,
    type FSimpleCallback,
    type TResolveFunction } from "../Shared/Utility";
import {
    type Context,
    type DependencyList,
    type EffectCallback,
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
    TRequest } from "../Shared/Event";
import { MakeTagBackend, MakeTagFrontend } from "../Shared/Event/Event";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Log";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("IPC");

export const IsFailure = <ChannelType extends FIpcFrontendChannel>(
    { Error, IsPending }: TIpcState<ChannelType>
): boolean =>
{
    return Error !== undefined && !IsPending;
};

export const IsSuccessful = <ChannelType extends FIpcFrontendChannel>(
    { Error, IsPending }: TIpcState<ChannelType>
): boolean =>
{
    return Error === undefined && !IsPending;
};

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
        Request: TRequest<ChannelType>
    ): Promise<TIpcState<ChannelType>> =>
    {
        type FResponse = TIpcState<ChannelType>;

        const ChannelTagged: FFrontendChannelTagged | undefined = TagFrontend(Channel);

        return new Promise<FResponse>(
            (Resolve: TResolveFunction<FResponse>, _Reject: FRejectFunction): void =>
            {
                if (ChannelTagged !== undefined)
                {
                    const Wrapper = (...ArgumentVector: TArray<unknown>): void =>
                    {
                        const Response: FResponse = {
                            ...(ArgumentVector[0] as Omit<FResponse, "IsPending">),
                            IsPending: false
                        };

                        Resolve(Response);
                    };

                    // Log(`UseSendIpcEventDeferred: ChannelTagged == ${ ChannelTagged }.`);

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
    /* eslint-disable-next-line @stylistic/max-len */
    const { TagBackend, TagFrontend } = useContext<CEvent>(EventContext).INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    return { TagBackend, TagFrontend } as const;
};

/** `SendIpcEvent` wrapped into a hook. */
export const UseSendIpcEvent = <ChannelType extends FIpcFrontendChannel>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>
): TUseSendIpcEventReturnType<ChannelType> =>
{
    const EmptyResponse: TIpcState<ChannelType> =
    {
        Data: undefined,
        Error: undefined,
        IsPending: true
    };

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const IpcEventPromise: Promise<TIpcState<ChannelType>> = useMemo(
        (): Promise<TIpcState<ChannelType>> => SendIpcEvent(Channel, Request),
        [ Channel, Request ]
    );

    const [ Response ] = UsePromise<TIpcState<ChannelType>>(
        IpcEventPromise,
        EmptyResponse
    );

    return Response;
};

/** `SendIpcEvent` wrapped into a hook, with the ability to specify a default value for `Data`. */
export const UseSendIpcEventStrict = <ChannelType extends keyof FRichFrontendEvents>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>,
    DefaultData: TGetDefaultRichResponseData<ChannelType>,
    DependencyArray: TArray<unknown> = [ ]
): TUseSendIpcEventStrictReturnType<ChannelType> =>
{
    const EmptyResponse: TIpcStateStrict<ChannelType> =
    {
        Data: DefaultData,
        Error: undefined,
        IsPending: true
    };

    const [ Response, SetResponse ] = useState<TIpcStateStrict<ChannelType>>(EmptyResponse);

    DependencyArray.push(Request, SetResponse);

    const IsResponseSuccess =
        (In: TIpcState<ChannelType>): In is TGetRichIpcStateAsSuccess<ChannelType> =>
        {
            return "Data" in In && In.Data !== undefined && "IsPending" in In && !In.IsPending;
        };

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const SideEffect: (() => Promise<void>) = useCallback(async (): Promise<void> =>
    {
        // Log(`Going to await SendIpcEvent for event ${ Channel }.`);
        const NewResponse: TIpcState<ChannelType> = await SendIpcEvent(Channel, Request);

        // Log(`Response is ${ JSON.stringify(NewResponse) }.`);
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
            const NewResponseFailure: TGetRichIpcStateAsFailure<ChannelType> =
                NewResponse as TGetRichIpcStateAsFailure<ChannelType>;

            // Log(`Event ${ Channel } responded as a FAILURE!`);
            SetResponse((_Old: TIpcStateStrict<ChannelType>): TIpcStateStrict<ChannelType> =>
            {
                return {
                    Data: EmptyResponse.Data,
                    Error: NewResponseFailure.Error,
                    IsPending: false
                };
            });
        }
    }, [ Channel, Request, SendIpcEvent, SetResponse ]);

    UseEffectAsync(SideEffect, undefined, DependencyArray);

    return {
        Data: Response.Data,
        Error: Response.Error,
        IsPending: Response.IsPending
    } as const;
};

const EmptyEventContext: CEvent =
{
    INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:
    {
        Id: undefined,
        TagBackend: (_Channel: FIpcBackendChannel) => undefined,
        TagFrontend: (_Channel: FIpcFrontendChannel) => undefined
    }
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
        INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:
        {
            Id,
            TagBackend,
            TagFrontend
        }
    };
    return (
        <EventContext.Provider { ...{ value } }>
            { children }
        </EventContext.Provider>
    );
};
