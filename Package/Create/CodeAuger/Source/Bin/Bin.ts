#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import * as Clack from "@clack/prompts";
import * as Path from "path";
import type { BaseConfig, ConsumerConfig, Formatter } from "../../../../CodeAuger/Distribution/Consumer.js";
import { promises as Fs, type Stats, accessSync, existsSync, statSync } from "fs";
import { GetPackageJson, GetPackageRootDirectory } from "@sorrell/utilities/npm";
import Chalk from "chalk";
import { Code } from "@sorrell/cli-utilities/format";
import type { IBase } from "package-json-type";
import { Spawn as SpawnPty } from "@sorrell/cli-utilities/pty";

const CodeAuger: string = Code("code-auger");

async function RunTask<DataType>(
    Task: Promise<DataType>,
    StartMessage: string,
    SuccessMessage:
        | string
        | ((Result: DataType) => string),
    ErrorMessage: string
): Promise<DataType | undefined>
{
    const Spinner: Clack.SpinnerResult = Clack.spinner({ indicator: "timer" });

    function HandleSuccessMessage(Result: DataType): string
    {
        if (typeof SuccessMessage === "string")
        {
            return SuccessMessage;
        }
        else
        {
            return SuccessMessage(Result);
        }
    }

    Spinner.start(StartMessage);

    try
    {
        const Result: DataType = await Task;
        Spinner.stop(HandleSuccessMessage(Result));
        return Result;
    }
    catch
    {
        Spinner.error(ErrorMessage);
        return undefined;
    }
}

async function RunCommand(
    Command: string,
    Arguments: Array<string> = [ ],
    StartMessage: string,
    SuccessMessage: string,
    ErrorMessage: string
): Promise<void>
{
    type FOnExitResult =
        {
            exitCode: number;
        };

    const Task: Promise<boolean> =
        SpawnPty(Command, Arguments).OnExit.then(({ exitCode }: FOnExitResult) => exitCode === 0);

    await RunTask(Task, StartMessage, SuccessMessage, ErrorMessage);
}

async function PromptForConfigPath(): Promise<string>
{
    const DefaultConfigPath: string = "./code-auger.config.ts";
    const ConfigPath: string | symbol = await Clack.text({
        defaultValue: DefaultConfigPath,
        initialValue: DefaultConfigPath,
        message: `Where should ${ CodeAuger } write the config file?`,
        placeholder: DefaultConfigPath,
        validate: (Value: string | undefined): string | Error | undefined =>
        {
            if (Value === undefined || Value.trim().length === 0)
            {
                return undefined;
            }

            const NormalizedPath: string = Value.trim();

            if (!NormalizedPath.endsWith(".ts"))
            {
                return "The config file should be a TypeScript file.";
            }

            const ParentDirectoryPath: string = Path.dirname(Path.resolve(NormalizedPath));

            try
            {
                const ParentDirectoryStats: Stats = statSync(ParentDirectoryPath);

                if (!ParentDirectoryStats.isDirectory())
                {
                    return "The parent path exists, but is not a directory.";
                }
            }
            catch
            {
                return "The parent directory does not exist.";
            }

            try
            {
                accessSync(Path.resolve(NormalizedPath));

                return "A file already exists at this path.";
            }
            catch
            {
                return undefined;
            }
        }
    });

    if (Clack.isCancel(ConfigPath))
    {
        Clack.cancel("Operation cancelled.");
        process.exit(1);
    }

    return Path.resolve(ConfigPath);
}

async function GetDependencies(): Promise<ReadonlyArray<string>>
{
    const PackageJson: IBase = await GetPackageJson();

    return [
        ...Object.keys(PackageJson.dependencies || { }),
        ...Object.keys(PackageJson.devDependencies || { })
    ] as const;
}

/**
 * @deprecated This will be replaced with a better function under `code-auger`'s
 * "init-config" command.
 */
async function FindProviders(): Promise<ReadonlyArray<string>>
{
    async function Task(): Promise<ReadonlyArray<string>>
    {
        const Dependencies: ReadonlyArray<string> = await GetDependencies();
        const Root: string = await GetPackageRootDirectory();

        async function IsDependencyProvider(Dependency: string): Promise<boolean>
        {
            const PackagePathPart: ReadonlyArray<string> = Dependency.startsWith("@")
                ? Dependency.slice(1).split("/")
                : [ Dependency ];

            const DependencyCodeAugerConfigPath: string =
                Path.resolve(Root, "node_modules", ...PackagePathPart, "code-auger.provider.config.ts");

            return existsSync(DependencyCodeAugerConfigPath);
        }

        return Dependencies.filter(IsDependencyProvider);
    }

    const Result: ReadonlyArray<string> | undefined = await RunTask(
        Task(),
        `Looking for any installed dependencies that are ${ CodeAuger } providers.`,
        (Result: ReadonlyArray<string>) =>
            Result.length > 0
                ? `Found ${ Result.length } ${ CodeAuger } providers already installed!`
                : `Found no ${ CodeAuger } providers installed ${ Chalk.italic("(yet)!") }`,
        `Failed to determine whether any ${ CodeAuger } providers were already installed.`
    );

    if (Result === undefined)
    {
        process.exit(1);
    }

    return Result as ReadonlyArray<string>;
}

async function WriteConfigFile(ConfigPath: string, Providers: ReadonlyArray<string>): Promise<void>
{
    async function GetInstalledFormatters(): Promise<ReadonlyArray<Formatter>>
    {
        const SupportedFormatters: ReadonlyArray<Formatter> =
            [
                "eslint",
                "ox",
                "prettier"
            ] as const;

        const Dependencies: ReadonlyArray<string | Formatter> = await GetDependencies();

        return SupportedFormatters.filter((Formatter: Formatter) => Dependencies.includes(Formatter));
    }

    function CommentOutLine(Line: string): string
    {
        // 1. Get number of spaces before first nonwhitespace character
        // 2. At the first nonwhitespace character, insert two forward slashes and a space
        return Line;
    }

    const DefaultBaseConfig: BaseConfig =
        {
            DisableFormatter: await GetInstalledFormatters()
        };

    const OutConfig: ConsumerConfig = { };

    async function Task(): Promise<void>
    {
        await Fs.writeFile(ConfigPath, JSON.stringify(OutConfig, null, 4), { encoding: "utf-8" });
    }

    const ConfigPathFormatted: string = Code(Path.join(Path.dirname(ConfigPath), Path.basename(ConfigPath)));

    await RunTask(
        Task(),
        `Writing a basic config file to ${ ConfigPathFormatted }.`,
        `Successfully wrote config file to ${ ConfigPathFormatted }!`,
        `Failed to write config file to ${ ConfigPathFormatted }.`
    );
}

async function Main(): Promise<void>
{
    const DevDependency: string = Code("devDependency");

    Clack.intro(`${ Chalk.bgCyan(Chalk.black(" init code-auger ")) }`);

    await RunCommand(
        "npm",
        "install --save-dev code-auger".split(" "),
        `Installing ${ CodeAuger } as a ${ DevDependency }.`,
        `Successfully installed ${ CodeAuger } to your package as a ${ DevDependency }!`,
        `Failed to install ${ CodeAuger } to your package.`
    );

    await RunCommand(
        "npm",
        "install --save-dev code-auger".split(" "),
        `Installing ${ CodeAuger } as a ${ DevDependency }.`,
        `Successfully installed ${ CodeAuger } to your package as a ${ DevDependency }!`,
        `Failed to install ${ CodeAuger } to your package.`
    );

    const Providers: ReadonlyArray<string> = await FindProviders();

    const ConfigPath: string = await PromptForConfigPath();

    await WriteConfigFile(ConfigPath, Providers);
}

await Main();

