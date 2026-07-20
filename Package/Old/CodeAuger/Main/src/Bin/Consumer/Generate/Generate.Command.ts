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
import { Command, Flag } from "@sorrell/effect/unstable/cli";
import type {
    EGetGenerateConfig,
    GenerateCommandEffect,
    GenerateCommandType,
    GenerateConfigPart,
    GenerateConfigRecord,
    GetOutPathFn
} from "./Generate.Command.Types.js";
import { Effect, FileSystem, Path as PathService, Record, pipe } from "effect";
import { GetDescendantTypes, MapRecordEntriesEffect } from "./Generate.Internal.js";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import { $SchemaKey } from "../../../Shared/Config/Config.ts";
import type { Environment } from "effect/unstable/cli/Prompt";
import { GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import { GetPackageNameSafe } from "../../Shared/Config.js";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { PlatformError } from "effect/PlatformError";
import { RootCommand } from "../../Shared/Master.Command.ts";

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const GenerateConfig =
    {
        Watch: pipe(
            Flag.boolean("watch"),
            Flag.withAlias("w"),
            Flag.withDefault(false),
            Flag.withDescription(
                "Watch the codebase, and regenerate modules when a file in the codebase is saved."
            )
        )
    };

function GetGenerateConfig(Cwd: string, ConsumerConfig: Consumer.Config): EGetGenerateConfig
{
    return Effect.gen(function* ()
    {
        const { Providers: ConsumerPart } = ConsumerConfig;

        const IsProviderEnabled = (Provider: string): boolean => (
            ConsumerPart !== undefined &&
            ConsumerPart !== null &&
            (
                typeof ConsumerPart !== "boolean" &&
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
            )
        );

        const EnabledProviders: ReadonlyArray<string> =
            Object.keys(ConsumerPart).filter(IsProviderEnabled);

        const NodeModulesDirectory: string = yield* GetNodeModulesDirectory(Cwd);

        type ToEntryEffect =
            Effect.Effect<
                [ string, GenerateConfigPart ],
                | string
                | PackageJsonParseError
                | RootDirectoryNotFoundError,
                Environment
            >;

        const ToEntry = (PackageName: string): ToEntryEffect => Effect.gen(function* ()
        {
            const ProviderPart: Provider.Config =
                yield* LoadConfig.Provider(PackageName, NodeModulesDirectory);

            return [
                PackageName,
                {
                    Consumer: ConsumerPart[PackageName],
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
 * @returns {Effect.Effect<string, PlatformError, PathService.Path>} The given {@link InPath | path},
 * made absolute, relative to the package root directory of the given {@link Cwd}, if not already absolute.
 */
function GetConsumerPath(
    Cwd: string,
    InPath: string
): Effect.Effect<
    string,
    | PlatformError
    | RootDirectoryNotFoundError,
    Environment
>
{
    return Effect.gen(function* ()
    {
        const Path: PathService.Path = yield* PathService.Path;

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
 * @returns {Effect.Effect<void, never, Environment>} The effect that performs this task.
 */
function EnsureBasePath(
    Cwd: string,
    BasePath: string
): Effect.Effect<void, PlatformError | RootDirectoryNotFoundError, Environment>
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
// ): Effect.Effect<string, never, PathService.Path>
// {
//     return Effect.gen(function* ()
//     {
//         const Path: PathService.Path = yield* PathService.Path;

//         const ProviderPath: string = Provider.Path || `./${ PackageName }`;

//         return Path.isAbsolute(ProviderPath)
//             ? ProviderPath
//             : Path.join(BasePath, ProviderPath);
//     });
// }

function GetModuleContentsFactory(
    ConsumerConfig: Consumer.Config
): (GenerateConfigPart: GenerateConfigPart) => Effect.Effect<
    string,
    RootDirectoryNotFoundError,
    Environment
>
{
    return function(
        GenerateConfigPart: GenerateConfigPart
    ): Effect.Effect<string, RootDirectoryNotFoundError, PathService.Path | FileSystem.FileSystem>
    {
        return Effect.gen(function* ()
        {
            const ConsumerTypes: ReadonlyArray<typeof Provider.ExportedType.Type> = [ ];
            const ToPropertyDeclaration = ({ Name }: typeof Provider.ExportedType.Type): string =>
                `${ Name }: ${ Name };`;

            const PrependedLines: string = ConsumerConfig.PrependedLines !== undefined
                ? ConsumerConfig.PrependedLines.join("\n") + "\n\n"
                : "";

            const DisableFormatterComments: string | undefined =
                ConsumerConfig.DisabledFormatters !== undefined
                    ? ((): string | undefined =>
                    {
                        const UsesEsLintOrOx: boolean | undefined = (
                            ConsumerConfig.DisabledFormatters?.includes("eslint") ||
                            ConsumerConfig.DisabledFormatters?.includes("ox")
                        );

                        if (UsesEsLintOrOx)
                        {
                            return "/* eslint-disable */";
                        }

                        return undefined;
                    })()
                    : undefined;

            const PropertyDeclarations: string = ConsumerTypes.map(ToPropertyDeclaration).join("\n    ");

            const { Provider: ProviderPart } = GenerateConfigPart;

            const ProviderImport: string = `import "${ ProviderPart.Interface.Path }";`;

            const TsConfigPath: string | undefined = TypeScript.findConfigFile(
                yield* GetPackageRootDirectory(),
                TypeScript.sys.fileExists,
                ConsumerConfig.TsConfigPath || "tsconfig.json"
            );

            if (TsConfigPath === undefined)
            {
                return yield* Effect.die(
                    "Could not find your package's TypeScript config file!  Exiting..."
                );
            }

            const DescendantTypes: ReadonlyArray<typeof Provider.ExportedType.Type> =
                yield* GetDescendantTypes(TsConfigPath, ProviderPart.GenericProperty);

            type DescendantModule =
                Readonly<{
                    Types: ReadonlyArray<string>;
                    Path: string;
                }>;

            const GetImportStatement = ({ Path, Types }: DescendantModule): string =>
                `import type ${ Types.join(", ") } from "${ Path }";`;

            const DescendantModuleNames: Set<string> = new Set<string>(
                DescendantTypes.map((Descendant: typeof Provider.ExportedType.Type): string =>
                {
                    return Descendant.Path;
                }));

            const GetDescendantsFromModule = (ModulePath: string): DescendantModule =>
            {
                return {
                    Path: ModulePath,
                    Types: DescendantTypes.filter((Descendant: typeof Provider.ExportedType.Type): boolean =>
                    {
                        return Descendant.Path === ModulePath;
                    }).map((Descendant: typeof Provider.ExportedType.Type): string => Descendant.Name)
                } as const;
            };

            const DescendantModules: ReadonlyArray<DescendantModule> =
                Array.from(DescendantModuleNames).map(GetDescendantsFromModule);

            const ConsumerImports: string = DescendantModules.map(GetImportStatement).join("\n");

            const ModuleDeclaration: string = `declare module "${ ProviderPart.Interface.Path }"
{
    interface ${ ProviderPart.Interface.Name }
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
    ): Effect.Effect<
        string,
        | PlatformError
        | RootDirectoryNotFoundError,
        Environment
    >
    {
        return Effect.gen(function* ()
        {
            const Path: PathService.Path = yield* PathService.Path;

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
    _Options: Omit<Handler.Argument<typeof GenerateConfig>, "Watch">
): GenerateCommandEffect
{
    return Effect.gen(function* ()
    {
        const { Config, Cwd } = yield* RootCommand;
        if (typeof Config === "string")
        {
            return yield* Effect.die("@TODO");
        }
        const GenerateConfig: GenerateConfigRecord = yield* GetGenerateConfig(Cwd, Config);

        const ConfigBase: string | typeof Consumer.Schema.Type = (yield* RootCommand).Config;
        if (typeof ConfigBase === "string")
        {
            // @TODO
            yield* Effect.succeed(undefined as void);
        }
        const ConsumerConfig: Consumer.Config = (() =>
        {
            const { [ $SchemaKey ]: _, ...ConsumerConfig } = ConfigBase as typeof Consumer.Schema.Type;
            return ConsumerConfig;
        })();

        yield* EnsureBasePath(Cwd, ConsumerConfig.BasePath);

        type EGetModuleContents = (GenerateConfigPart: Readonly<{
            Consumer: boolean | typeof Consumer.Provider.Type;
            Provider: Provider.Config;
        }>) => Effect.Effect<string, RootDirectoryNotFoundError, Environment>;

        const GetModuleContents: EGetModuleContents = GetModuleContentsFactory(ConsumerConfig);

        const GeneratedContents: Readonly<Record<string, string>> =
            yield* Effect.all(Record.map(GenerateConfig, GetModuleContents));

        const GetOutPath: GetOutPathFn = MakeGetOutPath(Cwd, ConsumerConfig.BasePath);

        type ESwapNameWithPath =
            Effect.Effect<
                readonly [ string, string ],
                | PlatformError
                | RootDirectoryNotFoundError,
                Environment
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
