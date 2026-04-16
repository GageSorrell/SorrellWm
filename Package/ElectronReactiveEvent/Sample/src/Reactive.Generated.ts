/**
 * File:   Reactive.Types.Generated.ts
 * Author: `electron-reactive-event-cli`
 *
 * ********************************************
 *
 * Generated with the generate command.
 * Regenerate this file by running,
 *
 *    `npm exec electron-reactive-event generate-scoped-types`
 *
 * in this directory.
 *
 */

/* eslint-disable */

import type {
    AnyCallback as AnyCallbackImported,
    EventOwner as EventOwnerImported,
    EventRequest as EventRequestImported,
    Handle as HandleImported,
    HandleOnce as HandleOnceImported,
    Handler as HandlerImported,
    HandlerNoRequest as HandlerNoRequestImported,
    HandlerRequest as HandlerRequestImported,
    HandlerWithRequest as HandlerWithRequestImported,
    InvokeEventDeferred as InvokeEventDeferredImported,
    InvokeResponse as InvokeResponseImported,
    IpcMainReactive as IpcMainReactiveImported,
    Listener as ListenerImported,
    ListenerRequest as ListenerRequestImported,
    ListenerWithRequest as ListenerWithRequestImported,
    MainListener as MainListenerImported,
    MainOwner as MainOwnerImported,
    Off as OffImported,
    OffEventDeferred as OffEventDeferredImported,
    On as OnImported,
    OnEventDeferred as OnEventDeferredImported,
    Once as OnceImported,
    OnceEventDeferred as OnceEventDeferredImported,
    RawResponse as RawResponseImported,
    RawResponseError as RawResponseErrorImported,
    RawResponseSuccess as RawResponseSuccessImported,
    ReactiveEventErrorData as ReactiveEventErrorDataImported,
    ReactiveEventHooks as ReactiveEventHooksImported,
    ReactiveIpcFunctions as ReactiveIpcFunctionsImported,
    RemoveAllListeners as RemoveAllListenersImported,
    RemoveHandler as RemoveHandlerImported,
    RendererListener as RendererListenerImported,
    RendererOwner as RendererOwnerImported,
    Response as ResponseImported,
    ResponseError as ResponseErrorImported,
    ResultSettled as ResponseSettledImported,
    ResponseSuccess as ResponseSuccessImported,
    ResponseSync as ResponseSyncImported,
    Send as SendImported,
    SendEventDeferred as SendEventDeferredImported,
    SendableEventHandler as SendableEventHandlerImported,
    UseInvokeEvent as UseInvokeEventImported,
    UseInvokeEventDeferred as UseInvokeEventDeferredImported,
    UseOffEventDeferred as UseOffEventDeferredImported,
    UseOnEvent as UseOnEventImported,
    UseOnEventDeferred as UseOnEventDeferredImported,
    UseOnceEvent as UseOnceEventImported,
    UseOnceEventDeferred as UseOnceEventDeferredImported,
    UseSendEvent as UseSendEventImported,
    UseSendEventDeferred as UseSendEventDeferredImported,
    Channel as ChannelImported,
    ReactiveEventErrorFunction as ReactiveEventErrorFunctionImported
} from "electron-reactive-event/scoped";

import type { InvokeOptions } from "electron-reactive-event";

import { ReactiveEventError as ReactiveEventErrorImported } from "electron-reactive-event/scoped";
export type {
    EmptyEventParameter,
    EventDecl,
    EventErrorAdvancedDecl,
    EventErrorAdvancedDeclParameter,
    EventErrorDecl,
    EventErrorRecord,
    EventErrorTuple,
    EventOwner,
    ListenerNoRequest,
    MainOwner,
    ReactiveEventContext,
    ReactiveEventProviderProps,
    RendererOwner,
    ResponseIndeterminate
} from "electron-reactive-event/scoped";

export type PackageKey = "electronreactiveeventsample";

export const ReactiveEventError = ReactiveEventErrorImported as ReactiveEventErrorFunctionImported<PackageKey>;

export namespace Channel
{
    export type Any<OwnerType extends EventOwnerImported> = ChannelImported.Any<PackageKey, OwnerType>;

    export type Error = ChannelImported.Error<PackageKey>;

    export type ErrorMessageOnly = ChannelImported.ErrorMessageOnly<PackageKey>;

    export type ErrorPayload = ChannelImported.ErrorPayload<PackageKey>;

    export type NoError<OwnerType extends EventOwnerImported> = ChannelImported.NoError<PackageKey, OwnerType>;

    export type NoResponse<OwnerType extends EventOwnerImported> = ChannelImported.NoResponse<PackageKey, OwnerType>;

    export type Response = ChannelImported.Response<PackageKey>;

    export type NoRequest<OwnerType extends EventOwnerImported> = ChannelImported.NoRequest<PackageKey, OwnerType>;

    export type Request<OwnerType extends EventOwnerImported> = ChannelImported.Request<PackageKey, OwnerType>;

    export namespace Handler
    {
        export type Any = ChannelImported.Handler.Any<PackageKey>;
        export type Request = ChannelImported.Handler.Request<PackageKey>;
        export type Response = ChannelImported.Handler.Response<PackageKey>;
        export type NoRequest = ChannelImported.Handler.NoRequest<PackageKey>;
        export type NoResponse = ChannelImported.Handler.NoResponse<PackageKey>;
        export type Error = ChannelImported.Handler.Error<PackageKey>;
        export type ErrorMessageOnly = ChannelImported.Handler.ErrorMessageOnly<PackageKey>;
        export type ErrorPayload = ChannelImported.Handler.ErrorPayload<PackageKey>;
        export type NoError = ChannelImported.Handler.NoError<PackageKey>;
    };

    export namespace Listener
    {
        export type Any<OwnerType extends EventOwnerImported> = ChannelImported.Listener.Any<PackageKey, OwnerType>;
        export type NoRequest<OwnerType extends EventOwnerImported> = ChannelImported.Listener.NoRequest<PackageKey, OwnerType>;
        export type Request<OwnerType extends EventOwnerImported> = ChannelImported.Listener.Request<PackageKey, OwnerType>;
    };
};

export type AnyCallback<OwnerType extends EventOwnerImported, ChannelType extends Channel.Any<OwnerType>> = AnyCallbackImported<PackageKey, OwnerType, ChannelType>;
export type EventRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Request<OwnerType>> = EventRequestImported<PackageKey, OwnerType, ChannelType>;
export type Handle = HandleImported<PackageKey>;
export type HandleOnce = HandleOnceImported<PackageKey>;
export type Handler<ChannelType extends Channel.Handler.Any> = HandlerImported<PackageKey, ChannelType>;
export type HandlerNoRequest<ChannelType extends Channel.Handler.NoRequest> = HandlerNoRequestImported<PackageKey, ChannelType>;
export type HandlerRequest<ChannelType extends Channel.Handler.Request> = HandlerRequestImported<PackageKey, ChannelType>;
export type HandlerWithRequest<ChannelType extends Channel.Handler.Request> = HandlerWithRequestImported<PackageKey, ChannelType>;
export type InvokeEventDeferred = InvokeEventDeferredImported<PackageKey>;
export type InvokeResponse<ChannelType extends Channel.Handler.Any, OptionsType extends InvokeOptions | undefined> = InvokeResponseImported<PackageKey, ChannelType, OptionsType>;
export type IpcMainReactive = IpcMainReactiveImported<PackageKey>;
export type Listener<OwnerType extends EventOwnerImported, ChannelType extends Channel.Listener.Any<OwnerType>> = ListenerImported<PackageKey, OwnerType, ChannelType>;
export type ListenerRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Request<OwnerType>> = ListenerRequestImported<PackageKey, OwnerType, ChannelType>;
export type ListenerWithRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Listener.Request<OwnerType>> = ListenerWithRequestImported<PackageKey, OwnerType, ChannelType>;
export type MainListener<ChannelType extends Channel.Listener.Any<RendererOwnerImported>> = MainListenerImported<PackageKey, ChannelType>;
export type Off = OffImported<PackageKey>;
export type OffEventDeferred = OffEventDeferredImported<PackageKey>;
export type On = OnImported<PackageKey>;
export type OnEventDeferred = OnEventDeferredImported<PackageKey>;
export type Once = OnceImported<PackageKey>;
export type OnceEventDeferred = OnceEventDeferredImported<PackageKey>;
export type RawResponse<ChannelType extends Channel.Handler.Any> = RawResponseImported<PackageKey, ChannelType>;
export type RawResponseError<ChannelType extends Channel.Handler.Any> = RawResponseErrorImported<PackageKey, ChannelType>;
export type RawResponseSuccess<ChannelType extends Channel.Handler.Any> = RawResponseSuccessImported<PackageKey, ChannelType>;
export type ReactiveEventErrorData<ChannelType extends Channel.Error> = ReactiveEventErrorDataImported<PackageKey, ChannelType>;
export type ReactiveEventHooks = ReactiveEventHooksImported<PackageKey>;
export type ReactiveIpcFunctions = ReactiveIpcFunctionsImported<PackageKey>;
export type RemoveAllListeners = RemoveAllListenersImported<PackageKey>;
export type RemoveHandler = RemoveHandlerImported<PackageKey>;
export type RendererListener<ChannelType extends Channel.Listener.Any<MainOwnerImported>> = RendererListenerImported<PackageKey, ChannelType>;
export type Response<ChannelType extends Channel.Handler.Any> = ResponseImported<PackageKey, ChannelType>;
export type ResponseError<ChannelType extends Channel.Handler.Error> = ResponseErrorImported<PackageKey, ChannelType>;
export type ResponseSettled<ChannelType extends Channel.Handler.Any> = ResponseSettledImported<PackageKey, ChannelType>;
export type ResponseSuccess<ChannelType extends Channel.Handler.Response> = ResponseSuccessImported<PackageKey, ChannelType>;
export type ResponseSync<ChannelType extends Channel.Handler.Any> = ResponseSyncImported<PackageKey, ChannelType>;
export type Send = SendImported<PackageKey>;
export type SendEventDeferred = SendEventDeferredImported<PackageKey>;
export type SendableEventHandler = SendableEventHandlerImported<PackageKey>;
export type UseInvokeEvent = UseInvokeEventImported<PackageKey>;
export type UseInvokeEventDeferred = UseInvokeEventDeferredImported<PackageKey>;
export type UseOffEventDeferred = UseOffEventDeferredImported<PackageKey>;
export type UseOnEvent = UseOnEventImported<PackageKey>;
export type UseOnEventDeferred = UseOnEventDeferredImported<PackageKey>;
export type UseOnceEvent = UseOnceEventImported<PackageKey>;
export type UseOnceEventDeferred = UseOnceEventDeferredImported<PackageKey>;
export type UseSendEvent = UseSendEventImported<PackageKey>;
export type UseSendEventDeferred = UseSendEventDeferredImported<PackageKey>;
