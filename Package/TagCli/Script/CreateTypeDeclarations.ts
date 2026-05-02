/**
 * @file      CreateTypeDeclarations.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable */

import {
    access as Access,
    mkdir as MakeDirectory,
    readdir as ReadDirectory,
    readFile as ReadFile,
    writeFile as WriteFile
} from "node:fs/promises";
import Path from "node:path";

const TypesDirectory: string = Path.resolve("./Distribution/Types");

type DeclarationTarget =
{
    readonly DeclarationFileExtension: "mts" | "cts";
    readonly JavaScriptSpecifierExtension: "mjs" | "cjs";
};

const DeclarationTargets: Array<DeclarationTarget> = [
    {
        DeclarationFileExtension: "mts",
        JavaScriptSpecifierExtension: "mjs"
    },
    {
        DeclarationFileExtension: "cts",
        JavaScriptSpecifierExtension: "cjs"
    }
];

const RelativeModuleSpecifierPattern: RegExp =
    /(?<Prefix>\b(?:from|import|require)\s*(?:\(\s*)?)(?<Quote>["'])(?<Path>\.{1,2}\/[^"']+?)(?<Extension>\.d\.(?:mts|cts|ts)|\.(?:mts|cts|tsx|ts|mjs|cjs|jsx|js))(?<ClosingQuote>["'])/g;

async function PathExists(FilePath: string): Promise<boolean>
{
    try
    {
        await Access(FilePath);
        return true;
    }
    catch
    {
        return false;
    }
}

async function GetDeclarationFilePaths(DirectoryPath: string): Promise<Array<string>>
{
    const DirectoryEntries = await ReadDirectory(DirectoryPath, {
        withFileTypes: true
    });

    const DeclarationFilePaths: Array<string> = [];

    for (const DirectoryEntry of DirectoryEntries)
    {
        const EntryPath: string = Path.join(DirectoryPath, DirectoryEntry.name);

        if (DirectoryEntry.isDirectory())
        {
            DeclarationFilePaths.push(...await GetDeclarationFilePaths(EntryPath));
            continue;
        }

        if (DirectoryEntry.isFile() && DirectoryEntry.name.endsWith(".d.ts"))
        {
            DeclarationFilePaths.push(EntryPath);
        }
    }

    return DeclarationFilePaths;
}

function CreateOutputDeclarationFilePath(
    DeclarationFilePath: string,
    DeclarationFileExtension: "mts" | "cts"
): string
{
    return DeclarationFilePath.replace(/\.d\.ts$/, `.d.${DeclarationFileExtension}`);
}

function RewriteRelativeModuleSpecifiers(
    Content: string,
    Target: DeclarationTarget
): string
{
    return Content.replace(
        RelativeModuleSpecifierPattern,
        (...ReplacementArguments: Array<unknown>) =>
        {
            const Groups = ReplacementArguments.at(-1) as {
                Prefix: string;
                Quote: string;
                Path: string;
                Extension: string;
                ClosingQuote: string;
            };

            if (Groups.Quote !== Groups.ClosingQuote)
            {
                return ReplacementArguments[0] as string;
            }

            const NewExtension: string = Groups.Extension.startsWith(".d.")
                ? `.d.${Target.DeclarationFileExtension}`
                : `.${Target.JavaScriptSpecifierExtension}`;

            return `${Groups.Prefix}${Groups.Quote}${Groups.Path}${NewExtension}${Groups.ClosingQuote}`;
        }
    );
}

function RewriteSourceMappingUrl(
    Content: string,
    Target: DeclarationTarget
): string
{
    return Content.replace(
        /\/\/# sourceMappingURL=([^\r\n]+)\.d\.ts\.map/g,
        `//# sourceMappingURL=$1.d.${Target.DeclarationFileExtension}.map`
    );
}

async function WriteDeclarationFile(
    DeclarationFilePath: string,
    Target: DeclarationTarget
): Promise<void>
{
    const OriginalContent: string = await ReadFile(DeclarationFilePath, "utf8");

    const OutputDeclarationFilePath: string = CreateOutputDeclarationFilePath(
        DeclarationFilePath,
        Target.DeclarationFileExtension
    );

    const OutputContent: string = RewriteSourceMappingUrl(
        RewriteRelativeModuleSpecifiers(OriginalContent, Target),
        Target
    );

    await MakeDirectory(Path.dirname(OutputDeclarationFilePath), {
        recursive: true
    });

    await WriteFile(OutputDeclarationFilePath, OutputContent);
}

async function WriteDeclarationMapFile(
    DeclarationFilePath: string,
    Target: DeclarationTarget
): Promise<void>
{
    const DeclarationMapFilePath: string = `${DeclarationFilePath}.map`;

    if (!await PathExists(DeclarationMapFilePath))
    {
        return;
    }

    const OutputDeclarationMapFilePath: string = `${CreateOutputDeclarationFilePath(
        DeclarationFilePath,
        Target.DeclarationFileExtension
    )}.map`;

    const OriginalMapContent: string = await ReadFile(DeclarationMapFilePath, "utf8");

    try
    {
        const DeclarationMap = JSON.parse(OriginalMapContent) as {
            file?: string;
            [Key: string]: unknown;
        };

        if (typeof DeclarationMap.file === "string")
        {
            DeclarationMap.file = DeclarationMap.file.replace(
                /\.d\.ts$/,
                `.d.${Target.DeclarationFileExtension}`
            );
        }

        await WriteFile(
            OutputDeclarationMapFilePath,
            `${JSON.stringify(DeclarationMap, undefined, 4)}\n`
        );
    }
    catch
    {
        await WriteFile(OutputDeclarationMapFilePath, OriginalMapContent);
    }
}

const DeclarationFilePaths: Array<string> = await GetDeclarationFilePaths(TypesDirectory);

await Promise.all(
    DeclarationFilePaths.flatMap((DeclarationFilePath) =>
    {
        return DeclarationTargets.flatMap((Target) =>
        {
            return [
                WriteDeclarationFile(DeclarationFilePath, Target),
                WriteDeclarationMapFile(DeclarationFilePath, Target)
            ];
        });
    })
);
