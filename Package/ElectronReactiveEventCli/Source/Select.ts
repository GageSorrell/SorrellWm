/* File:      Select.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import { type Item, fileSelector } from "inquirer-file-selector";
import { basename, resolve } from "path";
import { confirm, select } from "@inquirer/prompts";
import { Code } from "@sorrell/cli-utilities";
import type { FSelectedInterfaces } from "./Select.Types.js";
import type { Stats } from "fs";
import { stat } from "fs/promises";
import ts from "typescript";

// type FMenuSelection =
//     | {
//         Kind: "Parent";
//     }
//     | {
//         Kind: "Directory";
//         AbsolutePath: string;
//     }
//     | {
//         Kind: "File";
//         AbsolutePath: string;
//     };

// type TChoice<ValueType> =
//     {
//         description?: string;
//         disabled?: boolean | string;
//         name: string;
//         value: ValueType;
//     };

// function IsTypeScriptModuleFile(FileName: string): boolean
// {
//     const Extension: string = extname(FileName).toLowerCase();
//     return Extension === ".ts" || Extension === ".tsx";
// }

// function GetDisplayDirectory(ProjectRootDirectoryPath: string, CurrentDirectoryPath: string): string
// {
//     const RelativeDirectoryPath: string = relative(ProjectRootDirectoryPath, CurrentDirectoryPath);
//     return RelativeDirectoryPath === "" ? "." : RelativeDirectoryPath;
// }

// async function ReadMenuChoices(
//     ProjectRootDirectoryPath: string,
//     CurrentDirectoryPath: string
// ): Promise<ReadonlyArray<TChoice<FMenuSelection>>>
// {
//     type FDirectory = Dirent<string>;
//     const DirectoryEntries: ReadonlyArray<FDirectory> =
//         await readdir(CurrentDirectoryPath, { withFileTypes: true });

//     const SortDirectories = (A: FDirectory, B: FDirectory): number =>
//     {
//         return A.name.localeCompare(
//             B.name,
//             undefined,
//             {
//                 numeric: true,
//                 sensitivity: "base"
//             });
//     };

//     const GetDirectoryChoice = (DirectoryEntry: FDirectory): TChoice<FMenuSelection> =>
//     {
//         const AbsolutePath: string = resolve(CurrentDirectoryPath, DirectoryEntry.name);

//         return {
//             description: "Open directory",
//             name: `${DirectoryEntry.name}/`,
//             value: {
//                 AbsolutePath,
//                 Kind: "Directory"
//             }
//         };
//     };

//     const IsDirectory = (DirectoryEntry: FDirectory): boolean =>
//     {
//         return DirectoryEntry.isDirectory();
//     };

//     const DirectoryChoices: Array<TChoice<FMenuSelection>> =
//         DirectoryEntries
//             .filter(IsDirectory)
//             .sort(SortDirectories)
//             .map(GetDirectoryChoice);

//     const IsModule = (DirectoryEntry: FDirectory): boolean =>
//     {
//         return (
//             DirectoryEntry.isFile() &&
//             IsTypeScriptModuleFile(DirectoryEntry.name)
//         );
//     };

//     const GetModuleChoice = (DirectoryEntry: FDirectory): TChoice<FMenuSelection> =>
//     {
//         const AbsolutePath: string = resolve(CurrentDirectoryPath, DirectoryEntry.name);

//         return {
//             description: "Select module",
//             name: DirectoryEntry.name,
//             value: {
//                 AbsolutePath,
//                 Kind: "File"
//             }
//         };
//     };

//     const FileChoices: Array<TChoice<FMenuSelection>> =
//         DirectoryEntries
//             .filter(IsModule)
//             .sort(SortDirectories)
//             .map(GetModuleChoice);

//     const Choices: Array<TChoice<FMenuSelection>> = [ ];

//     if (CurrentDirectoryPath !== ProjectRootDirectoryPath)
//     {
//         Choices.push({
//             description: "Go to parent directory",
//             name: "../",
//             value: {
//                 Kind: "Parent"
//             }
//         });
//     }

//     Choices.push(...DirectoryChoices);
//     Choices.push(...FileChoices);

//     return Choices;
// }

export async function PromptModule(
    ProjectRootDirectoryPathArgument: string,
    SelectedInterfaces: FSelectedInterfaces | undefined
): Promise<string>
{
    const ProjectRootDirectoryPath: string = resolve(ProjectRootDirectoryPathArgument);
    const ProjectRootDirectoryStats: Stats = await stat(ProjectRootDirectoryPath);

    if (!ProjectRootDirectoryStats.isDirectory())
    {
        throw new Error(`The path "${ ProjectRootDirectoryPath }" is not a directory.`);
    }

    const IsModuleOrDirectory = (InItem: Readonly<Item>): boolean =>
    {
        return (
            InItem.name.endsWith(".ts") ||
            InItem.name.endsWith(".tsx") ||
            InItem.isDirectory
        );
    };

    const InterfaceTypesRemaining: string = SelectedInterfaces?.Main === undefined
        ? SelectedInterfaces?.Renderer === undefined
            ? "one (or both) of your registrar interfaces"
            : "your Main registrar interface"
        : "your Renderer registrar interface";

    console.log(`Choose the module that contains ${ InterfaceTypesRemaining }.`);

    const Selection: Item = await fileSelector({
        basePath: ProjectRootDirectoryPath,
        filter: IsModuleOrDirectory,
        loop: true,
        message: "Select a file or directory:"
    });

    return Selection.path;

    // let CurrentDirectoryPath: string = ProjectRootDirectoryPath;

    // while (true)
    // {
    //     const Choices: ReadonlyArray<TChoice<FMenuSelection>> = await ReadMenuChoices(
    //         ProjectRootDirectoryPath,
    //         CurrentDirectoryPath
    //     );

    //     if (Choices.length === 0)
    //     {
    //         throw new Error(
    //             `No subdirectories or TypeScript modules were found under "${ProjectRootDirectoryPath}".`
    //         );
    //     }

    //     const DisplayDirectory: string = GetDisplayDirectory(
    //         ProjectRootDirectoryPath,
    //         CurrentDirectoryPath
    //     );

    //     // const Selection: FMenuSelection = await select<FMenuSelection>({
    //     //     choices: Choices,
    //     //     loop: true,
    //     //     message: `Select a TypeScript module (${ DisplayDirectory })`
    //     // });

    //     // switch (Selection.Kind)
    //     // {
    //     //     case "Parent":
    //     //         CurrentDirectoryPath = resolve(CurrentDirectoryPath, "..");
    //     //         break;
    //     //     case "Directory":
    //     //         CurrentDirectoryPath = Selection.AbsolutePath;
    //     //         break;
    //     //     case "File":
    //     //     {
    //     //         const RelativeModulePath: string = relative(
    //     //             ProjectRootDirectoryPath,
    //     //             Selection.AbsolutePath
    //     //         );

    //     //         const Confirmed: boolean = await confirm({
    //     //             message: `Use "${RelativeModulePath}"?`
    //     //         });

    //     //         if (Confirmed)
    //     //         {
    //     //             return Selection.AbsolutePath;
    //     //         }

    //     //         break;
    //     //     }
    //     // }
    // }
}

export type FRegistrarInterfaceNames = Readonly<{
    Main: ReadonlyArray<string>;
    Renderer: ReadonlyArray<string>;
}>;

function NormalizePathForComparison(
    FilePath: string
): string
{
    const ResolvedPath: string = resolve(FilePath);

    return ts.sys.useCaseSensitiveFileNames
        ? ResolvedPath
        : ResolvedPath.toLowerCase();
}

function GetSourceFileFromProgram(
    Program: ts.Program,
    ModulePath: string
): ts.SourceFile
{
    const NormalizedModulePath: string = NormalizePathForComparison(ModulePath);

    const SourceFile: ts.SourceFile | undefined = Program
        .getSourceFiles()
        .find((CurrentSourceFile: ts.SourceFile): boolean =>
        {
            return NormalizePathForComparison(CurrentSourceFile.fileName) === NormalizedModulePath;
        });

    if (SourceFile === undefined)
    {
        throw new Error(`Could not load source file "${ModulePath}".`);
    }

    return SourceFile;
}

function IsInterfaceExportedFromModule(
    Checker: ts.TypeChecker,
    SourceFile: ts.SourceFile,
    InterfaceDeclaration: ts.InterfaceDeclaration
): boolean
{
    const ModuleSymbol: ts.Symbol | undefined = Checker.getSymbolAtLocation(SourceFile);
    const InterfaceSymbol: ts.Symbol | undefined = Checker.getSymbolAtLocation(InterfaceDeclaration.name);

    if (ModuleSymbol === undefined || InterfaceSymbol === undefined)
    {
        return false;
    }

    const ExportSymbols: ReadonlyArray<ts.Symbol> = Checker.getExportsOfModule(ModuleSymbol);

    return ExportSymbols.some((ExportSymbol: ts.Symbol): boolean =>
    {
        const TargetSymbol: ts.Symbol =
            (ExportSymbol.flags & ts.SymbolFlags.Alias) !== 0
                ? Checker.getAliasedSymbol(ExportSymbol)
                : ExportSymbol;

        return TargetSymbol === InterfaceSymbol;
    });
}

function GetExtendedBaseInterfaceNames(
    Checker: ts.TypeChecker,
    InterfaceDeclaration: ts.InterfaceDeclaration
): ReadonlySet<string>
{
    const BaseInterfaceNames: Set<string> = new Set<string>();

    const ExtendsClauses: ReadonlyArray<ts.HeritageClause> =
        InterfaceDeclaration.heritageClauses?.filter((HeritageClause: ts.HeritageClause): boolean =>
        {
            return HeritageClause.token === ts.SyntaxKind.ExtendsKeyword;
        }) ?? [ ];

    for (const ExtendsClause of ExtendsClauses)
    {
        for (const HeritageType of ExtendsClause.types)
        {
            let Symbol: ts.Symbol | undefined = Checker.getSymbolAtLocation(HeritageType.expression);

            if (Symbol === undefined)
            {
                continue;
            }

            if ((Symbol.flags & ts.SymbolFlags.Alias) !== 0)
            {
                Symbol = Checker.getAliasedSymbol(Symbol);
            }

            BaseInterfaceNames.add(Symbol.getName());
        }
    }

    return BaseInterfaceNames;
}

function GetExportedRegistrarInterfaceNames(ModulePath: string): FRegistrarInterfaceNames
{
    const ResolvedModulePath: string = resolve(ModulePath);

    const Program: ts.Program = ts.createProgram(
        [ ResolvedModulePath ],
        {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            noEmit: true,
            skipLibCheck: true,
            target: ts.ScriptTarget.ESNext
        }
    );

    const Checker: ts.TypeChecker = Program.getTypeChecker();
    const SourceFile: ts.SourceFile = GetSourceFileFromProgram(Program, ResolvedModulePath);

    const MainNames: Set<string> = new Set<string>();
    const RendererNames: Set<string> = new Set<string>();

    for (const Statement of SourceFile.statements)
    {
        if (!ts.isInterfaceDeclaration(Statement))
        {
            continue;
        }

        if (!IsInterfaceExportedFromModule(Checker, SourceFile, Statement))
        {
            continue;
        }

        const BaseInterfaceNames: ReadonlySet<string> = GetExtendedBaseInterfaceNames(Checker, Statement);

        if (BaseInterfaceNames.has("IMainRegistrar"))
        {
            MainNames.add(Statement.name.text);
        }

        if (BaseInterfaceNames.has("IRendererRegistrar"))
        {
            RendererNames.add(Statement.name.text);
        }
    }

    return {
        Main: [ ...MainNames ],
        Renderer: [ ...RendererNames ]
    };
}

export const GoBackChoice: string = "Choose another module (go back).";

export async function SelectInterfacesFromModule(
    Path: string,
    SelectedThusFar: FSelectedInterfaces | undefined
): Promise<FSelectedInterfaces>
{
    const Interfaces: FRegistrarInterfaceNames = await GetExportedRegistrarInterfaceNames(Path);

    const GetChoices = (Interfaces: ReadonlyArray<string>): ReadonlyArray<string> =>
    {
        return [ ...Interfaces, GoBackChoice ];
    };

    const Out: FSelectedInterfaces =
        {
            Main: undefined,
            Renderer: undefined
        };

    const NoneFound: boolean = Interfaces.Main.length === 0 && Interfaces.Renderer.length === 0;

    if (NoneFound)
    {
        return Out;
    }

    const GetSelection = async (Owner: "Main" | "Renderer"): Promise<string> =>
    {
        if (Interfaces[Owner].length > 1)
        {
            const choices: ReadonlyArray<string> = [ ...GetChoices(Interfaces[Owner]), GoBackChoice ];
            /* eslint-disable-next-line @stylistic/max-len */
            const message: string = `There were ${ Interfaces[Owner].length } interfaces found in the module that ${ Code("extend IMainRegistrar") }.\nSelect the interface that you would like to use.`;
            const Selection: string = await select<string>({
                choices,
                loop: true,
                message
            });

            return Selection;
        }
        else
        {
            /* eslint-disable-next-line @stylistic/max-len */
            const message: string = `The interface ${ Code(Interfaces[Owner][0] || "") } is the only exported interface in ${ Code(basename(Path)) } that ${ Code(`extends I${ Owner }RegistrarBase`) }.\nUse this interface?`;
            return (await confirm({ default: true, message }))
                ? (Interfaces[Owner][0] as string)
                : GoBackChoice;
        }
    };

    const PromptMainInterface: boolean = (
        Interfaces.Main.length > 0 &&
        (
            SelectedThusFar === undefined ||
            SelectedThusFar.Main === undefined ||
            SelectedThusFar.Main === GoBackChoice
        )
    );

    if (PromptMainInterface)
    {
        Out.Main = await GetSelection("Main");
    }

    const PromptRendererInterface: boolean = (
        Interfaces.Renderer.length > 0 &&
        (
            SelectedThusFar === undefined ||
            SelectedThusFar.Renderer === undefined ||
            SelectedThusFar.Renderer === GoBackChoice
        )
    );

    if (PromptRendererInterface)
    {
        Out.Renderer = await GetSelection("Renderer");
    }

    return Out;
}
