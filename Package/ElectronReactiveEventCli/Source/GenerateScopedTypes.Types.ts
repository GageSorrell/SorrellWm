/* File:      GenerateScopedTypes.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

export type ScopedTypeDefinition<
    PackageKey extends string,
    KeyType extends string
> =
    // eslint-disable-next-line @stylistic/max-len
    `export type ${ KeyType }<${ PackageKey }${ string }> = ${ KeyType }Imported<${ PackageKey }${ string }>;`;

export type Channels =
    {
        Any: string;
        Response: string;
        NoResponse: string;
        Request: string;
        NoRequest: string;
        Error: string;
        NoError: string;
        ErrorPayload: string;
        ErrorMessageOnly: string;
        Handler: Record<string, string>;
        Listener: Record<string, string>;
    };

export type ExportedType =
    | "AnyCallback"
    | "EmptyEventParameter"
    | "EventDecl"
    | "EventErrorAdvancedDecl"
    | "EventErrorAdvancedDeclParameter"
    | "EventErrorDecl"
    | "EventErrorRecord"
    | "EventErrorTuple"
    | "EventOwner"
    | "EventRequest"
    | "Handle"
    | "HandleOnce"
    | "Handler"
    | "HandlerNoRequest"
    | "HandlerRequest"
    | "HandlerWithRequest"
    | "InvokeEventDeferred"
    | "InvokeResponse"
    | "IpcMainReactive"
    | "Listener"
    | "ListenerNoRequest"
    | "ListenerRequest"
    | "ListenerWithRequest"
    | "MainListener"
    | "MainOwner"
    | "Off"
    | "OffEventDeferred"
    | "On"
    | "OnEventDeferred"
    | "Once"
    | "OnceEventDeferred"
    | "RawResponse"
    | "RawResponseError"
    | "RawResponseSuccess"
    | "ReactiveEventContext"
    | "ReactiveEventErrorData"
    | "ReactiveIpcFunctions"
    | "ReactiveEventHooks"
    | "ReactiveEventProviderProps"
    | "RemoveAllListeners"
    | "RemoveHandler"
    | "RendererListener"
    | "RendererOwner"
    | "Response"
    | "ResponseError"
    | "ResponseIndeterminate"
    | "ResponseSettled"
    | "ResponseSuccess"
    | "ResponseSync"
    | "Send"
    | "SendEventDeferred"
    | "SendableEventHandler"
    | "UseInvokeEvent"
    | "UseInvokeEventDeferred"
    | "UseOffEventDeferred"
    | "UseOnEvent"
    | "UseOnEventDeferred"
    | "UseOnceEvent"
    | "UseOnceEventDeferred"
    | "UseSendEvent"
    | "UseSendEventDeferred";

export type Types =
    {
        [ Key in ExportedType ]: string | symbol;
    };
