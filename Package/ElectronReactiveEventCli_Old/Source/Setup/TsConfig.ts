/* File:      TsConfig.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FBaseInterfaceName } from "../index.js";
import { GetPackageRootDirectory } from "@sorrell/utilities";
import TypeScript from "typescript";
import { resolve } from "path";

export function FormatDiagnostics(Diagnostics: ReadonlyArray<TypeScript.Diagnostic>): string
{
    return TypeScript.formatDiagnosticsWithColorAndContext(
        Diagnostics,
        {
            getCanonicalFileName(FileName: string): string
            {
                return FileName;
            },

            getCurrentDirectory(): string
            {
                return process.cwd();
            },

            getNewLine(): string
            {
                return TypeScript.sys.newLine;
            }
        }
    );
}

export function GetRightmostIdentifierText(
    Expression: TypeScript.Expression
): string | undefined
{
    if (TypeScript.isIdentifier(Expression))
    {
        return Expression.text;
    }

    if (TypeScript.isPropertyAccessExpression(Expression))
    {
        return Expression.name.text;
    }

    return undefined;
}

export function IsSearchableProjectSourceFile(
    SourceFile: TypeScript.SourceFile
): boolean
{
    if (SourceFile.isDeclarationFile)
    {
        return false;
    }

    const FileNameLower: string = SourceFile.fileName.toLowerCase();

    return FileNameLower.endsWith(".ts")
        || FileNameLower.endsWith(".tsx")
        || FileNameLower.endsWith(".mts")
        || FileNameLower.endsWith(".cts");
}

export function GetMatchingInterfacesInSourceFile(
    SourceFile: TypeScript.SourceFile,
    InterfaceName: FBaseInterfaceName
): ReadonlyArray<string>
{
    const MatchingInterfaceNames: Array<string> = [ ];

    const Visit = (Node: TypeScript.Node): void =>
    {
        if (TypeScript.isInterfaceDeclaration(Node))
        {
            const HeritageClauses: ReadonlyArray<TypeScript.HeritageClause> = Node.heritageClauses ?? [];

            for (const HeritageClause of HeritageClauses)
            {
                if (HeritageClause.token !== TypeScript.SyntaxKind.ExtendsKeyword)
                {
                    continue;
                }

                for (const HeritageType of HeritageClause.types)
                {
                    const ReferencedTypeName: string | undefined = GetRightmostIdentifierText(
                        HeritageType.expression
                    );

                    if (ReferencedTypeName === InterfaceName)
                    {
                        MatchingInterfaceNames.push(Node.name.text);
                        break;
                    }
                }
            }
        }

        TypeScript.forEachChild(Node, Visit);
    };

    Visit(SourceFile);

    return MatchingInterfaceNames;
}

export async function GetTsConfigPath(): Promise<string>
{
    return resolve(await GetPackageRootDirectory(), "tsconfig.json");
}
