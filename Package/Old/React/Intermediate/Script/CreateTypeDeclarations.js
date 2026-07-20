/**
 * @file      CreateTypeDeclarations.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
/* eslint-disable */
import { access as Access, mkdir as MakeDirectory, readdir as ReadDirectory, readFile as ReadFile, writeFile as WriteFile } from "node:fs/promises";
import Path from "node:path";
const TypesDirectory = Path.resolve("./Distribution/Types");
const DeclarationTargets = [
    {
        DeclarationFileExtension: "mts",
        JavaScriptSpecifierExtension: "mjs"
    },
    {
        DeclarationFileExtension: "cts",
        JavaScriptSpecifierExtension: "cjs"
    }
];
const RelativeModuleSpecifierPattern = /(?<Prefix>\b(?:from|import|require)\s*(?:\(\s*)?)(?<Quote>["'])(?<Path>\.{1,2}\/[^"']+?)(?<Extension>\.d\.(?:mts|cts|ts)|\.(?:mts|cts|tsx|ts|mjs|cjs|jsx|js))(?<ClosingQuote>["'])/g;
async function PathExists(FilePath) {
    try {
        await Access(FilePath);
        return true;
    }
    catch {
        return false;
    }
}
async function GetDeclarationFilePaths(DirectoryPath) {
    const DirectoryEntries = await ReadDirectory(DirectoryPath, {
        withFileTypes: true
    });
    const DeclarationFilePaths = [];
    for (const DirectoryEntry of DirectoryEntries) {
        const EntryPath = Path.join(DirectoryPath, DirectoryEntry.name);
        if (DirectoryEntry.isDirectory()) {
            DeclarationFilePaths.push(...await GetDeclarationFilePaths(EntryPath));
            continue;
        }
        if (DirectoryEntry.isFile() && DirectoryEntry.name.endsWith(".d.ts")) {
            DeclarationFilePaths.push(EntryPath);
        }
    }
    return DeclarationFilePaths;
}
function CreateOutputDeclarationFilePath(DeclarationFilePath, DeclarationFileExtension) {
    return DeclarationFilePath.replace(/\.d\.ts$/, `.d.${DeclarationFileExtension}`);
}
function RewriteRelativeModuleSpecifiers(Content, Target) {
    return Content.replace(RelativeModuleSpecifierPattern, (...ReplacementArguments) => {
        const Groups = ReplacementArguments.at(-1);
        if (Groups.Quote !== Groups.ClosingQuote) {
            return ReplacementArguments[0];
        }
        const NewExtension = Groups.Extension.startsWith(".d.")
            ? `.d.${Target.DeclarationFileExtension}`
            : `.${Target.JavaScriptSpecifierExtension}`;
        return `${Groups.Prefix}${Groups.Quote}${Groups.Path}${NewExtension}${Groups.ClosingQuote}`;
    });
}
function RewriteSourceMappingUrl(Content, Target) {
    return Content.replace(/\/\/# sourceMappingURL=([^\r\n]+)\.d\.ts\.map/g, `//# sourceMappingURL=$1.d.${Target.DeclarationFileExtension}.map`);
}
async function WriteDeclarationFile(DeclarationFilePath, Target) {
    const OriginalContent = await ReadFile(DeclarationFilePath, "utf8");
    const OutputDeclarationFilePath = CreateOutputDeclarationFilePath(DeclarationFilePath, Target.DeclarationFileExtension);
    const OutputContent = RewriteSourceMappingUrl(RewriteRelativeModuleSpecifiers(OriginalContent, Target), Target);
    await MakeDirectory(Path.dirname(OutputDeclarationFilePath), {
        recursive: true
    });
    await WriteFile(OutputDeclarationFilePath, OutputContent);
}
async function WriteDeclarationMapFile(DeclarationFilePath, Target) {
    const DeclarationMapFilePath = `${DeclarationFilePath}.map`;
    if (!await PathExists(DeclarationMapFilePath)) {
        return;
    }
    const OutputDeclarationMapFilePath = `${CreateOutputDeclarationFilePath(DeclarationFilePath, Target.DeclarationFileExtension)}.map`;
    const OriginalMapContent = await ReadFile(DeclarationMapFilePath, "utf8");
    try {
        const DeclarationMap = JSON.parse(OriginalMapContent);
        if (typeof DeclarationMap.file === "string") {
            DeclarationMap.file = DeclarationMap.file.replace(/\.d\.ts$/, `.d.${Target.DeclarationFileExtension}`);
        }
        await WriteFile(OutputDeclarationMapFilePath, `${JSON.stringify(DeclarationMap, undefined, 4)}\n`);
    }
    catch {
        await WriteFile(OutputDeclarationMapFilePath, OriginalMapContent);
    }
}
const DeclarationFilePaths = await GetDeclarationFilePaths(TypesDirectory);
await Promise.all(DeclarationFilePaths.flatMap((DeclarationFilePath) => {
    return DeclarationTargets.flatMap((Target) => {
        return [
            WriteDeclarationFile(DeclarationFilePath, Target),
            WriteDeclarationMapFile(DeclarationFilePath, Target)
        ];
    });
}));
//# sourceMappingURL=CreateTypeDeclarations.js.map