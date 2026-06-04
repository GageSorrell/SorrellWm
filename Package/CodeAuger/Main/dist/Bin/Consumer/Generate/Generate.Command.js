/**
 * @file      Generate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import * as LoadConfig from "../Shared/LoadConfig.js";
import * as TypeScript from "typescript";
import { Command, Options } from "@sorrell/effect/unstable/cli";
import { Effect, Option, Record, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import { GetDescendantTypes, MapRecordEntriesEffect } from "./Generate.Internal.js";
import { GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import { GetPackageNameSafe } from "../../Shared/Config.js";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import { MakeConfig } from "../../Shared/SubCommand.js";
/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const GenerateConfig = MakeConfig({
    Watch: pipe(Options.boolean("watch", { aliases: ["w"] }), Options.withDefault(false), Options.withDescription("Watch the codebase, and regenerate modules when a file in the codebase is saved."))
});
function GetGenerateConfig(Cwd) {
    return Effect.gen(function* () {
        const { Providers: ConsumerPart } = yield* LoadConfig.Consumer(Cwd);
        const IsProviderEnabled = (Provider) => (ConsumerPart !== undefined &&
            ConsumerPart !== null &&
            Provider in ConsumerPart &&
            (ConsumerPart[Provider] === true ||
                (typeof ConsumerPart[Provider] === "object" &&
                    "Enabled" in ConsumerPart[Provider] &&
                    typeof ConsumerPart[Provider].Enabled === "boolean" &&
                    ConsumerPart[Provider].Enabled === true)));
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
 * @returns {Effect.Effect<string, PlatformError, EffectPath.Path>} The given {@link InPath | path},
 * made absolute, relative to the package root directory of the given {@link Cwd}, if not already absolute.
 */
function GetConsumerPath(Cwd, InPath) {
    return Effect.gen(function* () {
        const Path = yield* EffectPath.Path;
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
 * @returns {Effect.Effect<void, never, Requirements.FsPath>} The effect that performs this task.
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
function GetModuleContentsFactory(ConsumerConfig) {
    return function (GenerateConfigPart) {
        return Effect.gen(function* () {
            const ConsumerTypes = [];
            const ToPropertyDeclaration = ({ Name }) => `${Name}: ${Name};`;
            const PrependedLines = Option.match(ConsumerConfig.PrependedLines, {
                onNone: () => "",
                onSome: (Value) => {
                    return Value.join("\n") + "\n\n";
                }
            });
            const DisableFormatterComments = Option.match(ConsumerConfig.DisabledFormatters, {
                onNone: () => undefined,
                onSome: (Value) => {
                    if (Value.includes("eslint") || Value.includes("ox")) {
                        return "/* eslint-disable */";
                    }
                    return undefined;
                }
            });
            const PropertyDeclarations = ConsumerTypes.map(ToPropertyDeclaration).join("\n    ");
            const { Provider } = GenerateConfigPart;
            const ProviderImport = `import "${Provider.Interface.Path}";`;
            const TsConfigPath = TypeScript.findConfigFile(yield* GetPackageRootDirectory(), TypeScript.sys.fileExists, ConsumerConfig.TsConfigPath || "tsconfig.json");
            if (TsConfigPath === undefined) {
                return yield* Effect.dieMessage("Could not find your package's TypeScript config file!  Exiting...");
            }
            const DescendantTypes = yield* GetDescendantTypes(TsConfigPath, Provider.GenericProperty);
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
            const ModuleDeclaration = `declare module "${Provider.Interface.Path}"
{
    interface ${Provider.Interface.Name}
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
            const Path = yield* EffectPath.Path;
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
function RunGenerate(Options) {
    return Effect.gen(function* () {
        const { Cwd } = Options;
        const GenerateConfig = yield* GetGenerateConfig(Cwd);
        const ConsumerConfig = yield* LoadConfig.Consumer(Cwd);
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