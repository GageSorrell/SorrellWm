/* File:      GenerateScopedTypes.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import type { Channels, Types } from "./GenerateScopedTypes.Types";
import { GetHeader, Try } from "./Command";
import type { CliConfig } from "./Config.Types";
import { GetConfigSafe } from "./Config";
import { writeFile } from "node:fs/promises";

/**
 * Generate a module in the developer's project (in the `process.cwd()`) containing
 * a type for every type exported by `electron-reactive-event`, such that the `PackageKey`
 * type parameter is set for the developer's project's `PackageKey`.
 *
 * @example `npm exec electron-reactive-event generate-types MyPackageKey`
 */
export async function GenerateScopedTypesInner(): Promise<void>
{
    const PackageKey: string = await Try(
        "Reading the PackageKey from the config file...",
        (Result: string) => `Found PackageKey ${ Result } in the config file!`,
        async (): Promise<string> =>
        {
            const Config: CliConfig = await GetConfigSafe();
            return Config.PackageKey;
        }
    );

    if (PackageKey === undefined || process.argv.length < 3)
    {
        console.error(
            "A PackageKey argument was not provided.  The name of your project's PackageKey " +
            "should be provided as the last argument.  For example,\n\n" +
            "    npm exec electron-reactive-event generate-types MyPackageKey"
        );

        process.exit(1);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    function GetChannelTypeDefinition(Path: string, OwnerType: boolean = true): string
    {
        const FullPath: Array<string> = Path.split(".");
        const Name: string = Path.includes(".")
            ? FullPath[FullPath.length - 1] as string
            : Path;

        return OwnerType
            // eslint-disable-next-line @stylistic/max-len
            ? `export type ${ Name }<OwnerType extends EventOwnerImported> = ChannelImported.${ Path }<PackageKey, OwnerType>;`
            : `export type ${ Name } = ChannelImported.${ Path }<PackageKey>;`;
    }

    type PackageKey = typeof PackageKey;
    const Channels: Channels =
        {
            Any: GetChannelTypeDefinition("Any"),

            Error: GetChannelTypeDefinition("Error", false),
            ErrorMessageOnly: GetChannelTypeDefinition("ErrorMessageOnly", false),
            ErrorPayload: GetChannelTypeDefinition("ErrorPayload", false),
            NoError: GetChannelTypeDefinition("NoError"),

            NoResponse: GetChannelTypeDefinition("NoResponse"),
            Response: GetChannelTypeDefinition("Response", false),

            NoRequest: GetChannelTypeDefinition("NoRequest"),
            Request: GetChannelTypeDefinition("Request"),

            Handler:
            {
                Any: GetChannelTypeDefinition("Handler.Any", false),
                Request: GetChannelTypeDefinition("Handler.Request", false),
                Response: GetChannelTypeDefinition("Handler.Response", false),

                NoRequest: GetChannelTypeDefinition("Handler.NoRequest", false),
                NoResponse: GetChannelTypeDefinition("Handler.NoResponse", false),

                Error: GetChannelTypeDefinition("Handler.Error", false),
                ErrorMessageOnly: GetChannelTypeDefinition("Handler.ErrorMessageOnly", false),
                ErrorPayload: GetChannelTypeDefinition("Handler.ErrorPayload", false),
                NoError: GetChannelTypeDefinition("Handler.NoError", false)
            },
            Listener:
            {
                Any: GetChannelTypeDefinition("Listener.Any"),
                NoRequest: GetChannelTypeDefinition("Listener.NoRequest"),
                Request: GetChannelTypeDefinition("Listener.Request")
            }
        };

    const ReexportedType: symbol = Symbol("ReexportedType");

    /* eslint-disable @stylistic/max-len */

    const Types: Types =
        {
            AnyCallback: "export type AnyCallback<OwnerType extends EventOwnerImported, ChannelType extends Channel.Any<OwnerType>> = AnyCallbackImported<PackageKey, OwnerType, ChannelType>;",
            EmptyEventParameter: ReexportedType,
            EventDecl: ReexportedType,
            EventErrorAdvancedDecl: ReexportedType,
            EventErrorAdvancedDeclParameter: ReexportedType,
            EventErrorDecl: ReexportedType,
            EventErrorRecord: ReexportedType,
            EventErrorTuple: ReexportedType,
            EventOwner: ReexportedType,
            EventRequest: "export type EventRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Request<OwnerType>> = EventRequestImported<PackageKey, OwnerType, ChannelType>;",
            Handle: "export type Handle = HandleImported<PackageKey>;",
            HandleOnce: "export type HandleOnce = HandleOnceImported<PackageKey>;",
            Handler: "export type Handler<ChannelType extends Channel.Handler.Any> = HandlerImported<PackageKey, ChannelType>;",
            HandlerNoRequest: "export type HandlerNoRequest<ChannelType extends Channel.Handler.NoRequest> = HandlerNoRequestImported<PackageKey, ChannelType>;",
            HandlerRequest: "export type HandlerRequest<ChannelType extends Channel.Handler.Request> = HandlerRequestImported<PackageKey, ChannelType>;",
            HandlerWithRequest: "export type HandlerWithRequest<ChannelType extends Channel.Handler.Request> = HandlerWithRequestImported<PackageKey, ChannelType>;",
            InvokeEventDeferred: "export type InvokeEventDeferred = InvokeEventDeferredImported<PackageKey>;",
            InvokeResponse: "export type InvokeResponse<ChannelType extends Channel.Handler.Any, OptionsType extends InvokeOptions | undefined> = InvokeResponseImported<PackageKey, ChannelType, OptionsType>;",
            IpcMainReactive: "export type IpcMainReactive = IpcMainReactiveImported<PackageKey>;",
            Listener: "export type Listener<OwnerType extends EventOwnerImported, ChannelType extends Channel.Listener.Any<OwnerType>> = ListenerImported<PackageKey, OwnerType, ChannelType>;",
            ListenerNoRequest: ReexportedType,
            ListenerRequest: "export type ListenerRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Request<OwnerType>> = ListenerRequestImported<PackageKey, OwnerType, ChannelType>;",
            ListenerWithRequest: "export type ListenerWithRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Listener.Request<OwnerType>> = ListenerWithRequestImported<PackageKey, OwnerType, ChannelType>;",
            MainListener: "export type MainListener<ChannelType extends Channel.Listener.Any<RendererOwnerImported>> = MainListenerImported<PackageKey, ChannelType>;",
            MainOwner: ReexportedType,
            Off: "export type Off = OffImported<PackageKey>;",
            OffEventDeferred: "export type OffEventDeferred = OffEventDeferredImported<PackageKey>;",
            On: "export type On = OnImported<PackageKey>;",
            OnEventDeferred: "export type OnEventDeferred = OnEventDeferredImported<PackageKey>;",
            Once: "export type Once = OnceImported<PackageKey>;",
            OnceEventDeferred: "export type OnceEventDeferred = OnceEventDeferredImported<PackageKey>;",
            RawResponse: "export type RawResponse<ChannelType extends Channel.Handler.Any> = RawResponseImported<PackageKey, ChannelType>;",
            RawResponseError: "export type RawResponseError<ChannelType extends Channel.Handler.Any> = RawResponseErrorImported<PackageKey, ChannelType>;",
            RawResponseSuccess: "export type RawResponseSuccess<ChannelType extends Channel.Handler.Any> = RawResponseSuccessImported<PackageKey, ChannelType>;",
            ReactiveEventContext: ReexportedType,
            ReactiveEventErrorData: "export type ReactiveEventErrorData<ChannelType extends Channel.Error> = ReactiveEventErrorDataImported<PackageKey, ChannelType>;",
            ReactiveEventHooks: "export type ReactiveEventHooks = ReactiveEventHooksImported<PackageKey>;",
            ReactiveEventProviderProps: ReexportedType,
            ReactiveIpcFunctions: "export type ReactiveIpcFunctions = ReactiveIpcFunctionsImported<PackageKey>;",
            RemoveAllListeners: "export type RemoveAllListeners = RemoveAllListenersImported<PackageKey>;",
            RemoveHandler: "export type RemoveHandler = RemoveHandlerImported<PackageKey>;",
            RendererListener: "export type RendererListener<ChannelType extends Channel.Listener.Any<MainOwnerImported>> = RendererListenerImported<PackageKey, ChannelType>;",
            RendererOwner: ReexportedType,
            Response: "export type Response<ChannelType extends Channel.Handler.Any> = ResponseImported<PackageKey, ChannelType>;",
            ResponseError: "export type ResponseError<ChannelType extends Channel.Handler.Error> = ResponseErrorImported<PackageKey, ChannelType>;",
            ResponseIndeterminate: ReexportedType,
            ResponseSettled: "export type ResponseSettled<ChannelType extends Channel.Handler.Any> = ResponseSettledImported<PackageKey, ChannelType>;",
            ResponseSuccess: "export type ResponseSuccess<ChannelType extends Channel.Handler.Response> = ResponseSuccessImported<PackageKey, ChannelType>;",
            ResponseSync: "export type ResponseSync<ChannelType extends Channel.Handler.Any> = ResponseSyncImported<PackageKey, ChannelType>;",
            Send: "export type Send = SendImported<PackageKey>;",
            SendEventDeferred: "export type SendEventDeferred = SendEventDeferredImported<PackageKey>;",
            SendableEventHandler: "export type SendableEventHandler = SendableEventHandlerImported<PackageKey>;",
            UseInvokeEvent: "export type UseInvokeEvent = UseInvokeEventImported<PackageKey>;",
            UseInvokeEventDeferred: "export type UseInvokeEventDeferred = UseInvokeEventDeferredImported<PackageKey>;",
            UseOffEventDeferred: "export type UseOffEventDeferred = UseOffEventDeferredImported<PackageKey>;",
            UseOnEvent: "export type UseOnEvent = UseOnEventImported<PackageKey>;",
            UseOnEventDeferred: "export type UseOnEventDeferred = UseOnEventDeferredImported<PackageKey>;",
            UseOnceEvent: "export type UseOnceEvent = UseOnceEventImported<PackageKey>;",
            UseOnceEventDeferred: "export type UseOnceEventDeferred = UseOnceEventDeferredImported<PackageKey>;",
            UseSendEvent: "export type UseSendEvent = UseSendEventImported<PackageKey>;",
            UseSendEventDeferred: "export type UseSendEventDeferred = UseSendEventDeferredImported<PackageKey>;"
        };

    const ReactiveErrorFunction: string =
        "export const ReactiveEventError = ReactiveEventErrorImported as ReactiveEventErrorFunctionImported<PackageKey>;\n";

    /* eslint-enable @stylistic/max-len */

    const TypeNames: Array<string> = Object.keys(Types);
    const Unimported: Array<string> =
        [
            "EmptyEventParameter",
            "EmptyOverloadParameter",
            "EventDecl",
            "EventErrorAdvancedDecl",
            "EventErrorAdvancedDeclParameter",
            "EventErrorDecl",
            "EventErrorRecord",
            "EventErrorTuple",
            "InvokeOptionsOverloadedArgument",
            "ListenerNoRequest",
            "ReactiveEventProviderProps",
            "ReactiveEventContext",
            "ReactiveEventContextInternal",
            "ResponseIndeterminate"
        ];

    const FilterImportTypes = (Type: string): boolean =>
    {
        return (
            [ "Handler", "Listener", "Request", "Response" ].includes(Type) ||
            !(
                Object.keys(Channels).includes(Type) ||
                Object.keys(Channels.Handler).includes(Type) ||
                Object.keys(Channels.Listener).includes(Type)
            )
        );
    };

    // eslint-disable-next-line jsdoc/require-jsdoc
    function MakeImported(Name: string): string
    {
        return `,\n    ${ Name } as ${ Name }Imported`;
    }

    const ImportStatement: string = (
        "import type { \n" +
        TypeNames
            // eslint-disable-next-line @stylistic/max-len
            .filter(FilterImportTypes)
            .filter((Type: string): boolean => !Unimported.includes(Type))
            .map((Type: string) => `    ${ Type } as ${ Type }Imported`)
            .join(",\n") +
        MakeImported("Channel") +
        MakeImported("ReactiveEventErrorFunction") +
        "\n} from \"electron-reactive-event/scoped\";\n"
    );

    const ImportErrorFunction: string =
        "import { ReactiveEventError as ReactiveEventErrorImported } from " +
        "\"electron-reactive-event/scoped\";";

    const UnscopedImportStatement: string =
        "import type { InvokeOptions } from \"electron-reactive-event\";\n";

    const PackageKeyDefinition: string = `export type PackageKey = "${ PackageKey }";\n`;

    // eslint-disable-next-line @stylistic/max-len
    // const PackageKeyDeclareModule: string = `declare module "electron-reactive-event/registrar"\n{\n    interface Registrar\n    {\n        ${ PackageKey }: { };\n    }\n};\n`;

    type EntryType = [ string, string | symbol ];
    const ExportStatements: string =
        Object
            .entries(Types)
            .filter(([ _Key, Value ]: EntryType) => typeof Value === "string")
            .map(([ _Key, Value ]: EntryType) => Value)
            .join("\n") + "\n";

    const ReexportStatements: string = "export type {\n" +
        Object
            .entries(Types)
            .filter(([ _Key, Value ]: [ string, string | symbol ]) => typeof Value !== "string")
            .map(([ Key ]: [ string, string | symbol ]) => `    ${ Key }`)
            .join(",\n") +
        "\n} from \"electron-reactive-event/scoped\";\n";

    const BeginChannelLine: string = "export namespace Channel\n{\n";
    const EndChannelLine: string = "};\n";

    const ChannelLines: Array<string> = Object.entries(Channels).map((
        [ Key, Property ]: [ string, string | Record<string, string> ]
    ): string =>
    {
        if (typeof Property === "string")
        {
            return `    ${ Property }\n`;
        }
        else
        {
            return `    export namespace ${ Key }\n    {\n` +
            Object.values(Property).map((SubProperty: string): string =>
            {
                return `        ${ SubProperty }`;
            }).join("\n") +
            "\n    };\n";
        }
    });

    const Channel: string = BeginChannelLine + ChannelLines.join("\n") + EndChannelLine;
    const Header: string = GetHeader("Reactive.Types.Generated.ts", "generate-scoped-types");

    try
    {
        const ScopedModulePath: string = await (async (): Promise<string> =>
        {
            const Config: CliConfig = await GetConfigSafe();
            return Config.ScopedModulePath;
        })();

        await writeFile(
            ScopedModulePath,
            [
                Header,
                ImportStatement,
                UnscopedImportStatement,
                ImportErrorFunction,
                ReexportStatements,
                PackageKeyDefinition,
                ReactiveErrorFunction,
                // PackageKeyDeclareModule,
                Channel,
                ExportStatements
            ].join("\n")
        );

        process.exit(0);
    }
    catch
    {
        console.error("Could not write file.");
        process.exit(1);
    }
}
