/* File:      Prompt.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import {
    Code,
    Confirm,
    type FFileSelectorConfig,
    FileSelector,
    type Item } from "@sorrell/cli-utilities";
import { DefaultConfigFileName, type FBaseInterfaceName } from "../index.js";
import {
    type FReadConfigFileResult,
    type FRegistrarBaseMatch,
    type FRegistrarDefinition,
    type FRegistrarModuleArray,
    FormatDiagnostics,
    GetMatchingInterfacesInSourceFile,
    GetTsConfigPath,
    IsSearchableProjectSourceFile } from "./index.js";
import { constants as FileSystemConstants, access } from "fs/promises";
import { GetPackageRootDirectory, GetSafeNewPath, IsValidFileName } from "@sorrell/utilities";
import TypeScript, { type ProjectReference } from "typescript";
import { basename, dirname, normalize, relative, resolve } from "path";
import { input, select } from "@inquirer/prompts";
import ora, { type Ora as IOra } from "ora";
import Chalk from "chalk";

async function GetRegistrarModules(InterfaceName: FBaseInterfaceName): Promise<FRegistrarModuleArray>
{
    const ProjectRootDirectoryPathResolved: string = resolve(await GetPackageRootDirectory());
    const TsConfigPath: string = await GetTsConfigPath();

    await access(TsConfigPath, FileSystemConstants.F_OK);

    const ConfigFileResult: FReadConfigFileResult = TypeScript.readConfigFile(
        TsConfigPath,
        TypeScript.sys.readFile
    );

    if (ConfigFileResult.error !== undefined)
    {
        throw new Error(
            `Failed to read "${ TsConfigPath }".\n${ FormatDiagnostics([ ConfigFileResult.error ]) }`
        );
    }

    const ParsedConfig: TypeScript.ParsedCommandLine = TypeScript.parseJsonConfigFileContent(
        ConfigFileResult.config,
        TypeScript.sys,
        ProjectRootDirectoryPathResolved,
        undefined,
        TsConfigPath
    );

    if (ParsedConfig.errors.length > 0)
    {
        throw new Error(
            `Failed to parse "${ TsConfigPath }".\n${ FormatDiagnostics(ParsedConfig.errors) }`
        );
    }

    const projectReferences: ReadonlyArray<ProjectReference> = ParsedConfig.projectReferences || [ ];

    const Program: TypeScript.Program = TypeScript.createProgram({
        options: ParsedConfig.options,
        projectReferences,
        rootNames: ParsedConfig.fileNames
    });

    const Matches: Array<FRegistrarBaseMatch> = [ ];

    for (const RootFilePath of ParsedConfig.fileNames)
    {
        const SourceFile: TypeScript.SourceFile | undefined = Program.getSourceFile(RootFilePath);

        if (SourceFile === undefined)
        {
            continue;
        }

        if (!IsSearchableProjectSourceFile(SourceFile))
        {
            continue;
        }

        const MatchingInterfaceNames: ReadonlyArray<string> =
            GetMatchingInterfacesInSourceFile(SourceFile, InterfaceName);

        for (const MatchingInterfaceName of MatchingInterfaceNames)
        {
            Matches.push({
                Name: MatchingInterfaceName,
                Path: SourceFile.fileName
            });
        }
    }

    return Matches;
}

export async function SelectRegistrarInterface(
    RegistrarBase: FBaseInterfaceName
): Promise<FRegistrarDefinition>
{
    const RegistrarBaseFormatted: string = Code(RegistrarBase);
    const Out: FRegistrarDefinition = { Name: "", Path: "" };
    while (true)
    {
        const text: string =
            `Searching for modules that contain an interface that extends ${ RegistrarBaseFormatted }...`;
        const Ora: IOra = ora({ spinner: "point", text }).start();

        const RegistrarModules: ReadonlyArray<FRegistrarBaseMatch> =
            await GetRegistrarModules(RegistrarBase);
        if (RegistrarModules.length > 0)
        {
            Ora.succeed();
        }
        else
        {
            Ora.fail();
        }

        if (RegistrarModules.length === 0)
        {
            const NoModulesFoundMessage: string =
                "There were no modules found in your project that " +
                `define an interface that extends ${ RegistrarBaseFormatted }.\n\nTo fix this, please ` +
                "create a new module anywhere in your project (that is included by your " +
                `${ Code("tsconfig.json") }), then hit ${ Code("Return") } for ` +
                `${ Code("electron-reactive-event-cli") } to search again.`;

            console.log(NoModulesFoundMessage);

            const Result: boolean = await Confirm({
                default: true,
                message: "Has the desired module been created?"
            });

            if (Result)
            {
                continue;
            }
            else
            {
                process.exit(1);
            }
        }
        else if (RegistrarModules.length === 1)
        {
            const InterfaceName: string = RegistrarModules[0]?.Name || "";
            const InterfaceNameFormatted: string = Code(InterfaceName);

            const ModulePath: string = RegistrarModules[0]?.Path || "";
            const ModulePathFormatted: string =
                Code("./" + relative(await GetPackageRootDirectory(), ModulePath).replaceAll("\\", "/"));

            const ModuleName: string = basename(RegistrarModules[0]?.Path || "");
            const ModuleNameFormatted: string = Code(ModuleName);

            const ConfirmationMessage: string =
                `The interface ${ InterfaceNameFormatted } was found in module ` +
                `${ ModuleNameFormatted } (the full path is ${ ModulePathFormatted }).\n`;

            console.log(ConfirmationMessage);

            const Confirms: boolean = await Confirm({
                default: true,
                message: "Use this interface?"
            });

            if (Confirms)
            {
                Out.Name = InterfaceName;
                Out.Path = ModulePath;
                break;
            }
            else
            {
                continue;
            }
        }
        else // RegistrarModules.length > 1
        {
            const ManyFoundMessage: string =
                `There were ${ RegistrarModules.length } interfaces found that extend ` +
                `${ RegistrarBaseFormatted }.  Their names and the paths in which they ` +
                "reside are given below.";
            console.log(ManyFoundMessage);

            const InterfaceDefinitionToString = (Definition: FRegistrarDefinition): string =>
            {
                return `${ Code(Definition.Name) }    (${ Code(Definition.Path) })`;
            };

            const choices: Array<string> = RegistrarModules.map(InterfaceDefinitionToString);

            const Choice: string = await select<string>({
                choices,
                loop: true,
                message: "Which interface would you like to use?"
            });

            const Selection: FRegistrarDefinition | undefined = RegistrarModules[choices.indexOf(Choice)];
            if (Selection === undefined)
            {
                console.error("Despite selecting a module definition, inquirer returned undefined.");
                process.exit(1);
            }

            Out.Name = Selection.Name;
            Out.Path = Selection.Path;
            break;
        }
    }

    return Out;
}

export async function SelectDirectory(Message: string): Promise<Item>
{
    const filter = (In: Item): boolean =>
    {
        return !In.name.includes("node_modules");
    };

    const Config: FFileSelectorConfig =
        {
            basePath: await GetPackageRootDirectory(),
            filter,
            message: Message,
            theme:
            {
                labels:
                {
                    hints:
                    {
                        confirm: "{{confirm}} to place the new module here."
                    }
                }
            },
            type: "directory"
        };

    return await FileSelector(Config);
}

export async function SelectBuiltModulePath(): Promise<string>
{
    const Message: string =
        `The ${ Code("register")} command provided by this package will register your ` +
        "event declaration types for you, by maintaining a module in your project which adds the " +
        "declaration types to your registrar interfaces.  The module does not need to be imported " +
        `anywhere, it just needs to be somewhere that is recognized by your ${ Code("tsconfig.json") }.`;

    console.log(Message);

    const PromptMessage: string = "Please choose the directory where you want the module to reside.";

    const SelectedPath: string = (await SelectDirectory(PromptMessage)).path;

    return SelectedPath;
}

export async function SelectConfigDirectoryPath(): Promise<string>
{
    const WarningMessage: string =
        "If you choose a directory that is not the root of your project, then the path to " +
        `the config file will be written to your ${ Code("package.json") } file via the ` +
        `${ Code("config") } property (${ Chalk.italic("i.e.") }, ` +
        `${ Code("config.electron-reactive-event-cli") }).`;

    const Message: string =
        `The ${ Code("register")} command will need to know what choices you have selected in ` +
        `this wizard.  A JSON file will be saved to your project for the ${ Code("register") } ` +
        `command to read from later.\n\n${ FormatWarning(WarningMessage) }\n`;

    console.log(Message);

    const PromptMessage: string = "Please choose the directory where you want the config file to reside.";

    const SelectedPath: string = (await SelectDirectory(PromptMessage)).path;

    return SelectedPath;
}

function FormatWarning(Message: string): string
{
    return `⚠️  ${ Chalk.yellow("Note:") } ${ Message }`;
}

export async function IsPackageJsonConfigNeeded(
    ConfigDirectoryPath: string,
    ConfigFileName: string | undefined = undefined
): Promise<boolean>
{
    const IsFileNameCustom: boolean = (
        ConfigFileName !== undefined &&
        ConfigFileName !== DefaultConfigFileName
    );

    const IsInRootDirectory: boolean =
        normalize(ConfigDirectoryPath) !== normalize(await GetPackageRootDirectory());

    return IsFileNameCustom || IsInRootDirectory;
}

export async function SelectConfigName(SelectedDirectory: string): Promise<string>
{
    const AlreadyNeedsPackageJsonConfig: boolean = await IsPackageJsonConfigNeeded(SelectedDirectory);

    const WarningMessage: string =
        "If you choose a name that is not the default, then the path to the config file will be " +
        `written to your ${ Code("package.json") } file via the ${ Code("config") } property ` +
        `(${ Chalk.italic("i.e.") }, ${ Code("config.electron-reactive-event-cli") }).`;

    const WarningMessageFormatted: string = `\n\n${ FormatWarning(WarningMessage) }`;

    const Message: string =
        "Please choose the name that the config file will have.  " +
        `${ AlreadyNeedsPackageJsonConfig ? "" : WarningMessageFormatted }\n`;

    console.log(Message);

    let HasTriedOnce: boolean = false;
    while (true)
    {
        const message: string = HasTriedOnce
            ? "Please choose a valid JSON file name."
            : "Please choose the name that the config file will have.";

        const FileName: string = await input({
            default: DefaultConfigFileName,
            message
        });

        HasTriedOnce = true;

        const JsonExtension: ".json" = ".json" as const;

        const SafeFilePath: string = await GetSafeNewPath(resolve(SelectedDirectory, FileName));

        const IsFileNameValid: boolean =
            await IsValidFileName(dirname(SafeFilePath), basename(SafeFilePath), false, JsonExtension);

        if (IsFileNameValid)
        {
            return FileName;
        }
        else
        {
            const IsExtensionBad: boolean = !FileName.endsWith(JsonExtension);
            const ExtensionMessage: string = `  The name must end with ${ Code(JsonExtension) }.`;

            const Message: string =
                `The name ${ FileName } is not a valid JSON file name.` +
                `${ IsExtensionBad ? ExtensionMessage : "" }`;

            console.log(Message);
        }
    }
}
