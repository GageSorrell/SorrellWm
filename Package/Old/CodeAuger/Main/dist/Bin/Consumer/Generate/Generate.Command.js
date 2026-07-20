/**
 * @file      Generate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import * as LoadConfig from "../Shared/LoadConfig.js";
import * as TypeScript from "typescript";
import { Command, Flag } from "@sorrell/effect/unstable/cli";
import { Effect, FileSystem, Path as PathService, Record, pipe } from "effect";
import { GetDescendantTypes, MapRecordEntriesEffect } from "./Generate.Internal.js";
import { $SchemaKey } from "../../../Shared/Config/Config.js";
import { GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import { GetPackageNameSafe } from "../../Shared/Config.js";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import { RootCommand } from "../../Shared/Master.Command.js";
/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const GenerateConfig = {
    Watch: pipe(Flag.boolean("watch"), Flag.withAlias("w"), Flag.withDefault(false), Flag.withDescription("Watch the codebase, and regenerate modules when a file in the codebase is saved."))
};
function GetGenerateConfig(Cwd, ConsumerConfig) {
    return Effect.gen(function* () {
        const { Providers: ConsumerPart } = ConsumerConfig;
        const IsProviderEnabled = (Provider) => (ConsumerPart !== undefined &&
            ConsumerPart !== null &&
            (typeof ConsumerPart !== "boolean" &&
                Provider in ConsumerPart &&
                (ConsumerPart[Provider] === true ||
                    (typeof ConsumerPart[Provider] === "object" &&
                        "Enabled" in ConsumerPart[Provider] &&
                        typeof ConsumerPart[Provider].Enabled === "boolean" &&
                        ConsumerPart[Provider].Enabled === true))));
        const EnabledProviders = Object.keys(ConsumerPart).filter(IsProviderEnabled);
        const NodeModulesDirectory = yield* GetNodeModulesDirectory(Cwd);
        const ToEntry = (PackageName) => Effect.gen(function* () {
            const ProviderPart = yield* LoadConfig.Provider(PackageName, NodeModulesDirectory);
            return [
                PackageName,
                {
                    Consumer: ConsumerPart[PackageName],
                    Provider: ProviderPart
                }
            ];
        });
        return yield* pipe(Effect.forEach(EnabledProviders, ToEntry), Effect.map(Record.fromEntries));
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
function GetConsumerPath(Cwd, InPath) {
    return Effect.gen(function* () {
        const Path = yield* PathService.Path;
        const ConsumerRoot = yield* GetPackageRootDirectory(Cwd);
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
function EnsureBasePath(Cwd, BasePath) {
    return Effect.gen(function* () {
        const Fs = yield* FileSystem.FileSystem;
        const Out = yield* GetConsumerPath(Cwd, BasePath);
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
function GetModuleContentsFactory(ConsumerConfig) {
    return function (GenerateConfigPart) {
        return Effect.gen(function* () {
            const ConsumerTypes = [];
            const ToPropertyDeclaration = ({ Name }) => `${Name}: ${Name};`;
            const PrependedLines = ConsumerConfig.PrependedLines !== undefined
                ? ConsumerConfig.PrependedLines.join("\n") + "\n\n"
                : "";
            const DisableFormatterComments = ConsumerConfig.DisabledFormatters !== undefined
                ? (() => {
                    const UsesEsLintOrOx = (ConsumerConfig.DisabledFormatters?.includes("eslint") ||
                        ConsumerConfig.DisabledFormatters?.includes("ox"));
                    if (UsesEsLintOrOx) {
                        return "/* eslint-disable */";
                    }
                    return undefined;
                })()
                : undefined;
            const PropertyDeclarations = ConsumerTypes.map(ToPropertyDeclaration).join("\n    ");
            const { Provider: ProviderPart } = GenerateConfigPart;
            const ProviderImport = `import "${ProviderPart.Interface.Path}";`;
            const TsConfigPath = TypeScript.findConfigFile(yield* GetPackageRootDirectory(), TypeScript.sys.fileExists, ConsumerConfig.TsConfigPath || "tsconfig.json");
            if (TsConfigPath === undefined) {
                return yield* Effect.die("Could not find your package's TypeScript config file!  Exiting...");
            }
            const DescendantTypes = yield* GetDescendantTypes(TsConfigPath, ProviderPart.GenericProperty);
            const GetImportStatement = ({ Path, Types }) => `import type ${Types.join(", ")} from "${Path}";`;
            const DescendantModuleNames = new Set(DescendantTypes.map((Descendant) => {
                return Descendant.Path;
            }));
            const GetDescendantsFromModule = (ModulePath) => {
                return {
                    Path: ModulePath,
                    Types: DescendantTypes.filter((Descendant) => {
                        return Descendant.Path === ModulePath;
                    }).map((Descendant) => Descendant.Name)
                };
            };
            const DescendantModules = Array.from(DescendantModuleNames).map(GetDescendantsFromModule);
            const ConsumerImports = DescendantModules.map(GetImportStatement).join("\n");
            const ModuleDeclaration = `declare module "${ProviderPart.Interface.Path}"
{
    interface ${ProviderPart.Interface.Name}
    {
        ${PropertyDeclarations}
    }
}\n`;
            const Sections = [
                PrependedLines,
                DisableFormatterComments,
                ProviderImport,
                ConsumerImports,
                ModuleDeclaration
            ];
            return Sections
                .filter((Element) => Element !== undefined)
                .join("\n\n") +
                "\n";
        });
    };
}
function MakeGetOutPath(Cwd, BasePath) {
    return function GetOutPath(PackageName) {
        return Effect.gen(function* () {
            const Path = yield* PathService.Path;
            const PackageNameSafe = GetPackageNameSafe(PackageName) + ".ts";
            const OutDirectory = yield* GetConsumerPath(Cwd, BasePath);
            return Path.join(OutDirectory, PackageNameSafe);
        });
    };
}
function WriteModule(Contents, OutPath) {
    return Effect.gen(function* () {
        const Fs = yield* FileSystem.FileSystem;
        yield* Fs.writeFileString(OutPath, Contents);
    });
}
/* eslint-disable-next-line jsdoc/require-jsdoc */
function WatchGenerate(_Options) {
    return Effect.gen(function* () {
    });
}
/* eslint-disable-next-line jsdoc/require-jsdoc */
function RunGenerate(_Options) {
    return Effect.gen(function* () {
        const { Config, Cwd } = yield* RootCommand;
        if (typeof Config === "string") {
            return yield* Effect.die("@TODO");
        }
        const GenerateConfig = yield* GetGenerateConfig(Cwd, Config);
        const ConfigBase = (yield* RootCommand).Config;
        if (typeof ConfigBase === "string") {
            // @TODO
            yield* Effect.succeed(undefined);
        }
        const ConsumerConfig = (() => {
            const { [$SchemaKey]: _, ...ConsumerConfig } = ConfigBase;
            return ConsumerConfig;
        })();
        yield* EnsureBasePath(Cwd, ConsumerConfig.BasePath);
        const GetModuleContents = GetModuleContentsFactory(ConsumerConfig);
        const GeneratedContents = yield* Effect.all(Record.map(GenerateConfig, GetModuleContents));
        const GetOutPath = MakeGetOutPath(Cwd, ConsumerConfig.BasePath);
        const SwapNameWithPath = (Contents, PackageName) => {
            return Effect.gen(function* () {
                return [yield* GetOutPath(PackageName), Contents];
            });
        };
        const PathsToGeneratedModules = yield* MapRecordEntriesEffect(GeneratedContents, SwapNameWithPath);
        yield* Effect.all(Record.map(PathsToGeneratedModules, WriteModule), { discard: true });
    });
}
function HandleGenerate(Options) {
    const { Watch, ...Tail } = Options;
    return Watch
        ? RunGenerate(Tail)
        : WatchGenerate(Tail);
}
export /** The `generate` command, which generates code for consumers. */ const GenerateCommand = Command.make("generate", GenerateConfig, HandleGenerate);
//# sourceMappingURL=Generate.Command.js.map