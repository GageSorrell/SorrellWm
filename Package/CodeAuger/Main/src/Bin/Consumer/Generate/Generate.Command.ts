/**
 * @file      Generate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type * as Consumer from "../../../Consumer/Config/index.js";
import * as LoadConfig from "../Shared/LoadConfig.js";
import type * as Provider from "../../../Provider/index.js";
import * as TypeScript from "typescript";
import { Command, Options } from "@sorrell/effect/unstable/cli";
import type {
    EGetGenerateConfig,
    GenerateCommandEffect,
    GenerateCommandType,
    GenerateConfigPart,
    GenerateConfigRecord,
    GetOutPathFn
} from "./Generate.Command.Types.js";
import { Effect, Option, Record, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import { GetDescendantTypes, MapRecordEntriesEffect } from "./Generate.Internal.js";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import type { CliApp } from "@sorrell/effect/unstable/cli";
import type { ConfigError } from "effect/ConfigError";
import type { ConfigFileError } from "@sorrell/effect/unstable/cli/ConfigFile";
import { GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import { GetPackageNameSafe } from "../../Shared/Config.js";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import { MakeConfig } from "../../Shared/SubCommand.js";
import type { PlatformError } from "@effect/platform/Error";
import type { Requirements } from "@sorrell/utilities/effect";

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const GenerateConfig = MakeConfig({
    Watch: pipe(
        Options.boolean("watch", { aliases: [ "w" ] }),
        Options.withDefault(false),
        Options.withDescription(
            "Watch the codebase, and regenerate modules when a file in the codebase is saved."
        )
    )
});

function GetGenerateConfig(Cwd: string): EGetGenerateConfig
{
    return Effect.gen(function* ()
    {
        const { Providers: ConsumerPart } = yield* LoadConfig.Consumer(Cwd);

        const IsProviderEnabled = (Provider: string): boolean => (
            ConsumerPart !== undefined &&
            ConsumerPart !== null &&
            Provider in ConsumerPart &&
            (
                ConsumerPart[Provider] === true ||
                (
                    typeof ConsumerPart[Provider] === "object" &&
                    "Enabled" in ConsumerPart[Provider] &&
                    typeof ConsumerPart[Provider].Enabled === "boolean" &&
                    ConsumerPart[Provider].Enabled === true
                )
            )
        );

        const EnabledProviders: ReadonlyArray<string> =
            Object.keys(ConsumerPart).filter(IsProviderEnabled);

        const NodeModulesDirectory: string = yield* GetNodeModulesDirectory(Cwd);

        type ToEntryEffect =
            Effect.Effect<
                [ string, GenerateConfigPart ],
                | PackageJsonParseError
                | ConfigError
                | ConfigFileError
                | RootDirectoryNotFoundError,
                CliApp.CliApp.Environment
            >;

        const ToEntry = (PackageName: string): ToEntryEffect => Effect.gen(function* ()
        {
            const ProviderPart: Provider.Config =
                yield* LoadConfig.Provider(PackageName, NodeModulesDirectory);

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
            Effect.map(Record.fromEntries)
        );
    });
}

/**
 * Given a {@link InPath | path}, if it is relative, then resolve it relative to the
 * root directory of the package that contains the {@link Cwd}.
 *
 * @param Cwd - The `cwd` option value.
 * @param InPath - The path to handle.
 *
 * @returns {Effect.Effect<string, PlatformError, EffectPath.Path>} The given {@link InPath | path},
 * made absolute, relative to the package root directory of the given {@link Cwd}, if not already absolute.
 */
function GetConsumerPath(
    Cwd: string,
    InPath: string
): Effect.Effect<string, any | PlatformError | RootDirectoryNotFoundError, EffectPath.Path | FileSystem.FileSystem>
// ): Effect.Effect<string, PlatformError | RootDirectoryNotFoundError, EffectPath.Path>
{
    return Effect.gen(function* ()
    {
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const ConsumerRoot: string = yield* GetPackageRootDirectory(Cwd);

        return Path.isAbsolute(InPath)
            ? InPath
            : Path.resolve(ConsumerRoot, InPath);
    });
}

/**
 * If the consumer's base path directory does not exist yet, then create it.
 *
 * @param Cwd - The `cwd` option.
 * @param BasePath - The base path config setting.
 *
 * @returns {Effect.Effect<void, never, Requirements.FsPath>} The effect that performs this task.
 */
function EnsureBasePath(
    Cwd: string,
    BasePath: string
): Effect.Effect<void, PlatformError | RootDirectoryNotFoundError, Requirements.FsPath>
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;

        const Out: string = yield* GetConsumerPath(Cwd, BasePath);

        yield* Fs.makeDirectory(Out, { recursive: true });
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
): (GenerateConfigPart: GenerateConfigPart) => Effect.Effect<string, RootDirectoryNotFoundError, EffectPath.Path | FileSystem.FileSystem>
{
    return function(
        GenerateConfigPart: GenerateConfigPart
    ): Effect.Effect<string, RootDirectoryNotFoundError, EffectPath.Path | FileSystem.FileSystem>
    {
        return Effect.gen(function* ()
        {
            const ConsumerTypes: ReadonlyArray<Provider.ExportedType> = [ ];
            const ToPropertyDeclaration = ({ Name }: Provider.ExportedType): string =>
                `${ Name }: ${ Name };`;

            const PrependedLines: string = Option.match(
                ConsumerConfig.PrependedLines,
                {
                    onNone: () => "",
                    onSome: (Value: ReadonlyArray<string>) =>
                    {
                        return Value.join("\n") + "\n\n";
                    }
                });

            const DisableFormatterComments: string | undefined =
                Option.match(ConsumerConfig.DisabledFormatters, {
                    onNone: () => undefined,
                    onSome: (Value: ReadonlyArray<Consumer.CodeFormatter>) =>
                    {
                        if (Value.includes("eslint") || Value.includes("ox"))
                        {
                            return "/* eslint-disable */";
                        }

                        return undefined;
                    }
                });

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

function MakeGetOutPath(Cwd: string, BasePath: string): GetOutPathFn
{
    return function GetOutPath(
        PackageName: string
    ): Effect.Effect<string, PlatformError | RootDirectoryNotFoundError, EffectPath.Path | FileSystem.FileSystem>
    {
        return Effect.gen(function* ()
        {
            const Path: EffectPath.Path = yield* EffectPath.Path;

            const PackageNameSafe: string = GetPackageNameSafe(PackageName) + ".ts";

            const OutDirectory: string = yield* GetConsumerPath(Cwd, BasePath);

            return Path.join(OutDirectory, PackageNameSafe);
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
function WatchGenerate(
    _Options: Omit<Handler.Argument<typeof GenerateConfig>, "Watch">
): GenerateCommandEffect
{
    return Effect.gen(function* ()
    {
    });
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function RunGenerate(
    Options: Omit<Handler.Argument<typeof GenerateConfig>, "Watch">
): GenerateCommandEffect
{
    return Effect.gen(function* ()
    {
        const { Cwd } = Options;
        const GenerateConfig: GenerateConfigRecord = yield* GetGenerateConfig(Cwd);

        const ConsumerConfig: Consumer.Config = yield* LoadConfig.Consumer(Cwd);

        yield* EnsureBasePath(Cwd, ConsumerConfig.BasePath);

        type EGetModuleContents = (GenerateConfigPart: GenerateConfigPart) =>
        Effect.Effect<string, RootDirectoryNotFoundError, EffectPath.Path | FileSystem.FileSystem>;

        const GetModuleContents: EGetModuleContents = GetModuleContentsFactory(ConsumerConfig);

        const GeneratedContents: Readonly<Record<string, string>> =
            yield* Effect.all(Record.map(GenerateConfig, GetModuleContents));

        const GetOutPath: GetOutPathFn = MakeGetOutPath(Cwd, ConsumerConfig.BasePath);

        type ESwapNameWithPath =
            Effect.Effect<
                readonly [ string, string ],
                | PlatformError
                | RootDirectoryNotFoundError,
                | EffectPath.Path
                | FileSystem.FileSystem
            >;

        const SwapNameWithPath = (Contents: string, PackageName: string): ESwapNameWithPath =>
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
    const { Watch, ...Tail } = Options;

    return Watch
        ? RunGenerate(Tail)
        : WatchGenerate(Tail);
}

export/** The `generate` command, which generates code for consumers. */
const GenerateCommand: GenerateCommandType = Command.make("generate", GenerateConfig, HandleGenerate);
