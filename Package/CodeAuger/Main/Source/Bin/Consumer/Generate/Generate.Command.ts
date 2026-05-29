/**
 * @file      Generate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type * as Consumer from "../../../Consumer/Config/Config.Types.js";
import type * as Provider from "../../../Provider/index.js";
import * as TypeScript from "typescript";
import { Command, Options } from "@effect/cli";
import type {
    EGetGenerateConfig,
    GenerateCommandEffect,
    GenerateCommandType,
    GenerateConfigPart,
    GenerateConfigRecord,
    GetOutPathFn
} from "./Generate.Command.Types.js";
import { Effect, Record, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import { GetDescendantTypes, MapRecordEntriesEffect } from "./Generate.Internal.js";
import { GetProviderConfig, LoadConfig } from "../Shared/LoadConfig.js";
import { GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { PlatformError } from "@effect/platform/Error";
import type { RootDirectoryNotFoundError } from "@sorrell/utilities/npm";

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const GenerateConfig =
    {
        Watch: pipe(
            Options.boolean("watch", { aliases: [ "w" ] }),
            Options.withDefault(false),
            Options.withDescription(
                "Watch the codebase, and regenerate modules when a file in the codebase is saved."
            )
        )
    };

const GetGenerateConfig: EGetGenerateConfig =
    Effect.gen(function* ()
    {
        const ConsumerPart: Consumer.Config["Providers"] =
            (yield* LoadConfig(yield* GetPackageRootDirectory(), "consumer")).Providers;

        const IsProviderEnabled = (Provider: string): boolean => (
            ConsumerPart !== undefined &&
            ConsumerPart !== null &&
            Provider in ConsumerPart &&
            typeof ConsumerPart[Provider] === "object" &&
            ConsumerPart[Provider] !== null &&
            (
                !("Disabled" in ConsumerPart[Provider]) ||
                ConsumerPart[Provider].Disabled === false
            )
        );

        const EnabledProviders: ReadonlyArray<string> =
            Object.keys(ConsumerPart).filter(IsProviderEnabled);

        const NodeModulesDirectory: string = yield* GetNodeModulesDirectory();

        type ToEntryEffect =
            Effect.Effect<
                [ string, GenerateConfigPart ],
                RootDirectoryNotFoundError,
                EffectPath.Path
            >;

        const ToEntry = (PackageName: string): ToEntryEffect => Effect.gen(function* ()
        {
            const ProviderPart: Provider.Config =
                yield* GetProviderConfig(PackageName, NodeModulesDirectory);

            return [
                PackageName,
                {
                    Consumer: ConsumerPart[PackageName] as Consumer.Provider,
                    Provider: ProviderPart
                }
            ];
        });

        return yield* pipe(
            Effect.forEach(EnabledProviders, ToEntry),
            Effect.map((Entries: Array<[ string, GenerateConfigPart ]>) => Record.fromEntries(Entries))
        );
    });

/**
 * If the consumer's base path directory does not exist yet, then create it.
 *
 * @param DirectoryPath - The directory to ensure.
 * @returns {Effect.Effect<void, never, Requirements.FsPath>} The effect that performs this task.
 */
function EnsureDirectory(DirectoryPath: string): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;

        yield* Fs.makeDirectory(DirectoryPath, { recursive: true });
    });
}

// function MakeGetProviderOutDirectory(
//     BasePath: string,
//     PackageName: string,
//     Provider: Consumer.Provider
// ): Effect.Effect<string, never, EffectPath.Path>
// {
//     return Effect.gen(function* ()
//     {
//         const Path: EffectPath.Path = yield* EffectPath.Path;

//         const ProviderPath: string = Provider.Path || `./${ PackageName }`;

//         return Path.isAbsolute(ProviderPath)
//             ? ProviderPath
//             : Path.join(BasePath, ProviderPath);
//     });
// }

function GetModuleContentsFactory(
    ConsumerConfig: Consumer.Config
): (GenerateConfigPart: GenerateConfigPart) => Effect.Effect<string, RootDirectoryNotFoundError, never>
{
    return function(
        GenerateConfigPart: GenerateConfigPart
    ): Effect.Effect<string, RootDirectoryNotFoundError, never>
    {
        return Effect.gen(function* ()
        {
            const ConsumerTypes: ReadonlyArray<Provider.ExportedType> = [ ];
            const ToPropertyDeclaration = ({ Name }: Provider.ExportedType): string =>
                `${ Name }: ${ Name };`;

            const PrependedLines: string = ConsumerConfig.PrependedLines !== undefined
                ? (ConsumerConfig.PrependedLines || [ ]).join("\n") + "\n\n"
                : "";

            const DisableFormatterComments: string | undefined =
                (
                    (ConsumerConfig.DisabledFormatters || [ ]).includes("eslint") ||
                    (ConsumerConfig.DisabledFormatters || [ ]).includes("ox")
                )
                    ? "/* eslint-disable */"
                    : undefined;

            const PropertyDeclarations: string = ConsumerTypes.map(ToPropertyDeclaration).join("\n    ");

            const { Provider } = GenerateConfigPart;

            const ProviderImport: string = `import "${ Provider.Interface.Path }";`;

            const TsConfigPath: string | undefined = TypeScript.findConfigFile(
                yield* GetPackageRootDirectory(),
                TypeScript.sys.fileExists,
                ConsumerConfig.TsConfigPath || "tsconfig.json"
            );

            if (TsConfigPath === undefined)
            {
                return yield* Effect.dieMessage(
                    "Could not find your package's TypeScript config file!  Exiting..."
                );
            }

            const DescendantTypes: ReadonlyArray<Provider.ExportedType> =
                yield* GetDescendantTypes(TsConfigPath, Provider.GenericProperty);

            type DescendantModule =
                Readonly<{
                    Types: ReadonlyArray<string>;
                    Path: string;
                }>;

            const GetImportStatement = ({ Path, Types }: DescendantModule): string =>
                `import type ${ Types.join(", ") } from "${ Path }";`;

            const DescendantModuleNames: Set<string> = new Set<string>(
                DescendantTypes.map((Descendant: Provider.ExportedType): string =>
                {
                    return Descendant.Path;
                }));

            const GetDescendantsFromModule = (ModulePath: string): DescendantModule =>
            {
                return {
                    Path: ModulePath,
                    Types: DescendantTypes.filter((Descendant: Provider.ExportedType): boolean =>
                    {
                        return Descendant.Path === ModulePath;
                    }).map((Descendant: Provider.ExportedType): string => Descendant.Name)
                } as const;
            };

            const DescendantModules: ReadonlyArray<DescendantModule> =
                Array.from(DescendantModuleNames).map(GetDescendantsFromModule);

            const ConsumerImports: string = DescendantModules.map(GetImportStatement).join("\n");

            const ModuleDeclaration: string = `declare module "${ Provider.Interface.Path }"
{
    interface ${ Provider.Interface.Name }
    {
        ${ PropertyDeclarations }
    }
}\n`;

            const Sections: ReadonlyArray<string | undefined> =
                [
                    PrependedLines,
                    DisableFormatterComments,
                    ProviderImport,
                    ConsumerImports,
                    ModuleDeclaration
                ] as const;

            return Sections
                .filter((Element: string | undefined) => Element !== undefined)
                .join("\n\n") +
                "\n";
        });
    };
}

function MakeGetOutPath(BasePath: string): GetOutPathFn
{
    return function GetOutPath(PackageName: string): Effect.Effect<string, never, EffectPath.Path>
    {
        return Effect.gen(function* ()
        {
            const Path: EffectPath.Path = yield* EffectPath.Path;

            const PackageNameSafe: string = PackageName.replaceAll("/", "-");

            return Path.join(BasePath, PackageNameSafe);
        });
    };
}

function WriteModule(
    Contents: string,
    OutPath: string
): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;

        yield* Fs.writeFileString(OutPath, Contents);
    });
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function Watch(): GenerateCommandEffect
{
    return Effect.gen(function* ()
    {
    });
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function RunGenerate(): GenerateCommandEffect
{
    return Effect.gen(function* ()
    {
        const GenerateConfig: GenerateConfigRecord = yield* GetGenerateConfig;

        const ConsumerConfig: Consumer.Config = yield* LoadConfig(
            yield* GetPackageRootDirectory(),
            "consumer"
        );

        yield* EnsureDirectory(ConsumerConfig.BasePath);

        // const GetProviderOutDirectory = (ProviderConfig: Consumer.Provider, PackageName: string) =>
        //     MakeGetProviderOutDirectory(
        //         ConsumerConfig.BasePath,
        //         PackageName,
        //         ProviderConfig
        //     );

        // const OutDirectories: Record<string, string> = yield* Effect.all(
        //     Record.map(ConsumerConfig.Providers, GetProviderOutDirectory)
        // );

        type EGetModuleContents = (GenerateConfigPart: GenerateConfigPart) =>
        Effect.Effect<string, RootDirectoryNotFoundError, never>;

        const GetModuleContents: EGetModuleContents = GetModuleContentsFactory(ConsumerConfig);

        const GeneratedContents: Readonly<Record<string, string>> =
            yield* Effect.all(Record.map(GenerateConfig, GetModuleContents));

        const GetOutPath: GetOutPathFn = MakeGetOutPath(ConsumerConfig.BasePath);

        const SwapNameWithPath = (
            Contents: string,
            PackageName: string
        ): Effect.Effect<readonly [ string, string ], never, EffectPath.Path> =>
        {
            return Effect.gen(function* ()
            {
                return [ yield* GetOutPath(PackageName), Contents ] as const;
            });
        };

        const PathsToGeneratedModules: Readonly<Record<string, string>> =
            yield* MapRecordEntriesEffect(GeneratedContents, SwapNameWithPath);

        yield* Effect.all(Record.map(PathsToGeneratedModules, WriteModule), { discard: true });
    });
}

function HandleGenerate(
    Options: Handler.Argument<typeof GenerateConfig>
): GenerateCommandEffect
{
    return Options.Watch
        ? RunGenerate()
        : Watch();
}

export/** The `generate` command, which generates code for consumers. */
const GenerateCommand: GenerateCommandType = Command.make("generate", GenerateConfig, HandleGenerate);
