/* File:      Config.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { type Dirent, existsSync } from "fs";
import { readFile, readdir } from "fs/promises";
import type { CliConfig } from "./Config.Types";
import { GetPackageRootDirectory } from "@sorrell/utilities";
import { resolve } from "path";

export const ConfigFileName: string = "electron-reactive-event.config.jsonc";

export async function HasConfig(): Promise<boolean>
{
    const Root: string = await GetPackageRootDirectory();
    return existsSync(resolve(Root, ConfigFileName));
}

export async function IsConfigValid(): Promise<boolean>
{
    if (!(await HasConfig()))
    {
        return false;
    }

    try
    {
        const Config: unknown = await GetConfig();

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

export async function GetConfig(): Promise<CliConfig>
{
    const Root: string = await GetPackageRootDirectory();

    const File: string = (await readFile(resolve(Root, ConfigFileName), { encoding: "utf-8" }))
        .split("\n")
        .filter((Line: string) => !Line.startsWith("//"))
        .join("\n");

    return JSON.parse(File) as CliConfig;
}

export async function GetDefaultConfig(): Promise<CliConfig>
{
    const Root: string = await GetPackageRootDirectory();

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
        $schema: "https://electron-reactive-event.sorrell.sh/CliConfig.Schema.json",
        AugmentationModulePath: resolve(SourcePath, DefaultAugmentationFileName),
        PackageKey: DefaultPackageKey,
        ScopedModulePath: resolve(SourcePath, DefaultScopedModuleFileName)
    };
}

export async function GetConfigSafe(): Promise<CliConfig>
{
    try
    {
        const Config: unknown = await GetConfig();
        const Default: CliConfig = await GetDefaultConfig();
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

            return Out;
        }
        else
        {
            return GetDefaultConfig();
        }
    }
    catch
    {
        return GetDefaultConfig();
    }
}
