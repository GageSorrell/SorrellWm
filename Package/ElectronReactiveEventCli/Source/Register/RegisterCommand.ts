#!/usr/bin/env node
/* File:      RegisterCommand.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import { DefaultConfigFileName, type FCliConfig } from "../index.js";
import type {
    FEventDeclarationMatch,
    FEventDeclaringModule,
    FEventOwner,
    FImportGroup,
    FImportedEventDeclaration,
    FRegistrarDefinition } from "./RegisterCommand.Types.js";
import { GetPackageRootDirectory, OraTask, Try } from "@sorrell/utilities";
import { basename, dirname, relative, resolve, sep } from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import Chalk from "chalk";
import { Code } from "@sorrell/cli-utilities";
import type { IPackageJson } from "package-json-type";
import TypeScript from "typescript";

async function GetConfigFromContents(Contents: string): Promise<FCliConfig>
{
    try
    {
        /* eslint-disable @stylistic/max-len */
        const ParsedJson: unknown = JSON.parse(Contents);
        if (typeof ParsedJson === "object" )
        {
            if (ParsedJson !== null)
            {
                if ("main" in ParsedJson && typeof ParsedJson.main === "object" && ParsedJson.main !== null)
                {
                    if ("name" in ParsedJson.main)
                    {
                        if ("path" in ParsedJson.main)
                        {
                            if ("renderer" in ParsedJson && typeof ParsedJson.renderer === "object" && ParsedJson.renderer !== null)
                            {
                                if ("name" in ParsedJson.renderer)
                                {
                                    if ("path" in ParsedJson.renderer)
                                    {
                                        if ("outPath" in ParsedJson)
                                        {
                                            if (typeof ParsedJson.outPath === "string")
                                            {
                                                return ParsedJson as FCliConfig;
                                            }
                                            else
                                            {
                                                throw new Error(`The ${ Code("outPath") } property of the config file was specified, but it must be a string.`);
                                            }
                                        }
                                        else
                                        {
                                            throw new Error(`The config file is missing the property ${ Code("outPath") }.`);
                                        }
                                    }
                                    else
                                    {
                                        throw new Error(`The ${ Code("renderer") } property in the config file is missing property ${ Code("path") }.`);
                                    }
                                }
                                else
                                {
                                    throw new Error(`The ${ Code("renderer") } property in the config file is missing property ${ Code("name") }.`);
                                }
                            }
                            else
                            {
                                throw new Error(`The config file is missing the property ${ Code("main")}.`);
                            }

                        }
                        else
                        {
                            throw new Error(`The ${ Code("main") } property in the config file is missing property ${ Code("path") }.`);
                        }
                    }
                    else
                    {
                        throw new Error(`The ${ Code("main") } property in the config file is missing property ${ Code("name") }.`);
                    }
                }
                else
                {
                    throw new Error(`The config file is missing the property ${ Code("main")}.`);
                }
            }
            else
            {
                throw new Error(`A config file was found, but parsed into ${ Code("null") }.`);
            }
        }
        else
        {
            throw new Error("A config file was found, but could not be parsed into an object.");
        }
        /* eslint-enable @stylistic/max-len */
    }
    catch (_Error: unknown)
    {
        throw new Error("A config file was found, but its contents are invalid.");
    }
}

async function GetConfigContents(): Promise<string>
{
    /* eslint-disable @stylistic/max-len */
    const DefaultPath: string = resolve(await GetPackageRootDirectory(), DefaultConfigFileName);
    const { Data: DefaultPathConfigContents } = await Try(readFile(DefaultPath, { encoding: "utf-8" }));

    if (DefaultPathConfigContents !== undefined)
    {
        return DefaultPathConfigContents;
    }

    const { Data: PackageJsonContents } =
        await Try(readFile(resolve(await GetPackageRootDirectory(), "package.json"), { encoding: "utf-8" }));

    if (PackageJsonContents === undefined)
    {
        throw new Error(`Could not find a config file at the default path, and the project's ${ Code("package.json") } could not be loaded.  Exiting...`);
    }

    const PackageJson: IPackageJson = JSON.parse(PackageJsonContents) as IPackageJson;
    if ("config" in PackageJson)
    {
        if ("electron-reactive-event-cli" in PackageJson.config)
        {
            const CustomPath: string = PackageJson.config["electron-reactive-event-cli"];
            const { Data: CustomPathCliConfigContents } =
                await Try(readFile(CustomPath, { encoding: "utf-8" }));

            if (CustomPathCliConfigContents !== undefined)
            {
                try
                {
                    return CustomPathCliConfigContents;
                }
                catch (_Error: unknown)
                {
                    throw new Error("A custom config file was found, but it could not be parsed.");
                }
            }
            else
            {
                throw new Error(`Found a custom path for the config file in ${ Code("package.json") } in the ${ Code("config") } property, but the file could not be loaded.  Exiting...`);
            }
        }
        else
        {
            throw new Error(`Could not find a config file in the default path, and the ${ Code("package.json") } ${ Chalk.italic("does") } feature a ${ Code("config") } property, but not a ${ Code("config.electron-reactive-event-cli") } property.`);
        }
    }
    else
    {
        throw new Error(`Could not find a config file in the default path, and the ${ Code("package.json") } does not have a ${ Code("config") } property in which a custom path would be provided.`);
    }
    /* eslint-enable @stylistic/max-len */
}

function IsPathWithinDirectory(
    CandidatePath: string,
    DirectoryPath: string
): boolean
{
    const NormalizedCandidatePath: string = resolve(CandidatePath);
    const NormalizedDirectoryPath: string = resolve(DirectoryPath);

    if (process.platform === "win32")
    {
        const LowerCandidatePath: string = NormalizedCandidatePath.toLowerCase();
        const LowerDirectoryPath: string = NormalizedDirectoryPath.toLowerCase();

        return LowerCandidatePath === LowerDirectoryPath
            || LowerCandidatePath.startsWith(LowerDirectoryPath + sep);
    }

    return NormalizedCandidatePath === NormalizedDirectoryPath
        || NormalizedCandidatePath.startsWith(NormalizedDirectoryPath + sep);
}

function IsSymbolExportedFromSourceFile(
    TypeChecker: TypeScript.TypeChecker,
    SourceFile: TypeScript.SourceFile,
    SymbolToCheck: TypeScript.Symbol | undefined
): boolean
{
    if (SymbolToCheck === undefined)
    {
        return false;
    }

    const ModuleSymbol: TypeScript.Symbol | undefined = TypeChecker.getSymbolAtLocation(SourceFile);

    if (ModuleSymbol === undefined)
    {
        return false;
    }

    const ExportSymbols: ReadonlyArray<TypeScript.Symbol> = TypeChecker.getExportsOfModule(ModuleSymbol);

    for (const ExportSymbol of ExportSymbols)
    {
        const ResolvedExportSymbol: TypeScript.Symbol =
            (ExportSymbol.flags & TypeScript.SymbolFlags.Alias) !== 0
                ? TypeChecker.getAliasedSymbol(ExportSymbol)
                : ExportSymbol;

        if (ResolvedExportSymbol === SymbolToCheck)
        {
            return true;
        }
    }

    return false;
}

function GetEventDeclarationOwner(
    TypeNode: TypeScript.TypeNode | undefined
): FEventOwner | undefined
{
    if (TypeNode === undefined || !TypeScript.isTypeReferenceNode(TypeNode))
    {
        return undefined;
    }

    if (!TypeScript.isIdentifier(TypeNode.typeName) || TypeNode.typeName.text !== "EventDecl")
    {
        return undefined;
    }

    const TypeArguments: ReadonlyArray<TypeScript.TypeNode> = TypeNode.typeArguments ?? [];

    for (const TypeArgument of TypeArguments)
    {
        if (!TypeScript.isLiteralTypeNode(TypeArgument))
        {
            continue;
        }

        if (!TypeScript.isStringLiteral(TypeArgument.literal))
        {
            continue;
        }

        if (
            TypeArgument.literal.text === "Main"
            || TypeArgument.literal.text === "Renderer"
        )
        {
            return TypeArgument.literal.text;
        }
    }

    return undefined;
}

function CreateFormatDiagnosticsHost(): TypeScript.FormatDiagnosticsHost
{
    return {
        getCanonicalFileName(FilePath: string): string
        {
            return FilePath;
        },

        getCurrentDirectory(): string
        {
            return process.cwd();
        },

        getNewLine(): string
        {
            return TypeScript.sys.newLine;
        }
    };
}

async function FindExportedEventDeclTypes(): Promise<Array<FEventDeclaringModule>>
{
    const PackageRootDirectoryPathResolved: string = await GetPackageRootDirectory();
    const TsConfigFilePath: string = resolve(PackageRootDirectoryPathResolved, "tsconfig.json");

    const ConfigFileResult: ReturnType<typeof TypeScript.readConfigFile> =
        TypeScript.readConfigFile(
            TsConfigFilePath,
            TypeScript.sys.readFile
        );

    if (ConfigFileResult.error !== undefined)
    {
        throw new Error(
            TypeScript.formatDiagnosticsWithColorAndContext(
                [ ConfigFileResult.error ],
                CreateFormatDiagnosticsHost()
            )
        );
    }

    const ParsedCommandLine: TypeScript.ParsedCommandLine = TypeScript.parseJsonConfigFileContent(
        ConfigFileResult.config,
        TypeScript.sys,
        PackageRootDirectoryPathResolved,
        undefined,
        TsConfigFilePath
    );

    if (ParsedCommandLine.errors.length > 0)
    {
        throw new Error(
            TypeScript.formatDiagnosticsWithColorAndContext(
                ParsedCommandLine.errors,
                CreateFormatDiagnosticsHost()
            )
        );
    }

    const Program: TypeScript.Program = TypeScript.createProgram({
        options: ParsedCommandLine.options,
        projectReferences: ParsedCommandLine.projectReferences || [ ],
        rootNames: ParsedCommandLine.fileNames
    });

    const TypeChecker: TypeScript.TypeChecker = Program.getTypeChecker();
    const MatchesByPath: Map<string, FEventDeclaringModule> = new Map<string, FEventDeclaringModule>();

    for (const SourceFile of Program.getSourceFiles())
    {
        if (SourceFile.isDeclarationFile)
        {
            continue;
        }

        if (!IsPathWithinDirectory(SourceFile.fileName, PackageRootDirectoryPathResolved))
        {
            continue;
        }

        for (const Statement of SourceFile.statements)
        {
            if (!TypeScript.isTypeAliasDeclaration(Statement))
            {
                continue;
            }

            const Owner: FEventOwner | undefined = GetEventDeclarationOwner(Statement.type);

            if (Owner === undefined)
            {
                continue;
            }

            const DeclarationSymbol: TypeScript.Symbol | undefined =
                TypeChecker.getSymbolAtLocation(Statement.name);

            if (!IsSymbolExportedFromSourceFile(TypeChecker, SourceFile, DeclarationSymbol))
            {
                continue;
            }

            const ExistingMatch: FEventDeclaringModule | undefined = MatchesByPath.get(SourceFile.fileName);

            if (ExistingMatch === undefined)
            {
                MatchesByPath.set(
                    SourceFile.fileName,
                    {
                        Declarations:
                        [
                            {
                                Name: Statement.name.text,
                                Owner
                            }
                        ],
                        Path: SourceFile.fileName
                    }
                );
            }
            else
            {
                ExistingMatch.Declarations.push({
                    Name: Statement.name.text,
                    Owner
                });
            }
        }
    }

    return [ ...MatchesByPath.values() ];
}

async function GetCliConfig(): Promise<FCliConfig>
{
    return GetConfigFromContents(await GetConfigContents());
}

// function GetOutputModuleSpecifierExtension(FilePath: string): string
// {
//     const Extension: string = extname(FilePath).toLowerCase();

//     switch (Extension)
//     {
//         case ".ts":
//         case ".tsx":
//         {
//             return ".js";
//         }

//         case ".mts":
//         {
//             return ".mjs";
//         }

//         case ".cts":
//         {
//             return ".cjs";
//         }

//         default:
//         {
//             return Extension;
//         }
//     }
// }

// function ReplaceFileExtension(
//     FilePath: string,
//     NewExtension: string
// ): string
// {
//     const CurrentExtension: string = extname(FilePath);

//     if (CurrentExtension.length === 0)
//     {
//         return FilePath;
//     }

//     return FilePath.slice(0, -CurrentExtension.length) + NewExtension;
// }

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
        RelativePath = `./${ RelativePath }`;
    }

    /* @TODO This can remove more than the end of the file, but should not. */
    RelativePath = RelativePath
        .replaceAll(".tsx", "")
        .replaceAll(".ts", "")
        .replaceAll(".jsx", "")
        .replaceAll(".js", "")
        .replaceAll(".mjs", "")
        .replaceAll(".mts", "")
        .replaceAll(".cjs", "")
        .replaceAll(".cts", "");

    return RelativePath;
    // return ReplaceFileExtension(
    //     RelativePath,
    //     GetOutputModuleSpecifierExtension(ToAbsolutePath)
    // );
}

function GetGeneratedEventRegistrarModuleText(
    EventDeclarationMatches: ReadonlyArray<FEventDeclarationMatch>,
    MainRegistrar: FRegistrarDefinition,
    RendererRegistrar: FRegistrarDefinition,
    OutputModulePath: string
): string
{
    const MainModuleSpecifier: string = GetRelativeModuleSpecifier(
        OutputModulePath,
        MainRegistrar.path
    );

    const RendererModuleSpecifier: string = GetRelativeModuleSpecifier(
        OutputModulePath,
        RendererRegistrar.path
    );

    const ImportGroupsByModuleSpecifier: Map<string, FImportGroup> = new Map<string, FImportGroup>();
    const MainInterfacePropertyLines: Array<string> = [];
    const RendererInterfacePropertyLines: Array<string> = [];

    let AliasIndex: number = 0;

    for (const EventDeclarationMatch of EventDeclarationMatches)
    {
        const EventModuleSpecifier: string = GetRelativeModuleSpecifier(
            OutputModulePath,
            EventDeclarationMatch.Path
        );

        let ImportGroup: FImportGroup | undefined = ImportGroupsByModuleSpecifier.get(EventModuleSpecifier);

        if (ImportGroup === undefined)
        {
            ImportGroup = {
                Declarations: [ ],
                ModuleSpecifier: EventModuleSpecifier
            };

            ImportGroupsByModuleSpecifier.set(EventModuleSpecifier, ImportGroup);
        }

        for (const EventDeclaration of EventDeclarationMatch.Declarations)
        {
            const Alias: string = `__ImportedEventDeclaration${AliasIndex}`;
            AliasIndex++;

            ImportGroup.Declarations.push({
                Alias,
                Name: EventDeclaration.Name,
                Owner: EventDeclaration.Owner
            });

            const PropertyLine: string = `        ${EventDeclaration.Name}: ${Alias};`;

            if (EventDeclaration.Owner === "Main")
            {
                MainInterfacePropertyLines.push(PropertyLine);
            }
            else
            {
                RendererInterfacePropertyLines.push(PropertyLine);
            }
        }
    }

    const ImportLines: Array<string> = [ ];

    for (const ImportGroup of ImportGroupsByModuleSpecifier.values())
    {
        const ImportedMembersText: string = ImportGroup.Declarations
            .map(
                (ImportedEventDeclaration: FImportedEventDeclaration): string =>
                {
                    return `    ${ ImportedEventDeclaration.Name } as ${ImportedEventDeclaration.Alias }`;
                }
            )
            .join(",\n");

        ImportLines.push(
            `import type {\n${ ImportedMembersText } } from "${ ImportGroup.ModuleSpecifier }";`
        );
    }

    return [
        "/* eslint-disable */",
        "",
        "/* Auto-generated file. */",
        "",
        ...ImportLines,
        ...(ImportLines.length > 0 ? [ "" ] : [ ]),
        `declare module "${ MainModuleSpecifier }"`,
        "{",
        `    interface ${ MainRegistrar.name }`,
        "    {",
        ...(
            MainInterfacePropertyLines.length > 0
                ? MainInterfacePropertyLines
                : [ "" ]
        ),
        "    }",
        "}",
        "",
        `declare module "${ RendererModuleSpecifier }"`,
        "{",
        `    interface ${ RendererRegistrar.name }`,
        "    {",
        ...(
            RendererInterfacePropertyLines.length > 0
                ? RendererInterfacePropertyLines
                : [ "" ]
        ),
        "    }",
        "}",
        ""
    ].join("\n");
}

async function WriteGeneratedEventRegistrarModule(
    EventDeclarationMatches: ReadonlyArray<FEventDeclarationMatch>,
    CliConfig: FCliConfig
): Promise<void>
{
    const MainRegistrar: FRegistrarDefinition = CliConfig.main;
    const RendererRegistrar: FRegistrarDefinition = CliConfig.renderer;
    const OutPath: string = CliConfig.outPath;

    const OutputModulePath: string = resolve(OutPath);
    const OutputDirectoryPath: string = dirname(OutputModulePath);

    await mkdir(OutputDirectoryPath, { recursive: true });

    const GeneratedModuleText: string = GetGeneratedEventRegistrarModuleText(
        EventDeclarationMatches,
        MainRegistrar,
        RendererRegistrar,
        OutputModulePath
    );

    await writeFile(OutputModulePath, GeneratedModuleText, "utf8");
}

export async function Register(): Promise<void>
{
    const { Data: CliConfig } = await OraTask<FCliConfig>(
        GetCliConfig,
        "Loading your config file..."
    );

    if (CliConfig === undefined)
    {
        process.exit(1);
    }

    // Find all event declarations
    const { Data: Declarations } = await OraTask(FindExportedEventDeclTypes, "Finding event declarations...");
    if (Declarations === undefined)
    {
        console.error("Could not find event declarations in your project!  Exiting...");
        process.exit(1);
    }

    const WriteGeneratedTask = async (): Promise<void> =>
    {
        await WriteGeneratedEventRegistrarModule(Declarations, CliConfig);
    };

    const { Error } = await OraTask(
        WriteGeneratedTask,
        `Writing the auto-generated module to ${ Code(CliConfig.outPath) }...`
    );

    if (Error !== undefined)
    {
        console.error(
            `Failed to write the auto-generated module to ${ Code(CliConfig.outPath) }!  Exiting...`
        );

        process.exit(1);
    }

    console.log(
        Chalk.greenBright(
            `🥳 Successfully registered your event declarations in ${ Code(basename(CliConfig.outPath)) }!`
        )
    );
}
