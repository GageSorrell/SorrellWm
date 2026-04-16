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

export type ScopedExport =
    | "Channel"
    | "FilterByOwner"
    | "Handle"
    | "HandleOnce"
    | "InvokeEventDeferred"
    | "IpcMainReactive"
    | "Listener"
    | "MainListener"
    | "MainRegistrar"
    | "Off"
    | "OffEventDeferred"
    | "On"
    | "OnEventDeferred"
    | "Once"
    | "OnceEventDeferred"
    | "ReactiveEventHooks"
    | "ReactiveIpcMainFunctions"
    | "RemoveAllListeners"
    | "RemoveHandler"
    | "RendererListener"
    | "RendererRegistrar"
    | "Send"
    | "SendEventDeferred"
    | "UseInvokeEvent"
    | "UseInvokeEventDeferred"
    | "UseOffEventDeferred"
    | "UseOnEvent"
    | "UseOnEventDeferred"
    | "UseOnceEvent"
    | "UseOnceEventDeferred"
    | "UseSendEvent"
    | "UseSendEventDeferred";

export type UnscopedExport =
    | "EventDecl"
    | "EventDeclHandler"
    | "EventDeclListener"
    | "EventOwner"
    | "IpcEvent"
    | "MainOwner"
    | "PackageKeys"
    | "ReactiveEventContext"
    | "ReactiveEventProviderProps"
    | "Registrar"
    | "RendererOwner";

export type Types =
    {
        Scoped:
        {
            [ Key in ScopedExport ]: string | symbol;
        };
        Unscoped:
        {
            [ Key in UnscopedExport ]: string | symbol;
        };
    };
