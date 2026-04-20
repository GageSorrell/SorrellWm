/**
 * @file      Script.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license:  MIT
 */

import { basename, dirname, relative, resolve } from "path";
import { type Dirent, promises as Fs } from "fs";
import type { IPackageJson } from "package-json-type";
import { Async } from "@sorrell/utilities";
import Chalk from "chalk";
import { Code } from "@sorrell/cli-utilities";

async function GetDependencies(): Promise<Array<string>>
{
    const Path: string = resolve(".", "package.json");
    const ReadPackageJson = async (Path: string) => Fs.readFile(Path, { encoding: "utf-8" });
    const Parse = (Contents: string): IPackageJson => JSON.parse(Contents) as IPackageJson;

    const PackageJson: IPackageJson = Parse(await ReadPackageJson(Path));

    return [
        ...(Object.keys(PackageJson.dependencies ?? [ ])),
        ...(Object.keys(PackageJson.devDependencies ?? [ ])),
        ...(Object.keys(PackageJson.peerDependencies ?? [ ])),
    ]
}

async function GetTsConfigPaths(): Promise<Array<string>>
{
    type TsConfigPart =
        {
            compilerOptions:
            {
                paths: Record<string, string>;
            };
        };

    const TsConfigPart: TsConfigPart = JSON.parse(
        await Fs.readFile(resolve(".", "tsconfig.json"), { encoding: "utf-8" })
    ) as TsConfigPart;

    return Object.keys(TsConfigPart.compilerOptions.paths);
}

type File =
    {
        Contents: string;
        Path: string;
    };


async function ToFile(Entry: Dirent): Promise<File>
{
    const Path: string = resolve(Entry.parentPath, Entry.name);
    const Contents: string = await Fs.readFile(Path, { encoding: "utf-8" });

    return {
        Contents,
        Path
    };
}

function GetImportStatements(File: File): Array<string>
{
    const IsImportStatement = (Line: string) => Line.trim().startsWith("import");

    return File.Contents
        .split("\n")
        .filter(IsImportStatement);
}

type SplitFile =
    {
        Imports: Array<string>;
        Tail: Array<string>;
    };

async function SplitFileByImports(File: File): Promise<SplitFile>
{
    const Imports: Array<string> = await GetImportStatements(File);
    const Tail: Array<string> = File.Contents.split("\n").filter(Line => !Imports.includes(Line));

    return {
        Imports,
        Tail
    };
}

type TsConfigPath = `@${ string }`;

type FixImportStatementReturnType =
    {
        (ImportStatement: string): Promise<string>;
    };

function GetFixImportStatement(
    File: File,
    Dependencies: Array<string>,
    TsConfigPaths: Array<string>
): FixImportStatementReturnType
{
    return async function(ImportStatement: string): Promise<string>
    {
        // const Quote: "'" | "\"" = ImportStatement.includes("'") ? "'" : "\"";
        const Quote: "'" = "'";
        const StartIndex: number = ImportStatement.indexOf(Quote) + 1;
        const EndIndex: number = ImportStatement.indexOf(Quote, StartIndex);

        const ImportPath: string = ImportStatement.slice(StartIndex, EndIndex);

        type ImportType =
            | "Package"
            | "Relative"
            | "TsConfigPath";

        function GetImportPathType(): ImportType
        {
            const Builtins: Array<string> =
                [
                    "fs",
                    "path"
                ];

            if ([ ...Builtins, ...Dependencies].includes(ImportPath))
            {
                return "Package";
            }

            const ImportStartsWith = (TsConfigPath: string): boolean =>
            {
                return ImportPath.startsWith(TsConfigPath);
            };

            if (TsConfigPaths.some(ImportStartsWith))
            {
                return "TsConfigPath";
            }

            return "Relative";
        }

        const Type: ImportType = GetImportPathType();
        const IsDirectory = async (): Promise<boolean> =>
        {
            if (Type === "Package")
            {
                return false;
            }

            console.log(`ImportPath:\n    ${ ImportPath }\nresolve(File.Path):\n    ${ resolve(File.Path) }\n`);
            const BaseDirectory: string = dirname(relative(dirname(ImportPath), resolve(File.Path)));
            const ParentEntries: Array<Dirent> = await Fs.readdir(BaseDirectory, { withFileTypes: true });
            const ThisEntry: Dirent | undefined = ParentEntries.find((Entry: Dirent): boolean =>
            {
                const ImportPathPart: string = ((): string =>
                {
                    let Out: string = ImportPath;
                    TsConfigPaths.forEach((TsConfigPath: string): void =>
                    {
                        Out = Out.replace(TsConfigPath, "");
                    });

                    return Out;
                })();

                const EntryNameFixed: string = Entry.name.replaceAll("\\", "/");
                return EntryNameFixed.includes(ImportPathPart);
            });

            if (ThisEntry === undefined)
            {
                console.error(`ThisEntry was undefined:\n    ${ ImportPath },\n    ${ File.Path }`);
                return false;
                // throw new Error();
            }

            return ThisEntry.isDirectory();
        }

        const InsertNewPath = (NewPath: string): string =>
        {
            const Head: string = ImportStatement.slice(0, StartIndex);
            const Tail: string = ImportStatement.slice(EndIndex);
            return Head + NewPath + Tail;
        };

        if (Type === "Package" || Type === "Relative")
        {
            const NewPath: string = await IsDirectory()
                ? ImportPath + "/index.js"
                : ImportPath + ".js";

            return InsertNewPath(NewPath);
        }
        else
        {
            return ImportStatement;
        }
    };
}

type FixFileReturnType =
    {
        (File: File): Promise<File>;
    };
async function FixFile(
    Dependencies: Array<string>,
    TsConfigPaths: Array<string>
): Promise<FixFileReturnType>
{
    return async function(File: File): Promise<File>
    {
        const { Imports, Tail } = await SplitFileByImports(File);
        const FixImportStatement = GetFixImportStatement(File, Dependencies, TsConfigPaths);
        const FixedImports: Array<string> = await Async.Map(Imports, FixImportStatement);
        const NewContents: string = [ FixedImports, Tail ].join("\n");
        return {
            ...File,
            Contents: NewContents
        };
    }
}

async function Main(): Promise<void>
{
    const FilePaths: Array<Dirent> = (await Fs.readdir(resolve(".", "Source"), { recursive: true, withFileTypes: true }))
        .filter((Entry: Dirent): boolean =>
        {
            return Entry.isFile() && Entry.name.endsWith(".ts");
        });

    const Files: Array<File> = await Async.Map(FilePaths, ToFile);
    const Dependencies: Array<string> = await GetDependencies();
    const TsConfigPaths: Array<string> = await GetTsConfigPaths();

    const FixedFiles: Array<File> = await Async.Map(Files, await FixFile(Dependencies, TsConfigPaths));

    async function WriteFixedFile(FixedFile: File): Promise<void>
    {
        const BackupPath: string = FixedFile.Path + ".old";
        await Fs.copyFile(FixedFile.Path, BackupPath);
        const StartPathFormatted: string = Code(relative(FixedFile.Path, resolve(".", "Source")));
        const BackupPathFormatted: string = Code(BackupPath);
        const Checkmark: string = Chalk.green.bold("✓");
        const Log = (Statement: string): void => console.log(`${ Checkmark } ${ Statement }`);
        Log(`Moved ${ StartPathFormatted } -> ${ BackupPathFormatted }`);

        const ModuleNameFormatted: string = Code(basename(FixedFile.Path));

        await Fs.rm(FixedFile.Path);
        Log(`Deleted ${ ModuleNameFormatted }`);

        await Fs.writeFile(FixedFile.Path, FixedFile.Contents, { encoding: "utf-8" });
        Log(`Wrote ${ ModuleNameFormatted }`);

        // const Imports: Array<string> = FixedFile.Contents.split("\n").filter(Line => Line.trim().startsWith("import"));
        // console.log(`File: ${ basename(FixedFile.Path) }`);
        // const LogImport = (Import: string): void =>
        // {
        //     const Quote: "'" | "\"" = Import.includes("'") ? "'" : "\"";
        //     const StartIndex: number = Import.indexOf(Quote) + 1;
        //     const EndIndex: number = Import.indexOf(Quote, StartIndex);

        //     const ImportPath: string = Import.slice(StartIndex, EndIndex);
        //     console.log(`    ${ ImportPath }`);
        // };

        // Imports.forEach(LogImport);
    });
    Async.Map(FixedFiles, WriteFixedFile);

    // Files.forEach((File: File): void =>
    // {

    // });
}

Main();
