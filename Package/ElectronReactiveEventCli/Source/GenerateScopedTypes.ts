/**
 * @file      GenerateScopedTypes.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable no-console */

import { GetHeader, Try } from "./Command";
import type { Channels } from "./GenerateScopedTypes.Types";
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

    const Types: Record<"Scoped" | "Unscoped", Array<string>> =
        {
            Scoped:
            [
                "Channel<OwnerType extends EventOwner>",
                "FilterByOwner<OwnerType extends EventOwner>",
                "Handle",
                "HandleOnce",
                "InvokeEventDeferred",
                "IpcMainReactive",
                "Listener<OwnerType extends EventOwner, ChannelType extends Channel.Listener<PackageKey, OwnerType>, EventType extends IpcEvent | undefined>",
                "MainListener<ChannelType extends Channel.Listener<PackageKey, RendererOwner>>",
                "MainRegistrar",
                "Off",
                "OffEventDeferred",
                "On",
                "OnEventDeferred",
                "Once",
                "OnceEventDeferred",
                "ReactiveEventHooks",
                "ReactiveIpcMainFunctions",
                "RemoveAllListeners",
                "RemoveHandler",
                "RendererListener<ChannelType extends Channel.Listener<PackageKey, MainOwner>>",
                "RendererRegistrar",
                "Send",
                "SendEventDeferred",
                "UseInvokeEvent",
                "UseInvokeEventDeferred",
                "UseOffEventDeferred",
                "UseOnEvent",
                "UseOnEventDeferred",
                "UseOnceEvent",
                "UseOnceEventDeferred",
                "UseSendEvent",
                "UseSendEventDeferred"
            ],
            Unscoped:
            [
                "EventDecl<OwnerType extends EventOwner, RequestType, ResponseType, ErrorType>",
                "EventDeclHandler<RequestType, ResponseType, ErrorType>",
                "EventDeclListener<OwnerType extends EventOwner, RequestType>",
                "EventOwner",
                "IpcEvent",
                "MainOwner",
                "PackageKeys",
                "ReactiveEventContext",
                "ReactiveEventProviderProps",
                "RendererOwner"
            ]
        };

    /* eslint-enable @stylistic/max-len */

    const ScopedExportStatementsSimple: Array<string> = Types.Scoped
        .filter((Type: string) => !Type.includes("<"))
        .map((Type: string): string =>
        {
            return `export ${ Type } = ${ Type }Imported<PackageKey>;`;
        });

    const ScopedExportStatementsAdvanced: Array<string> = Types.Scoped
        .filter((Type: string) => Type.includes("<"))
        .map((Type: string): string =>
        {
            const TypeArgumentVector: string | undefined = ((): string | undefined =>
            {
                if (!Type.includes("<"))
                {
                    return undefined;
                }

                const Input: string =
                    Type.slice(Type.indexOf("<") + 1, Type.indexOf(">"))

                const Matches: Array<string> = [ ];
                const Pattern: RegExp = /(?:^|,)\s*([^,\s]+)/g;

                let Match: RegExpExecArray | null;

                while ((Match = Pattern.exec(Input)) !== null)
                {
                    Matches.push(Match[1] as string);
                }

                return Matches.join(", ");
            })();

            return `export ${ Type } = ${ Type }Imported<PackageKey, ${ TypeArgumentVector }>;`;
        });

    // eslint-disable-next-line jsdoc/require-jsdoc
    function MakeImported(Name: string): string
    {
        return `,\n    ${ Name } as ${ Name }Imported`;
    }

    const ImportStatement: string = (
        "import type { \n" +
        Types.Scoped
            .map((Type: string): string =>
            {
                const Name: string = Type.includes("<")
                    ? Type.slice(0, Type.indexOf("<"))
                    : Type;
                return `    ${ Name } as ${ Name }Imported`;
            })
            .join(",\n") +
        "\n} from \"electron-reactive-event\";\n"
    );

    const ImportedNamespaces: Array<string> =
        [
            "Channel",
            "Handler",
            "Invoke",
            "Listener"
        ];

    const NamespacesImportStatement: string = (
        "import { \n" +
        ImportedNamespaces
            .map((Namespace: string): string =>
            {
                return `    ${ Namespace } as ${ Namespace }Imported`;
            })
            .join(",\n") +
        "\n} from \"electron-reactive-event\";\n"
    );

    const ImportErrorFunction: string =
        "import { ReactiveEventError as ReactiveEventErrorImported } from " +
        "\"electron-reactive-event/scoped\";";

    const PackageKeyDefinition: string = `export type PackageKey = "${ PackageKey }";\n`;

    // eslint-disable-next-line @stylistic/max-len
    // const PackageKeyDeclareModule: string = `declare module "electron-reactive-event/registrar"\n{\n    interface Registrar\n    {\n        ${ PackageKey }: { };\n    }\n};\n`;

    // type EntryType = [ string, string | symbol ];
    // const ExportStatements: string =
    //     Object
    //         .entries(Types)
    //         .filter(([ _Key, Value ]: EntryType) => typeof Value === "string")
    //         .map(([ _Key, Value ]: EntryType) => Value)
    //         .join("\n") + "\n";

    // const ReexportStatements: string = "export type {\n" +
    //     Object
    //         .entries(Types)
    //         .filter(([ _Key, Value ]: [ string, string ]) => typeof Value !== "string")
    //         .map(([ Key ]: [ string, string | symbol ]) => `    ${ Key }`)
    //         .join(",\n") +
    //     "\n} from \"electron-reactive-event/scoped\";\n";

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

    const Invoke: string = "@TODO";
    const Handler: string = "@TODO";
    const Listener: string = "@TODO";

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
                NamespacesImportStatement,
                PackageKeyDefinition,
                Channel,
                Handler,
                Invoke,
                Listener
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
