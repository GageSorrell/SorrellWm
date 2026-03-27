#!/usr/bin/env node
/* File:      SetupCommand.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import { Code, Confirm } from "@sorrell/cli-utilities";
import { DefaultConfigFileName, RunCommand } from "../index.js";
import type { FCliConfig, FSetupOptions } from "../index.js";
import {
    type FPackageJson,
    type FRegistrarDefinition,
    IsPackageJsonConfigNeeded,
    SelectBuiltModulePath,
    SelectConfigDirectoryPath,
    SelectConfigName,
    SelectRegistrarInterface } from "./index.js";
import { GetPackageRootDirectory, GetSafeNewPath, Try } from "@sorrell/utilities";
import { basename, dirname, extname, relative, resolve, sep } from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import ora, { type Ora as IOra } from "ora";
import Chalk from "chalk";
import { Command } from "commander";
import type { IPackageJson } from "package-json-type";
import { Register } from "../Register/RegisterCommand.js";

function GetEmptyCliConfig(): FCliConfig
{
    return {
        main:
        {
            name: "",
            path: ""
        },
        outPath: "",
        renderer:
        {
            name: "",
            path: ""
        }
    };
}

async function WriteCliConfig(FileName: string, CliConfig: FCliConfig): Promise<void>
{
    const Ora: IOra = ora({
        spinner: "point",
        text: `Writing ${ Code(FileName) } to your package's root directory...`
    });

    const RootDirectory: string = await GetPackageRootDirectory();

    const ConfigPathBase: string = resolve(RootDirectory, FileName);

    const ConfigPath: string = await GetSafeNewPath(ConfigPathBase);

    const ConfigContents: string = JSON.stringify(CliConfig, null, 4);

    const { Error } = await Try(writeFile(ConfigPath, ConfigContents));

    const ConfigPathFileName: string = basename(ConfigPath);

    if (Error === undefined)
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Ora.succeed(`The file ${ Code(ConfigPath) } was written successfully!`);
        console.log(`Please open the file and fill out its fields to use the ${ Code("register") } command.`);
    }
    else
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Ora.fail(`The file ${ Code(ConfigPathFileName) } could not be written in ${ Code(RootDirectory) }.  Here is the error:`);
        console.error(JSON.stringify(Error, null, 4) + "\n");
    }
}

function GetOutputModuleSpecifierExtension(FilePath: string): string
{
    const Extension: string = extname(FilePath).toLowerCase();

    switch (Extension)
    {
        case ".ts":
        case ".tsx":
        {
            return ".js";
        }

        case ".mts":
        {
            return ".mjs";
        }

        case ".cts":
        {
            return ".cjs";
        }

        default:
        {
            return Extension;
        }
    }
}

function ReplaceFileExtension(
    FilePath: string,
    NewExtension: string
): string
{
    const CurrentExtension: string = extname(FilePath);

    if (CurrentExtension.length === 0)
    {
        return FilePath;
    }

    return FilePath.slice(0, -CurrentExtension.length) + NewExtension;
}

function GetRelativeModuleSpecifier(
    FromModulePath: string,
    ToModulePath: string
): string
{
    const FromDirectoryPath: string = dirname(resolve(FromModulePath));
    const ToAbsolutePath: string = resolve(ToModulePath);

    let RelativePath: string = relative(FromDirectoryPath, ToAbsolutePath).replaceAll("\\", "/");

    if (!RelativePath.startsWith("."))
    {
        RelativePath = `./${RelativePath}`;
    }

    return ReplaceFileExtension(
        RelativePath,
        GetOutputModuleSpecifierExtension(ToAbsolutePath)
    );
}

function GetGeneratedModuleText(
    MainRegistrar: FRegistrarDefinition,
    RendererRegistrar: FRegistrarDefinition,
    OutputModulePath: string
): string
{
    const MainModuleSpecifier: string = GetRelativeModuleSpecifier(
        OutputModulePath,
        MainRegistrar.Path
    );

    const RendererModuleSpecifier: string = GetRelativeModuleSpecifier(
        OutputModulePath,
        RendererRegistrar.Path
    );

    return [
        "/* eslint-disable */",
        "",
        "/* Auto-generated file. */",
        "",
        `declare module "${ MainModuleSpecifier }"`,
        "{",
        `    interface ${ MainRegistrar.Name }`,
        "    {",
        "",
        "    }",
        "}",
        "",
        `declare module "${ RendererModuleSpecifier }"`,
        "{",
        `    interface ${ RendererRegistrar.Name }`,
        "    {",
        "",
        "    }",
        "}",
        ""
    ].join("\n");
}

async function WriteBuiltModule(
    MainRegistrar: FRegistrarDefinition,
    RendererRegistrar: FRegistrarDefinition,
    ModulePath: string
): Promise<void>
{
    const OutputModulePathResolved: string = resolve(ModulePath);

    await mkdir(dirname(OutputModulePathResolved), { recursive: true });

    const ModuleText: string = GetGeneratedModuleText(
        MainRegistrar,
        RendererRegistrar,
        OutputModulePathResolved
    );

    await writeFile(OutputModulePathResolved, ModuleText, "utf8");
}

async function GetPackageJson(): Promise<FPackageJson>
{
    const Path: string = resolve(await GetPackageRootDirectory(), "package.json");
    const { Data: PackageJsonContents, Error } = await Try(readFile(Path, { encoding: "utf-8" }));
    if (PackageJsonContents === undefined)
    {
        const ErrorMessage: string = `Could not open your project's ${ Code("package.json") }.  \
        The attempted path was ${ Code(Path) }.\n`;
        console.error(ErrorMessage, JSON.stringify(Error, null, 4));
        process.exit(1);
    }
    else
    {
        return JSON.parse(PackageJsonContents) as FPackageJson;
    }
}

async function SetPackageJson(
    PackageJson: FPackageJson | IPackageJson,
    Path: string | undefined = undefined
): Promise<void>
{
    const OutPath: string = Path || resolve(await GetPackageRootDirectory(), "package.json");
    const PackageJsonContents: string = JSON.stringify(PackageJson, null, 4);

    await writeFile(OutPath, PackageJsonContents, { encoding: "utf-8" });
}

async function SetupInteractive(this: Command): Promise<void>
{
    const MainRegistrar: FRegistrarDefinition = await SelectRegistrarInterface("IMainRegistrarBase");
    const RendererRegistrar: FRegistrarDefinition = await SelectRegistrarInterface("IRendererRegistrarBase");

    const OtherSep: typeof sep = sep === "/"
        ? "\\"
        : "/";

    const FixSep = (InPath: string): string =>
    {
        return InPath.replaceAll(OtherSep, sep);
    };

    MainRegistrar.Path = FixSep(MainRegistrar.Path);
    RendererRegistrar.Path = FixSep(RendererRegistrar.Path);

    const BuiltModulePath: string = resolve(
        await SelectBuiltModulePath(),
        "electronReactiveEvent.Generated.ts"
    );

    const OraWriteBuiltModule: IOra = ora({ text: "Writing new module at the selected path..." }).start();
    await WriteBuiltModule(MainRegistrar, RendererRegistrar, BuiltModulePath);
    OraWriteBuiltModule.succeed();

    const ConfigDirectoryPath: string = await SelectConfigDirectoryPath();

    const ConfigFileName: string = await SelectConfigName(ConfigDirectoryPath);

    const OraWriteConfig: IOra = ora({ text: `Writing ${ Code(ConfigFileName) }...` }).start();
    const Config: FCliConfig =
        {
            main:
            {
                name: MainRegistrar.Name,
                path: MainRegistrar.Path
            },
            outPath: BuiltModulePath,
            renderer:
            {
                name: RendererRegistrar.Name,
                path: RendererRegistrar.Path
            }
        };

    const ConfigString: string = JSON.stringify(Config, null, 4);
    const ConfigPath: string = resolve(ConfigDirectoryPath, ConfigFileName);
    const { Error } = await Try(writeFile(ConfigPath, ConfigString, { encoding: "utf-8" }));
    if (Error === undefined)
    {
        OraWriteConfig.succeed();
    }
    else
    {
        OraWriteConfig.fail();
        const ErrorMessage: string = `Failed to write the config file ${ ConfigFileName } in \
        ${ ConfigDirectoryPath }.\n`;

        console.error(ErrorMessage, JSON.stringify(Error, null, 4));
        process.exit(1);
    }

    if (await IsPackageJsonConfigNeeded(ConfigDirectoryPath, ConfigFileName))
    {
        const text: string = `Setting ${ Code("config.electron-reactive-event-cli") } \
        in your project's ${ Code("package.json") }...`;
        const OraWriteConfigProperty: IOra = ora({ spinner: "point", text }).start();

        const ConfigPart: Record<"electron-reactive-event-cli", string> =
            {
                "electron-reactive-event-cli": ConfigPath
            };

        const PackageJson: FPackageJson = await GetPackageJson();

        const HasConfigProperty: boolean = (
            "config" in PackageJson &&
            typeof PackageJson.config === "object" &&
            PackageJson.config !== null
        );

        if (!HasConfigProperty)
        {
            PackageJson.config = ConfigPart;
        }
        else
        {
            PackageJson.config =
                {
                    ...PackageJson.config,
                    ...ConfigPart
                };
        }

        const { Error: UpdatePackageJsonError } = await Try(SetPackageJson(PackageJson));
        if (UpdatePackageJsonError !== undefined)
        {
            OraWriteConfigProperty.fail();
            const ErrorMessage: string = `Failed to write the updated ${ Code("package.json") }.\n`;
            console.error(ErrorMessage, JSON.stringify(UpdatePackageJsonError, null, 4));
            process.exit(1);
        }

        OraWriteConfigProperty.succeed();
    }

    console.log("🥳 " + Chalk.greenBright(`Completed ${ Code("setup") } successfully!`));

    console.log(
        `Your project has been configured to support the ${ Code("register") } command ` +
        `provided by ${ Code("electron-reactive-event-cli") }.\n`
    );

    const ShouldRunRegister: boolean = await Confirm({
        default: true,
        message: `Run the ${ Code("register") } command?`
    });

    if (ShouldRunRegister)
    {
        await Register();
    }

    process.exit(0);
}

async function SetupNoInteractive(this: Command): Promise<void>
{
    await WriteCliConfig(DefaultConfigFileName, GetEmptyCliConfig());
}

async function Setup(this: Command): Promise<void>
{
    const { interactive: IsInteractive }: FSetupOptions = this.opts();

    if (IsInteractive)
    {
        await SetupInteractive.call(this);
        return;
    }
    else
    {
        await SetupNoInteractive.call(this);
        return;
    }
}

async function Main(): Promise<void>
{
    const SetupCommand: Command = new Command("setup")
        /* eslint-disable-next-line @stylistic/max-len */
        .description("Create the config file needed to register your event declarations automatically in your project's build step.")
        .option("--no-interactive", "Write an empty settings file to the root of your package.", true)
        .action(Setup);

    await RunCommand(SetupCommand);
}

Main();
