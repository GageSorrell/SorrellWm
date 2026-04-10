/* File:      WriteTypesToClipboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable */

import clipboard from "clipboardy";
import { ipcMain } from "electron";
import { resolve } from "path";
import ts, { type DeclarationWithTypeParameters } from "typescript";

// function GetExportedTypeNames(PackageEntryDeclarationPath: string): Array<string>
// {
//     const Program = ts.createProgram([ PackageEntryDeclarationPath ], {});
//     const TypeChecker = Program.getTypeChecker();
//     const SourceFile = Program.getSourceFile(PackageEntryDeclarationPath);

//     if (!SourceFile)
//     {
//         return [];
//     }

//     const ModuleSymbol =
//         TypeChecker.getSymbolAtLocation(SourceFile) ??
//         (SourceFile as unknown as { symbol?: ts.Symbol }).symbol;

//     if (!ModuleSymbol)
//     {
//         return [];
//     }

//     const ExportedSymbols = TypeChecker.getExportsOfModule(ModuleSymbol);

//     return ExportedSymbols
//         .filter((Symbol) =>
//         {
//             const Flags = Symbol.getFlags();

//             return Boolean(
//                 Flags & ts.SymbolFlags.TypeAlias ||
//                 Flags & ts.SymbolFlags.Interface ||
//                 Flags & ts.SymbolFlags.Class ||
//                 Flags & ts.SymbolFlags.Enum ||
//                 Flags & ts.SymbolFlags.TypeParameter ||
//                 Flags & ts.SymbolFlags.NamespaceModule
//             );
//         })
//         .map((Symbol) => Symbol.getName())
//         .sort();
// }

type ExportedTypeDeclaration =
    | ts.ClassDeclaration
    | ts.InterfaceDeclaration
    | ts.TypeAliasDeclaration
    | ts.EnumDeclaration;

function GetExportedTypeNamesWithTypeParameterVectors
(
    PackageEntryDeclarationPath: string
): string[]
{
    const Program = ts.createProgram([PackageEntryDeclarationPath], {});
    const TypeChecker = Program.getTypeChecker();
    const SourceFile = Program.getSourceFile(PackageEntryDeclarationPath);

    if (!SourceFile)
    {
        return [];
    }

    const ModuleSymbol =
        TypeChecker.getSymbolAtLocation(SourceFile) ??
        (SourceFile as typeof SourceFile & { symbol?: ts.Symbol }).symbol;

    if (!ModuleSymbol)
    {
        return [];
    }

    const Results = new Set<string>();

    for (const ExportedSymbol of TypeChecker.getExportsOfModule(ModuleSymbol))
    {
        const ResolvedSymbol =
            ExportedSymbol.getFlags() & ts.SymbolFlags.Alias
                ? TypeChecker.getAliasedSymbol(ExportedSymbol)
                : ExportedSymbol;

        const Declaration = GetExportedTypeDeclaration(ResolvedSymbol);

        if (!Declaration)
        {
            continue;
        }

        const TypeParameterNames = ts
            .getEffectiveTypeParameterDeclarations(Declaration as DeclarationWithTypeParameters)
            .map((TypeParameter) => TypeParameter.name.getText());

        const TypeParameterVector =
            TypeParameterNames.length === 0
                ? ""
                : `<${TypeParameterNames.join(", ")}>`;


        Results.add(`${ResolvedSymbol.getName()}${TypeParameterVector};`);
    }

    return Array
        .from(Results)
        .sort();
}

function GetExportedTypeDeclaration
(
    Symbol: ts.Symbol
): ExportedTypeDeclaration | undefined
{
    const Declarations = Symbol.getDeclarations() ?? [];

    return Declarations.find(
        (Declaration): Declaration is ExportedTypeDeclaration =>
            ts.isClassDeclaration(Declaration) ||
            ts.isInterfaceDeclaration(Declaration) ||
            ts.isTypeAliasDeclaration(Declaration) ||
            ts.isEnumDeclaration(Declaration)
    );
}

const Types: Array<string> = GetExportedTypeNamesWithTypeParameterVectors(resolve("Source", "index.GenerateTypes.ts"));

const Out: Array<string> = Types.map((Type: string): string =>
{
    const IpcMainKeys: Array<string> =
    [
        "addListener",
        "handle",
        "handleOnce",
        "off",
        "on",
        "once",
        "removeAllListeners",
        "removeHandler",
        "removeListener"
    ];

    const ShouldRedefine: boolean = (
        Type.includes("PackageKey") ||
        IpcMainKeys.map(Key => Key.toLowerCase()).some(Key => Type.toLowerCase().startsWith(Key)) ||
        Type.toLowerCase().startsWith("use")
    );
    if (ShouldRedefine)
    {
        const TypeName: string = Type.slice(0, Type.indexOf("<"));
        if (Type.indexOf(",") !== Type.lastIndexOf(","))
        {
            const TypeParameterVector: string = Type.slice(Type.indexOf("<"), Type.indexOf(">")).replace("PackageKey, ", "");
            const StringDelimiter: string = Type.includes("PackageKey")
                ? "`"
                : "\"";

            const Almost: string = (
                TypeName +
                `: ${ StringDelimiter }export type ${ TypeName }${ TypeParameterVector }> = ` +
                Type.replace(TypeName, `${ TypeName }Imported`).replace("PackageKey", "${ PackageKey }") +
                `${ StringDelimiter },`
            );

            const Out: string = Almost.replace("OwnerType", "OwnerType extends EventOwner")

            return Out;
        }
        else
        {
            if (Type.includes("PackageKey"))
            {
                const TypeNameBase: string = Type.replace(";", "");
                const TypeName: string = TypeNameBase.slice(0, TypeNameBase.indexOf("<"));
                return `${ TypeName }: \`export type ${ TypeName } = ${ TypeName }Imported<\${ PackageKey }>;\`,`;
            }
            else
            {
                const TypeNameBase: string = Type.replace(";", "");
                const Out: string = TypeNameBase.includes("<")
                    ? TypeNameBase.slice(TypeNameBase.indexOf("<"), TypeNameBase.indexOf(">"))
                    : TypeNameBase;
                return `${ Out }: ReexportedType,`;
            }
        }
    }
    else
    {
        const TypeNameBase: string = Type.replace(";", "");
        const TypeName: string = TypeNameBase + Type.includes("<")
            ? Type.slice(0, Type.indexOf("<"))
            : "";
        return `${ TypeName }: ReexportedType,`;
    }
});

// clipboard.writeSync(Out.join("\n"));
const ReexportedType: string = "";
const OldTypes: Record<string, unknown> =
{
    AnyCallback: "export type AnyCallback<OwnerType extends EventOwnerImported, ChannelType extends Channel.Any<OwnerType>> = AnyCallbackImported<PackageKey, OwnerType, ChannelType>;",
    EmptyEventParameter: ReexportedType,
    EmptyOverloadParameter: ReexportedType,
    EqualityCheck: ReexportedType,
    ErrorPayloadKey: ReexportedType,
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
    InvokeOptions: ReexportedType,
    InvokeOptionsOverloadedArgument: ReexportedType,
    InvokeResponse: "export type InvokeResponse<ChannelType extends Channel.Handler.Any, OptionsType extends InvokeOptionsImported | undefined> = InvokeResponseImported<PackageKey, ChannelType, OptionsType>;",
    IpcMainReactive: "export type IpcMainReactive = IpcMainReactiveImported<PackageKey>;",
    Listener: "export type Listener<OwnerType extends EventOwnerImported, ChannelType extends Channel.Listener.Any<OwnerType>> = ListenerImported<PackageKey, OwnerType, ChannelType>;",
    ListenerNoRequest: ReexportedType,
    ListenerRequest: "export type ListenerRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Request<OwnerType>> = ListenerRequestImported<PackageKey, OwnerType, ChannelType>;",
    ListenerWithRequest: "export type ListenerWithRequest<OwnerType extends EventOwnerImported, ChannelType extends Channel.Listener.Request<OwnerType>> = ListenerWithRequestImported<PackageKey, OwnerType, ChannelType>;",
    MainListener: "export type MainListener<ChannelType extends Channel.Listener.Any<RendererOwnerImported>> = MainListenerImported<PackageKey, ChannelType>;",
    MainOwner: ReexportedType,
    NativeEventListener: ReexportedType,
    NativeHandlerListener: ReexportedType,
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
    ReactiveEventContextInternal: ReexportedType,
    ReactiveEventErrorData: "export type ReactiveEventErrorData<ChannelType extends Channel.Error<EventOwnerImported>> = ReactiveEventErrorDataImported<PackageKey, ChannelType>;",
    ReactiveEventErrorDataInternal: "export type ReactiveEventErrorDataInternal<ChannelType extends Channel.Error<EventOwnerImported>> = ReactiveEventErrorDataInternalImported<PackageKey, ChannelType>;",
    ReactiveEventErrorInternal: "export type ReactiveEventErrorInternal<ChannelType extends Channel.ErrorMessageOnly<EventOwnerImported>> = ReactiveEventErrorInternalImported<PackageKey, ChannelType>;",
    ReactiveEventErrorMessage: "export type ReactiveEventErrorMessage<ChannelType extends Channel.Error<EventOwnerImported>> = ReactiveEventErrorMessageImported<PackageKey, ChannelType>;",
    ReactiveEventErrorPayload: "export type ReactiveEventErrorPayload<ChannelType extends Channel.Handler.Error> = ReactiveEventErrorPayloadImported<PackageKey, ChannelType>;",
    ReactiveEventFunctions: "export type ReactiveEventFunctions = ReactiveEventFunctionsImported<PackageKey>;",
    ReactiveEventHooks: "export type ReactiveEventHooks = ReactiveEventHooksImported<PackageKey>;",
    ReactiveEventProviderProps: ReexportedType,
    RemoveAllListeners: "export type RemoveAllListeners = RemoveAllListenersImported<PackageKey>;",
    RemoveHandler: "export type RemoveHandler = RemoveHandlerImported<PackageKey>;",
    RendererListener: "export type RendererListener<ChannelType extends Channel.Listener.Any<MainOwnerImported>> = RendererListenerImported<PackageKey, ChannelType>;",
    RendererOwner: ReexportedType,
    Response: "export type Response<ChannelType extends Channel.Handler.Any> = ResponseImported<PackageKey, ChannelType>;",
    ResponseError: "export type ResponseError<ChannelType extends Channel.Handler.Error> = ResponseErrorImported<PackageKey, ChannelType>;",
    ResponseIndeterminate: ReexportedType,
    ResponseSettled: "export type ResponseSettled<ChannelType extends Channel.Handler.Any> = ResponseSettledImported<PackageKey, ChannelType>;",
    ResponseSuccess: "export type ResponseSuccess<ChannelType extends Channel.Handler.Any> = ResponseSuccessImported<PackageKey, ChannelType>;",
    ResponseSync: "export type ResponseSync<ChannelType extends Channel.Handler.Response> = ResponseSyncImported<PackageKey, ChannelType>;",
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

const OldTypesArray: Array<string> = Object.keys(OldTypes);
const NewTypes: Array<string> = Types.map(Type => Type.toLowerCase());
const New: Array<string> = OldTypesArray.filter(Type => !NewTypes.some(NewType => NewType.includes(Type.toLowerCase())));

clipboard.writeSync(New.join("\n"));
console.log(`✔️  Wrote ${ Types.length } types to the clipboard.`);
