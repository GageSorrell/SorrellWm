/**
 * @file      Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

import TypeScript from "typescript";

/**
 * Determine whether a given {@link TypeName} is a valid type name in TypeScript.
 *
 * @param TypeName - The type name to test.
 *
 * @returns {boolean} Whether the given {@link TypeName} is valid.
 */
export function IsValidTypeName(TypeName: string): boolean
{
    if (TypeName.length === 0)
    {
        return false;
    }

    if (TypeName.trim() !== TypeName)
    {
        return false;
    }

    const FileName: string = "TypeNameValidation.ts";
    const SourceText: string = `type ${ TypeName } = unknown;`;

    const CompilerOptions: TypeScript.CompilerOptions = {
        noEmit: true,
        skipLibCheck: true,
        target: TypeScript.ScriptTarget.Latest
    };

    const DefaultCompilerHost: TypeScript.CompilerHost = TypeScript.createCompilerHost(CompilerOptions, true);

    const CompilerHost: TypeScript.CompilerHost =
        {
            ...DefaultCompilerHost,

            getSourceFile: (
                RequestedFileName: string,
                LanguageVersion: TypeScript.ScriptTarget | TypeScript.CreateSourceFileOptions,
                OnError: (Message: string) => void | undefined,
                ShouldCreateNewSourceFile: boolean | undefined
            ): TypeScript.SourceFile | undefined =>
            {
                if (RequestedFileName === FileName)
                {
                    return TypeScript.createSourceFile(
                        FileName,
                        SourceText,
                        LanguageVersion,
                        true,
                        TypeScript.ScriptKind.TS
                    );
                }

                return DefaultCompilerHost.getSourceFile(
                    RequestedFileName,
                    LanguageVersion,
                    OnError,
                    ShouldCreateNewSourceFile
                );
            }
        };

    const Program: TypeScript.Program = TypeScript.createProgram(
        [ FileName ],
        CompilerOptions,
        CompilerHost
    );

    const SourceFile: TypeScript.SourceFile | undefined = Program.getSourceFile(FileName);

    if (SourceFile === undefined)
    {
        return false;
    }

    if (Program.getSyntacticDiagnostics(SourceFile).length > 0)
    {
        return false;
    }

    const [ Statement ] = SourceFile.statements;

    if (
        SourceFile.statements.length !== 1 ||
        Statement === undefined ||
        TypeScript.isTypeAliasDeclaration(Statement) === false
    )
    {
        return false;
    }

    return Statement.name.getText(SourceFile) === TypeName;
}
