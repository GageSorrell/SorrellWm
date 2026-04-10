/* File:      DeclareEvents.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import type { EventDeclaration, EventDeclaringModule, EventOwnerString } from "./DeclareEvents.Types";
import { GetConfigSafe, GetDefaultConfig, HasConfig } from "./Config";
import { GetHeader, Try } from "./Command";
import { basename, dirname, relative, resolve, sep } from "path";
import type { CliConfig } from "./Config.Types";
import { GetPackageRootDirectory } from "@sorrell/utilities";
import TypeScript from "typescript";
import { writeFile } from "fs/promises";

/* eslint-disable jsdoc/require-jsdoc */

function GetEventDeclarationOwner(
    TypeNode: TypeScript.TypeNode | undefined
): EventOwnerString | undefined
{
    if (TypeNode === undefined || !TypeScript.isTypeReferenceNode(TypeNode))
    {
        return undefined;
    }

    if (!TypeScript.isIdentifier(TypeNode.typeName) || TypeNode.typeName.text !== "EventDecl")
    {
        return undefined;
    }

    const TypeArguments: ReadonlyArray<TypeScript.TypeNode> = TypeNode.typeArguments ?? [  ];

    if (TypeArguments?.[0] !== undefined)
    {
        const Name: string = TypeArguments[0].getFullText();
        if (Name.includes("Main"))
        {
            return "Main";
        }
        else if (Name.includes("Renderer"))
        {
            return "Renderer";
        }
        else
        {
            return undefined;
        }
    }

    for (const TypeArgument of TypeArguments)
    {
        // console.log(JSON.stringify(TypeArgument, null, 4));

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

async function FindExportedEventDeclTypes(): Promise<Array<EventDeclaringModule>>
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
    const MatchesByPath: Map<string, EventDeclaringModule> = new Map<string, EventDeclaringModule>();

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

            const Owner: EventOwnerString | undefined = GetEventDeclarationOwner(Statement.type);

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

            const ExistingMatch: EventDeclaringModule | undefined = MatchesByPath.get(SourceFile.fileName);

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

export function GetRelativeImportPath
(
    ImportedModuleAbsolutePath: string,
    ImportingModuleAbsolutePath: string
): string
{
    const ImportingDirectory: string = dirname(ImportingModuleAbsolutePath);

    let RelativeImportPath: string = relative(
        ImportingDirectory,
        ImportedModuleAbsolutePath
    );

    RelativeImportPath = RelativeImportPath.replaceAll("\\", "/");

    if (!RelativeImportPath.startsWith("."))
    {
        RelativeImportPath = `./${RelativeImportPath}`;
    }

    return RelativeImportPath;
}

function DeclareEventsInner(Config: CliConfig): (() => Promise<string>)
{
    return async function(): Promise<string>
    {
        const FileName: string = basename(Config.AugmentationModulePath);
        const Header: string = GetHeader(FileName, "declare-events");

        const EventDeclarations: Array<EventDeclaringModule> = await FindExportedEventDeclTypes();

        const ImportStatements: string = EventDeclarations.map((
            { Declarations, Path }: EventDeclaringModule
        ): string =>
        {
            const Names: Array<string> = Declarations.map(({ Name }: EventDeclaration): string => Name);
            const RelativePath: string = GetRelativeImportPath(Path, Config.AugmentationModulePath);

            return `import type { ${ Names.join(", ") } } from "${ RelativePath }";`;
        }).join("\n");

        const Entries: string = EventDeclarations.flatMap((
            { Declarations }: EventDeclaringModule
        ): Array<string> =>
        {
            return Declarations.map(({ Name }: EventDeclaration): string =>
            {
                return " ".repeat(12) + `${ Name }: ${ Name };`;
            });
        }).join("\n");

        const Contents: string =
            Header +
            "\n" +
            ImportStatements +
            `\n\ndeclare module "electron-reactive-event/registrar"
{
    interface Registrar
    {
        ${ Config.PackageKey }:
        {
${ Entries }
        };
    }
};\n`;

        await writeFile(Config.AugmentationModulePath, Contents, { encoding: "utf-8" });

        return EventDeclarations.length.toString();
    };
}

export async function DeclareEvents(): Promise<void>
{
    const Config: CliConfig = await GetConfigSafe();
    const DefaultConfig: CliConfig = await GetDefaultConfig();

    const DefaultLabelAugmentationPath: string =
        Config.AugmentationModulePath === DefaultConfig.AugmentationModulePath
            ? "default"
            : "";

    if (!(await HasConfig()))
    {
        /* eslint-disable-next-line @stylistic/max-len */
        console.log("\n💡 Tip: You can create a default config file by running\n\n    npm exec electron-reactive-event setup\n");
    }

    await Try(
        /* eslint-disable-next-line @stylistic/max-len */
        `Writing augmentation module at ${ DefaultLabelAugmentationPath } path ${ Config.AugmentationModulePath }...`,
        (Result: string) => `Successfully augmented the registrar with ${ Result } event declarations!`,
        DeclareEventsInner(Config)
    );
}
