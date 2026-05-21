/**
 * @file      Config.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    ConfigCommandEffect,
    FConfigCommandOptions,
    GetBaseConfigFileTemplateEffect,
    GetConfigPathEffect,
    WriteConfigManifestsTypeEffect
} from "./Config.Command.Internal.Types.js";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import type { Config } from "./Config.Types.js";
import { Effect } from "effect";
import { GetPackageJson, GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import { DefaultConfigFileName } from "./Config.Command.js";
import type { IPackageJson } from "../../Miscellaneous/PackageJson.Provider.Types.js";
import type { TMutable } from "@sorrell/utilities/misc";
import type { PlatformError } from "@effect/platform/Error";
import { Code } from "@sorrell/cli-utilities/format";

function GetBaseConfigFileTemplate(): GetBaseConfigFileTemplateEffect
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const TemplateFilePath: string = Path.resolve(
            __dirname,
            "..", "..", "..",
            "Resource",
            "ConfigTemplate.ts"
        );

        return yield* Fs.readFileString(TemplateFilePath, "utf-8");
    });
}

function HandlePackageJson(ConfigPath: string, UpdatePackageJson: boolean): Effect.Effect<void, PlatformError | RootDirectoryNotFoundError | PackageJsonParseError, EffectPath.Path | FileSystem.FileSystem>
{
    return Effect.gen(function* ()
    {
        const Path: EffectPath.Path = yield* EffectPath.Path;
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const RootDirectory: string = yield* GetPackageRootDirectory();

        if (!UpdatePackageJson)
        {
            const IsConfigFileNameDefault: boolean = Path.basename(ConfigPath) !== DefaultConfigFileName;

            if (IsConfigFileNameDefault)
            {
                const IsConfigPathInRootDirectory: boolean =
                    Path.normalize(Path.resolve(Path.dirname(ConfigPath))) ===
                    Path.normalize(Path.resolve(RootDirectory));

                if (IsConfigPathInRootDirectory)
                {
                    return;
                }
            }
        }

        const PackageJson: TMutable<IPackageJson> = yield* GetPackageJson();
        if (!("code-auger" in PackageJson))
        {
            PackageJson["code-auger"] =
                {
                    config: ConfigPath
                };
        }
        else
        {
            PackageJson["code-auger"].config = ConfigPath
        }

        const PackageJsonPath: string = Path.resolve(RootDirectory, "package.json");

        yield* Fs.writeFileString(PackageJsonPath, JSON.stringify(PackageJson, null, 2));
    });
}

function GetConfigPath({ Out }: FConfigCommandOptions): GetConfigPathEffect
{
    return Effect.gen(function* ()
    {
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const Root: string = yield* GetPackageRootDirectory();
        return Path.resolve(Root, Out);
    });
}

function WriteConfigManifestsType(
    BaseConfig: string,
    Providers: ReadonlyArray<string>,
    NodeModulesPath: string
): WriteConfigManifestsTypeEffect
{
    return Effect.gen(function* ()
    {
        const Placeholder: string = "__DEFINE_MANIFESTS_TYPE__";

        const Out: string = `\
type ProvidersConfig =
    Readonly<{
        ${ "" }
    }>;`;

        return BaseConfig.replace(Placeholder, Out);
    });
}

function GetNodeModulesPath(InTestPath?: string): Effect.Effect<string, PlatformError | RootDirectoryNotFoundError, EffectPath.Path | FileSystem.FileSystem>
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const RootDirectory: string = yield* GetPackageRootDirectory();
        const NodeModules: string = "node_modules";

        const TestPathBase: string = InTestPath === undefined
            ? RootDirectory
            : InTestPath;

        const TestPath: string = Path.resolve(TestPathBase, NodeModules);

        if (yield* Fs.exists(TestPath))
        {
            if ((yield* Fs.stat(TestPath)).type === "Directory")
            {
                return TestPathBase;
            }
        }
        const ParentDirectory: string = Path.dirname(TestPathBase);

        if (yield* Fs.exists(ParentDirectory))
        {
            return yield* GetNodeModulesPath(ParentDirectory);
        }
        else
        {
            return yield* Effect.die(undefined);
        }
    });
}

export function HandleConfigCommand(Options: FConfigCommandOptions): ConfigCommandEffect
{
    return Effect.gen(function* ()
    {
        const ConfigPath: string = yield* GetConfigPath(Options);
        yield* HandlePackageJson(ConfigPath, Options.PackageJson);

        // yield* Fs.writeFileString();
    });
}
