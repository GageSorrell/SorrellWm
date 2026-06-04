/**
 * @file      Generate.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import * as Path from "path";
import * as TypeScript from "typescript";
import { Effect, pipe } from "effect";
import type { ExportedType } from "../../../Provider/Config/index.js";
import type { TFunction } from "@sorrell/utilities/functional";

/**
 * For a given consumer (identified by its {@link TsConfigPath}), and a the {@link GenericType}
 * exported by a given provider of the consumer, get the locally exported
 * {@link ExportedType | ExportedTypes}, to augment the provider's registry interface with.
 *
 * @param TsConfigPath - The path to the `tsconfig.json` file for the consumer.
 *
 * @param GenericType - The generic {@link ExportedType} provided by a given provider
 * of the consumer.
 *
 * @returns {Effect.Effect<ReadonlyArray<ExportedType>, never, never>} The names and absolute
 * paths to the descendant types exported locally by the consumer, with which the provider's
 * export registry interface will be augmented.
 */
export function GetDescendantTypes(
    TsConfigPath: string,
    GenericType: ExportedType
): Effect.Effect<ReadonlyArray<ExportedType>, never, never>
{
    return Effect.gen(function* ()
    {
        const AbsoluteTypeScriptConfigFilePath: string = Path.resolve(TsConfigPath);
        const TypeScriptConfigDirectoryPath: string = Path.dirname(AbsoluteTypeScriptConfigFilePath);

        const ParsedTypeScriptConfig: TypeScript.ParsedCommandLine =
            ReadTypeScriptConfig(AbsoluteTypeScriptConfigFilePath);

        const GenericModuleFilePath: string = ResolveGenericModuleFilePath(
            GenericType.Path,
            TypeScriptConfigDirectoryPath,
            ParsedTypeScriptConfig.options
        );

        const RootFileNames: Array<string> = Array.from(new Set([
            ...ParsedTypeScriptConfig.fileNames,
            GenericModuleFilePath
        ]));

        const Program: TypeScript.Program = TypeScript.createProgram({
            options: ParsedTypeScriptConfig.options,
            projectReferences: ParsedTypeScriptConfig.projectReferences || [ ],
            rootNames: RootFileNames
        });

        const TypeChecker: TypeScript.TypeChecker = Program.getTypeChecker();

        const TargetGenericSymbol: TypeScript.Symbol =
            ResolveExportedSymbolFromModule({
                ExportName: GenericType.Name,
                ModuleFilePath: GenericModuleFilePath,
                Program,
                TypeChecker
            });

        const GetCanonicalFileName: TFunction<string, string> = CreateCanonicalFileNameFunction();

        const ProjectFileNames: Set<string> = new Set(
            ParsedTypeScriptConfig.fileNames.map(GetCanonicalFileName)
        );

        const Results: Array<ExportedType> = [ ];
        const SeenResults: Set<string> = new Set<string>();

        for (const SourceFile of Program.getSourceFiles())
        {
            if (!ProjectFileNames.has(GetCanonicalFileName(SourceFile.fileName)))
            {
                continue;
            }

            const ModuleSymbol: TypeScript.Symbol | undefined = TypeChecker.getSymbolAtLocation(SourceFile);

            if (ModuleSymbol === undefined)
            {
                continue;
            }

            const ExportedSymbols: Array<TypeScript.Symbol> = TypeChecker.getExportsOfModule(ModuleSymbol);

            for (const ExportedSymbol of ExportedSymbols)
            {
                const ExportName: string = ExportedSymbol.getName();
                const ResolvedExportedSymbol: TypeScript.Symbol =
                    ResolveAliasedSymbol(TypeChecker, ExportedSymbol);

                if (!IsTypeLikeExportUsingGenericType(
                    TypeChecker,
                    ResolvedExportedSymbol,
                    TargetGenericSymbol
                ))
                {
                    continue;
                }

                const AbsoluteModulePath: string = Path.resolve(SourceFile.fileName);
                const ResultKey: string = `${ AbsoluteModulePath }\0${ ExportName }`;

                if (SeenResults.has(ResultKey))
                {
                    continue;
                }

                SeenResults.add(ResultKey);

                Results.push({
                    Name: ExportName,
                    Path: AbsoluteModulePath
                });
            }
        }

        return Results;
    });
}

function ReadTypeScriptConfig(
    AbsoluteTypeScriptConfigFilePath: string
): TypeScript.ParsedCommandLine
{
    const ReadResult: ReturnType<typeof TypeScript.readConfigFile> =
        TypeScript.readConfigFile(
            AbsoluteTypeScriptConfigFilePath,
            TypeScript.sys.readFile
        );

    if (ReadResult.error !== undefined)
    {
        throw new Error(FormatDiagnostics([ ReadResult.error ]));
    }

    const ParsedResult: TypeScript.ParsedCommandLine = TypeScript.parseJsonConfigFileContent(
        ReadResult.config,
        TypeScript.sys,
        Path.dirname(AbsoluteTypeScriptConfigFilePath),
        undefined,
        AbsoluteTypeScriptConfigFilePath
    );

    if (ParsedResult.errors.length > 0)
    {
        throw new Error(FormatDiagnostics(ParsedResult.errors));
    }

    return ParsedResult;
}

function ResolveGenericModuleFilePath(
    ImportPath: string,
    TypeScriptConfigDirectoryPath: string,
    CompilerOptions: TypeScript.CompilerOptions
): string
{
    const ContainingFilePath: string = Path.join(
        TypeScriptConfigDirectoryPath,
        "__generic_type_probe__.ts"
    );

    const ResolutionResult: TypeScript.ResolvedModuleWithFailedLookupLocations = TypeScript.resolveModuleName(
        ImportPath,
        ContainingFilePath,
        CompilerOptions,
        TypeScript.sys
    );

    const ResolvedModule: TypeScript.ResolvedModuleFull | undefined = ResolutionResult.resolvedModule;

    if (ResolvedModule === undefined)
    {
        throw new Error(`Could not resolve module "${ImportPath}".`);
    }

    return Path.resolve(ResolvedModule.resolvedFileName);
}

function ResolveExportedSymbolFromModule(
    Options: {
        readonly Program: TypeScript.Program;
        readonly TypeChecker: TypeScript.TypeChecker;
        readonly ModuleFilePath: string;
        readonly ExportName: string;
    }
): TypeScript.Symbol
{
    const SourceFile: TypeScript.SourceFile | undefined =
        Options.Program.getSourceFile(Options.ModuleFilePath);

    if (SourceFile === undefined)
    {
        throw new Error(
            `Resolved module was not included in the TypeScript program: ${ Options.ModuleFilePath }`
        );
    }

    const ModuleSymbol: TypeScript.Symbol | undefined = Options.TypeChecker.getSymbolAtLocation(SourceFile);

    if (ModuleSymbol === undefined)
    {
        throw new Error(`Resolved module has no module symbol: ${Options.ModuleFilePath}`);
    }

    const ExportedSymbol: TypeScript.Symbol | undefined = Options.TypeChecker
        .getExportsOfModule(ModuleSymbol)
        .find((SymbolValue: TypeScript.Symbol) => SymbolValue.getName() === Options.ExportName);

    if (ExportedSymbol === undefined)
    {
        throw new Error(`Module "${ Options.ModuleFilePath }" does not export "${ Options.ExportName }".`);
    }

    return ResolveAliasedSymbol(Options.TypeChecker, ExportedSymbol);
}

function IsTypeLikeExportUsingGenericType(
    TypeChecker: TypeScript.TypeChecker,
    ExportedSymbol: TypeScript.Symbol,
    TargetGenericSymbol: TypeScript.Symbol
): boolean
{
    const Declarations: Array<TypeScript.Declaration> = ExportedSymbol.getDeclarations() ?? [ ];

    return Declarations.some((Declaration: TypeScript.Declaration): boolean =>
    {
        if (!IsTypeLikeDeclaration(Declaration))
        {
            return false;
        }

        return DoesNodeReferenceGenericType(
            TypeChecker,
            Declaration,
            TargetGenericSymbol,
            new Set<TypeScript.Symbol>()
        );
    });
}

function IsTypeLikeDeclaration(
    Declaration: TypeScript.Declaration
): boolean
{
    return (
        TypeScript.isTypeAliasDeclaration(Declaration) ||
        TypeScript.isInterfaceDeclaration(Declaration) ||
        TypeScript.isClassDeclaration(Declaration)
    );
}

function DoesNodeReferenceGenericType(
    TypeChecker: TypeScript.TypeChecker,
    Node: TypeScript.Node,
    TargetGenericSymbol: TypeScript.Symbol,
    SeenSymbols: Set<TypeScript.Symbol>
): boolean
{
    if (TypeScript.isTypeReferenceNode(Node))
    {
        const ReferencedSymbol: TypeScript.Symbol | undefined =
            TypeChecker.getSymbolAtLocation(Node.typeName);

        if (
            ReferencedSymbol !== undefined
      && DoesSymbolReferenceGenericType(
          TypeChecker,
          ReferencedSymbol,
          TargetGenericSymbol,
          SeenSymbols
      )
        )
        {
            return true;
        }
    }

    if (TypeScript.isExpressionWithTypeArguments(Node))
    {
        const ReferencedSymbol: TypeScript.Symbol | undefined =
            TypeChecker.getSymbolAtLocation(Node.expression);

        if (
            ReferencedSymbol !== undefined
      && DoesSymbolReferenceGenericType(
          TypeChecker,
          ReferencedSymbol,
          TargetGenericSymbol,
          SeenSymbols
      )
        )
        {
            return true;
        }
    }

    if (TypeScript.isImportTypeNode(Node) && Node.qualifier !== undefined)
    {
        const ReferencedSymbol: TypeScript.Symbol | undefined =
            TypeChecker.getSymbolAtLocation(Node.qualifier);

        if (
            ReferencedSymbol !== undefined
      && DoesSymbolReferenceGenericType(
          TypeChecker,
          ReferencedSymbol,
          TargetGenericSymbol,
          SeenSymbols
      )
        )
        {
            return true;
        }
    }

    return TypeScript.forEachChild(
        Node,
        (Child: TypeScript.Node) => DoesNodeReferenceGenericType(
            TypeChecker,
            Child,
            TargetGenericSymbol,
            SeenSymbols
        )
    ) === true;
}

function DoesSymbolReferenceGenericType(
    TypeChecker: TypeScript.TypeChecker,
    SymbolValue: TypeScript.Symbol,
    TargetGenericSymbol: TypeScript.Symbol,
    SeenSymbols: Set<TypeScript.Symbol>
): boolean
{
    const ResolvedSymbol: TypeScript.Symbol = ResolveAliasedSymbol(TypeChecker, SymbolValue);

    if (ResolvedSymbol === TargetGenericSymbol)
    {
        return true;
    }

    if (SeenSymbols.has(ResolvedSymbol))
    {
        return false;
    }

    SeenSymbols.add(ResolvedSymbol);

    const Declarations: Array<TypeScript.Declaration> = ResolvedSymbol.getDeclarations() ?? [ ];

    return Declarations.some((Declaration: TypeScript.Declaration): boolean =>
    {
        if (!IsTypeLikeDeclaration(Declaration))
        {
            return false;
        }

        return DoesNodeReferenceGenericType(
            TypeChecker,
            Declaration,
            TargetGenericSymbol,
            SeenSymbols
        );
    });
}

function ResolveAliasedSymbol(
    TypeChecker: TypeScript.TypeChecker,
    SymbolValue: TypeScript.Symbol
): TypeScript.Symbol
{
    if ((SymbolValue.flags & TypeScript.SymbolFlags.Alias) === 0)
    {
        return SymbolValue;
    }

    return TypeChecker.getAliasedSymbol(SymbolValue);
}

function CreateCanonicalFileNameFunction(): TFunction<string, string>
{
    const CanonicalizeCasing: TFunction<string, string> = TypeScript.sys.useCaseSensitiveFileNames
        ? (FileName: string) => FileName
        : (FileName: string) => FileName.toLowerCase();

    return (FileName: string) => CanonicalizeCasing(Path.resolve(FileName));
}

function FormatDiagnostics(
    Diagnostics: ReadonlyArray<TypeScript.Diagnostic>
): string
{
    const FormatHost: TypeScript.FormatDiagnosticsHost = {
        getCanonicalFileName: (FileName: string) => FileName,
        getCurrentDirectory: () => TypeScript.sys.getCurrentDirectory(),
        getNewLine: () => TypeScript.sys.newLine
    };

    return TypeScript.formatDiagnosticsWithColorAndContext(
        [ ...Diagnostics ],
        FormatHost
    );
}

/**
 * For a given module at path {@link OutPath}, and for each absolute module path in {@link Modules},
 * get the import path that can be used in the module at path {@link OutPath} to import from the respective
 * module.
 *
 * @param TypeScriptConfigFilePath - The path to the project's TypeScript config file.
 *
 * @param OutPath - The path to the module that will `import` contents that are exported by
 * the given {@link Modules}.
 *
 * @param Modules - The absolute paths to the consumer modules that export types that the
 * module at {@link OutPath} will `import`.
 *
 * @returns {ReadonlyArray<string>} The mapped paths, which can be used in `import` statements in the module
 * at {@link OutPath}.
 */
export function GetImportSpecifiersForModules(
    TypeScriptConfigFilePath: string,
    OutPath: string,
    Modules: ReadonlyArray<string>
): ReadonlyArray<string>
{
    const AbsoluteTypeScriptConfigFilePath: string = Path.resolve(TypeScriptConfigFilePath);
    const TypeScriptConfigDirectoryPath: string = Path.dirname(AbsoluteTypeScriptConfigFilePath);
    const ParsedTypeScriptConfig: TypeScript.ParsedCommandLine =
        ReadTypeScriptConfig(AbsoluteTypeScriptConfigFilePath);

    const AbsoluteOutPath: string = Path.isAbsolute(OutPath)
        ? Path.normalize(OutPath)
        : Path.resolve(TypeScriptConfigDirectoryPath, OutPath);

    const OutDirectoryPath: string = Path.dirname(AbsoluteOutPath);

    return Modules.map((ModulePath: string) =>
    {
        if (!Path.isAbsolute(ModulePath))
        {
            throw new Error(`Expected an absolute module path, but received "${ModulePath}".`);
        }

        const AbsoluteModulePath: string = Path.normalize(ModulePath);

        const ImportTargetPath: string = GetImportTargetPath(
            AbsoluteModulePath,
            ParsedTypeScriptConfig.options
        );

        const RelativePath: string = Path.relative(OutDirectoryPath, ImportTargetPath);
        const NormalizedRelativePath: string = NormalizePathForModuleSpecifier(RelativePath);

        if (
            NormalizedRelativePath.startsWith("../")
      || NormalizedRelativePath === ".."
      || NormalizedRelativePath.startsWith("./")
      || NormalizedRelativePath === "."
        )
        {
            return NormalizedRelativePath;
        }

        return `./${ NormalizedRelativePath }`;
    });
}

function GetImportTargetPath(
    AbsoluteModulePath: string,
    CompilerOptions: TypeScript.CompilerOptions
): string
{
    const TypeScriptExtension: string | undefined = GetTypeScriptModuleExtension(AbsoluteModulePath);

    if (TypeScriptExtension === undefined)
    {
        return RemoveLastExtension(AbsoluteModulePath);
    }

    const PathWithoutTypeScriptExtension: string =
        RemoveTypeScriptModuleExtension(
            AbsoluteModulePath,
            TypeScriptExtension
        );

    if (ShouldUseTypeScriptExtensionInImportSpecifier(CompilerOptions))
    {
        return `${PathWithoutTypeScriptExtension}${TypeScriptExtension}`;
    }

    if (ShouldUseJavaScriptExtensionInImportSpecifier(CompilerOptions))
    {
        return (
            PathWithoutTypeScriptExtension +
            GetJavaScriptExtensionForTypeScriptExtension(TypeScriptExtension)
        );
    }

    return PathWithoutTypeScriptExtension;
}

function ShouldUseTypeScriptExtensionInImportSpecifier(
    CompilerOptions: TypeScript.CompilerOptions
): boolean
{
    return (
        CompilerOptions.allowImportingTsExtensions === true &&
        (
            CompilerOptions.noEmit === true ||
            CompilerOptions.emitDeclarationOnly === true ||
            CompilerOptions.rewriteRelativeImportExtensions === true
        )
    );
}

function ShouldUseJavaScriptExtensionInImportSpecifier(
    CompilerOptions: TypeScript.CompilerOptions
): boolean
{
    const ModuleResolutionKind: TypeScript.ModuleResolutionKind | undefined =
        GetEffectiveModuleResolutionKind(CompilerOptions);

    return (
        ModuleResolutionKind === TypeScript.ModuleResolutionKind.Node16 ||
        ModuleResolutionKind === TypeScript.ModuleResolutionKind.NodeNext
    );
}

function GetEffectiveModuleResolutionKind(
    CompilerOptions: TypeScript.CompilerOptions
): TypeScript.ModuleResolutionKind | undefined
{
    if (CompilerOptions.moduleResolution !== undefined)
    {
        return CompilerOptions.moduleResolution;
    }

    if (CompilerOptions.module === TypeScript.ModuleKind.Node16)
    {
        return TypeScript.ModuleResolutionKind.Node16;
    }

    if (CompilerOptions.module === TypeScript.ModuleKind.NodeNext)
    {
        return TypeScript.ModuleResolutionKind.NodeNext;
    }

    return undefined;
}

function GetTypeScriptModuleExtension(
    FilePath: string
): string | undefined
{
    const FilePathLowerCase: string = FilePath.toLowerCase();

    if (FilePathLowerCase.endsWith(".d.mts"))
    {
        return ".mts";
    }

    if (FilePathLowerCase.endsWith(".d.cts"))
    {
        return ".cts";
    }

    if (FilePathLowerCase.endsWith(".d.ts"))
    {
        return ".ts";
    }

    if (FilePathLowerCase.endsWith(".mts"))
    {
        return ".mts";
    }

    if (FilePathLowerCase.endsWith(".cts"))
    {
        return ".cts";
    }

    if (FilePathLowerCase.endsWith(".tsx"))
    {
        return ".tsx";
    }

    if (FilePathLowerCase.endsWith(".ts"))
    {
        return ".ts";
    }

    if (FilePathLowerCase.endsWith(".jsx"))
    {
        return ".jsx";
    }

    if (FilePathLowerCase.endsWith(".js"))
    {
        return ".js";
    }

    return undefined;
}

function RemoveTypeScriptModuleExtension(
    FilePath: string,
    Extension: string
): string
{
    const FilePathLowerCase: string = FilePath.toLowerCase();

    if (Extension === ".mts" && FilePathLowerCase.endsWith(".d.mts"))
    {
        return FilePath.slice(0, -".d.mts".length);
    }

    if (Extension === ".cts" && FilePathLowerCase.endsWith(".d.cts"))
    {
        return FilePath.slice(0, -".d.cts".length);
    }

    if (Extension === ".ts" && FilePathLowerCase.endsWith(".d.ts"))
    {
        return FilePath.slice(0, -".d.ts".length);
    }

    return FilePath.slice(0, -Extension.length);
}

function GetJavaScriptExtensionForTypeScriptExtension(
    Extension: string
): string
{
    switch (Extension)
    {
        case ".mts":
        {
            return ".mjs";
        }

        case ".cts":
        {
            return ".cjs";
        }

        case ".ts":
        case ".tsx":
        {
            return ".js";
        }

        case ".js":
        case ".jsx":
        {
            return ".js";
        }

        default:
        {
            return ".js";
        }
    }
}

function RemoveLastExtension(
    FilePath: string
): string
{
    const Extension: string = Path.extname(FilePath);

    if (Extension === "")
    {
        return FilePath;
    }

    return FilePath.slice(0, -Extension.length);
}

function NormalizePathForModuleSpecifier(FilePath: string): string
{
    const NormalizedPath: string = FilePath.split(Path.sep).join("/");

    if (NormalizedPath === "")
    {
        return ".";
    }

    return NormalizedPath;
}

export const MapRecordEntriesEffect = <
    const InputRecord extends Readonly<Record<string, InputValue>>,
    InputValue,
    OutputKey extends PropertyKey,
    OutputValue,
    ErrorValue,
    Requirements
>(
    RecordValue: InputRecord,
    Function: (
        Value: InputRecord[keyof InputRecord],
        Key: keyof InputRecord & string
    ) => Effect.Effect<readonly [ OutputKey, OutputValue ], ErrorValue, Requirements>
): Effect.Effect<Readonly<Record<OutputKey, OutputValue>>, ErrorValue, Requirements> =>
{
    type EntryType = readonly [ keyof InputRecord & string, InputRecord[keyof InputRecord] ];
    const Entries: ReadonlyArray<EntryType> = Object.entries(RecordValue) as ReadonlyArray<EntryType>;

    const Wrapper = (
        [ Value, Key ]: EntryType,
        _Index: number
    ): ReturnType<typeof Function> =>
    {
        return Function(
            Value as Parameters<typeof Function>[0],
            Key as Parameters<typeof Function>[1]
        );
    };

    return pipe(
        Effect.forEach(Entries, Wrapper),
        Effect.map(Object.fromEntries)
    );
};
