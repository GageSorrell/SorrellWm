/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type Dirent, existsSync } from "fs";
import { GetPackageJson, GetPackageRootDirectory } from "@sorrell/utilities";
import { isAbsolute, resolve } from "path";
import { readFile, readdir } from "fs/promises";
import type { CliConfig } from "./Config.Types";
import type { IPackageJson } from "package-json-type";
import type { PackageNameType } from "./Shared.Types";

export const DefaultConfigFileName: string = "electron-reactive-event.config.jsonc";

/**
 * The name of the property that a dependent may specify in their `package.json#config`,
 * to specify a custom config file path.
 */
export const PackageJsonConfigProperty: PackageNameType =
    "electron-reactive-event-cli" as const;

export async function HasConfig(Path?: string): Promise<boolean>
{
    return (GetConfigPath(Path) !== undefined);
}

export async function GetConfigPath(Path?: string): Promise<string | undefined>
{
    try
    {
        const Root: string = await GetPackageRootDirectory(Path);
        const DefaultPath: string = resolve(Root, DefaultConfigFileName);
        const HasConfigAtDefaultPath: boolean = existsSync(DefaultPath);
        if (HasConfigAtDefaultPath)
        {
            return DefaultPath;
        }

        const PackageJson: IPackageJson = await GetPackageJson();

        if ("config" in PackageJson && PackageJson.config !== undefined)
        {
            if (
                PackageJsonConfigProperty in PackageJson.config &&
                typeof PackageJson.config[PackageJsonConfigProperty] === "string"
            )
            {
                const ConfigPath: string = PackageJson.config[PackageJsonConfigProperty];
                return isAbsolute(ConfigPath)
                    ? ConfigPath
                    : resolve(Root, ConfigPath);
            }
        }
    }
    catch
    {
        return undefined;
    }

    return undefined;
}

export async function IsConfigValid(Path?: string): Promise<boolean>
{
    if (!(await HasConfig(Path)))
    {
        return false;
    }

    try
    {
        const Config: unknown = await GetConfig(Path);

        return (
            typeof Config === "object" &&
            Config !== null &&
            "$schema" in Config &&
            typeof Config.$schema === "string" &&
            "AugmentationModulePath" in Config &&
            typeof Config.AugmentationModulePath === "string" &&
            "PackageKey" in Config &&
            typeof Config.PackageKey === "string" &&
            "ScopedModulePath" in Config &&
            typeof Config.ScopedModulePath === "string"
        );
    }
    catch
    {
        return false;
    }
}

async function ParseJsonc<OutType>(Path: string): Promise<OutType>
{
    const File: string = (await readFile(Path, { encoding: "utf-8" }))
        .split("\n")
        .filter((Line: string) => !Line.trim().startsWith("//"))
        .join("\n");

    return JSON.parse(File) as OutType;
}

/**
 * Get the {@link CliConfig} of the given project.
 *
 * @throws If the root directory cannot be determined, or if there is no config file.
 *
 * @see {@link GetConfigSafe} for a version that does *not* throw, and patches any missing
 * properties with default values.
 *
 * @param Path - *(Optional)* A path of a directory in which the given project resides.
 * If no {@link Path} is given, then the current working directory is used.
 * @returns The config of the project at the given {@link Path} (or current
 * working directory if no {@link Path} is given).
 */
export async function GetConfig(Path?: string): Promise<CliConfig>
{
    // const Root: string = await GetPackageRootDirectory(Path);

    const ConfigPath: string | undefined = await GetConfigPath(Path);

    if (ConfigPath !== undefined)
    {
        return ParseJsonc<CliConfig>(ConfigPath);
    }
    else
    {
        throw new Error("No config file was found.");
    }
}

export async function GetDefaultConfig(Path?: string): Promise<CliConfig>
{
    const Root: string = await GetPackageRootDirectory(Path);

    const SourcePath: string = await (async (): Promise<string> =>
    {
        const Directories: Array<string> = (await readdir(Root, { withFileTypes: true }))
            .filter((Entry: Dirent) => Entry.isDirectory())
            .map((Entry: Dirent) => Entry.name);

        if (Directories.includes("src"))
        {
            return resolve(Root, "src");
        }
        else if (Directories.includes("Source"))
        {
            return resolve(Root, "Source");
        }
        else
        {
            return Root;
        }
    })();

    const DefaultAugmentationFileName: string = "Reactive.Events.Generated.Types.ts";

    const DefaultScopedModuleFileName: string = "Reactive.Generated.ts";

    const DefaultPackageKey: string = await (async (): Promise<string> =>
    {
        type PackageJson = { name: string; };
        const PackageJson: PackageJson =
            JSON.parse(await readFile(resolve(Root, "package.json"), { encoding: "utf-8" })) as PackageJson;

        return PackageJson.name.replace("@", "").replaceAll("/", "").replaceAll("-", "");
    })();

    return {
        AugmentationModulePath: resolve(SourcePath, DefaultAugmentationFileName),
        PackageKey: DefaultPackageKey,
        ScopedModulePath: resolve(SourcePath, DefaultScopedModuleFileName)
    };
}

export async function GetConfigSafe(Path?: string): Promise<CliConfig>
{
    try
    {
        const Config: unknown = await GetConfig(Path);
        const Default: CliConfig = await GetDefaultConfig(Path);
        if (typeof Config === "object" && Config !== null)
        {
            const Out: CliConfig = { ...Default };

            if ("AugmentationModulePath" in Config && typeof Config.AugmentationModulePath === "string")
            {
                Out.AugmentationModulePath = Config.AugmentationModulePath;
            }

            if ("PackageKey" in Config && typeof Config.PackageKey === "string")
            {
                Out.PackageKey = Config.PackageKey;
            }

            if ("ScopedModulePath" in Config && typeof Config.ScopedModulePath === "string")
            {
                Out.ScopedModulePath = Config.ScopedModulePath;
            }

            if (
                "IpcModulePath" in Config &&
                typeof Config.IpcModulePath === "object" &&
                Config.IpcModulePath !== null
            )
            {
                Out.IpcModulePath = Config.IpcModulePath;
            }

            return Out;
        }
        else
        {
            return GetDefaultConfig(Path);
        }
    }
    catch
    {
        return GetDefaultConfig(Path);
    }
}
