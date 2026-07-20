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
export function GetDescendantTypes(TsConfigPath, GenericType) {
    return Effect.gen(function* () {
        const AbsoluteTypeScriptConfigFilePath = Path.resolve(TsConfigPath);
        const TypeScriptConfigDirectoryPath = Path.dirname(AbsoluteTypeScriptConfigFilePath);
        const ParsedTypeScriptConfig = ReadTypeScriptConfig(AbsoluteTypeScriptConfigFilePath);
        const GenericModuleFilePath = ResolveGenericModuleFilePath(GenericType.Path, TypeScriptConfigDirectoryPath, ParsedTypeScriptConfig.options);
        const RootFileNames = Array.from(new Set([
            ...ParsedTypeScriptConfig.fileNames,
            GenericModuleFilePath
        ]));
        const Program = TypeScript.createProgram({
            options: ParsedTypeScriptConfig.options,
            projectReferences: ParsedTypeScriptConfig.projectReferences || [],
            rootNames: RootFileNames
        });
        const TypeChecker = Program.getTypeChecker();
        const TargetGenericSymbol = ResolveExportedSymbolFromModule({
            ExportName: GenericType.Name,
            ModuleFilePath: GenericModuleFilePath,
            Program,
            TypeChecker
        });
        const GetCanonicalFileName = CreateCanonicalFileNameFunction();
        const ProjectFileNames = new Set(ParsedTypeScriptConfig.fileNames.map(GetCanonicalFileName));
        const Results = [];
        const SeenResults = new Set();
        for (const SourceFile of Program.getSourceFiles()) {
            if (!ProjectFileNames.has(GetCanonicalFileName(SourceFile.fileName))) {
                continue;
            }
            const ModuleSymbol = TypeChecker.getSymbolAtLocation(SourceFile);
            if (ModuleSymbol === undefined) {
                continue;
            }
            const ExportedSymbols = TypeChecker.getExportsOfModule(ModuleSymbol);
            for (const ExportedSymbol of ExportedSymbols) {
                const ExportName = ExportedSymbol.getName();
                const ResolvedExportedSymbol = ResolveAliasedSymbol(TypeChecker, ExportedSymbol);
                if (!IsTypeLikeExportUsingGenericType(TypeChecker, ResolvedExportedSymbol, TargetGenericSymbol)) {
                    continue;
                }
                const AbsoluteModulePath = Path.resolve(SourceFile.fileName);
                const ResultKey = `${AbsoluteModulePath}\0${ExportName}`;
                if (SeenResults.has(ResultKey)) {
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
function ReadTypeScriptConfig(AbsoluteTypeScriptConfigFilePath) {
    const ReadResult = TypeScript.readConfigFile(AbsoluteTypeScriptConfigFilePath, TypeScript.sys.readFile);
    if (ReadResult.error !== undefined) {
        throw new Error(FormatDiagnostics([ReadResult.error]));
    }
    const ParsedResult = TypeScript.parseJsonConfigFileContent(ReadResult.config, TypeScript.sys, Path.dirname(AbsoluteTypeScriptConfigFilePath), undefined, AbsoluteTypeScriptConfigFilePath);
    if (ParsedResult.errors.length > 0) {
        throw new Error(FormatDiagnostics(ParsedResult.errors));
    }
    return ParsedResult;
}
function ResolveGenericModuleFilePath(ImportPath, TypeScriptConfigDirectoryPath, CompilerOptions) {
    const ContainingFilePath = Path.join(TypeScriptConfigDirectoryPath, "__generic_type_probe__.ts");
    const ResolutionResult = TypeScript.resolveModuleName(ImportPath, ContainingFilePath, CompilerOptions, TypeScript.sys);
    const ResolvedModule = ResolutionResult.resolvedModule;
    if (ResolvedModule === undefined) {
        throw new Error(`Could not resolve module "${ImportPath}".`);
    }
    return Path.resolve(ResolvedModule.resolvedFileName);
}
function ResolveExportedSymbolFromModule(Options) {
    const SourceFile = Options.Program.getSourceFile(Options.ModuleFilePath);
    if (SourceFile === undefined) {
        throw new Error(`Resolved module was not included in the TypeScript program: ${Options.ModuleFilePath}`);
    }
    const ModuleSymbol = Options.TypeChecker.getSymbolAtLocation(SourceFile);
    if (ModuleSymbol === undefined) {
        throw new Error(`Resolved module has no module symbol: ${Options.ModuleFilePath}`);
    }
    const ExportedSymbol = Options.TypeChecker
        .getExportsOfModule(ModuleSymbol)
        .find((SymbolValue) => SymbolValue.getName() === Options.ExportName);
    if (ExportedSymbol === undefined) {
        throw new Error(`Module "${Options.ModuleFilePath}" does not export "${Options.ExportName}".`);
    }
    return ResolveAliasedSymbol(Options.TypeChecker, ExportedSymbol);
}
function IsTypeLikeExportUsingGenericType(TypeChecker, ExportedSymbol, TargetGenericSymbol) {
    const Declarations = ExportedSymbol.getDeclarations() ?? [];
    return Declarations.some((Declaration) => {
        if (!IsTypeLikeDeclaration(Declaration)) {
            return false;
        }
        return DoesNodeReferenceGenericType(TypeChecker, Declaration, TargetGenericSymbol, new Set());
    });
}
function IsTypeLikeDeclaration(Declaration) {
    return (TypeScript.isTypeAliasDeclaration(Declaration) ||
        TypeScript.isInterfaceDeclaration(Declaration) ||
        TypeScript.isClassDeclaration(Declaration));
}
function DoesNodeReferenceGenericType(TypeChecker, Node, TargetGenericSymbol, SeenSymbols) {
    if (TypeScript.isTypeReferenceNode(Node)) {
        const ReferencedSymbol = TypeChecker.getSymbolAtLocation(Node.typeName);
        if (ReferencedSymbol !== undefined
            && DoesSymbolReferenceGenericType(TypeChecker, ReferencedSymbol, TargetGenericSymbol, SeenSymbols)) {
            return true;
        }
    }
    if (TypeScript.isExpressionWithTypeArguments(Node)) {
        const ReferencedSymbol = TypeChecker.getSymbolAtLocation(Node.expression);
        if (ReferencedSymbol !== undefined
            && DoesSymbolReferenceGenericType(TypeChecker, ReferencedSymbol, TargetGenericSymbol, SeenSymbols)) {
            return true;
        }
    }
    if (TypeScript.isImportTypeNode(Node) && Node.qualifier !== undefined) {
        const ReferencedSymbol = TypeChecker.getSymbolAtLocation(Node.qualifier);
        if (ReferencedSymbol !== undefined
            && DoesSymbolReferenceGenericType(TypeChecker, ReferencedSymbol, TargetGenericSymbol, SeenSymbols)) {
            return true;
        }
    }
    return TypeScript.forEachChild(Node, (Child) => DoesNodeReferenceGenericType(TypeChecker, Child, TargetGenericSymbol, SeenSymbols)) === true;
}
function DoesSymbolReferenceGenericType(TypeChecker, SymbolValue, TargetGenericSymbol, SeenSymbols) {
    const ResolvedSymbol = ResolveAliasedSymbol(TypeChecker, SymbolValue);
    if (ResolvedSymbol === TargetGenericSymbol) {
        return true;
    }
    if (SeenSymbols.has(ResolvedSymbol)) {
        return false;
    }
    SeenSymbols.add(ResolvedSymbol);
    const Declarations = ResolvedSymbol.getDeclarations() ?? [];
    return Declarations.some((Declaration) => {
        if (!IsTypeLikeDeclaration(Declaration)) {
            return false;
        }
        return DoesNodeReferenceGenericType(TypeChecker, Declaration, TargetGenericSymbol, SeenSymbols);
    });
}
function ResolveAliasedSymbol(TypeChecker, SymbolValue) {
    if ((SymbolValue.flags & TypeScript.SymbolFlags.Alias) === 0) {
        return SymbolValue;
    }
    return TypeChecker.getAliasedSymbol(SymbolValue);
}
function CreateCanonicalFileNameFunction() {
    const CanonicalizeCasing = TypeScript.sys.useCaseSensitiveFileNames
        ? (FileName) => FileName
        : (FileName) => FileName.toLowerCase();
    return (FileName) => CanonicalizeCasing(Path.resolve(FileName));
}
function FormatDiagnostics(Diagnostics) {
    const FormatHost = {
        getCanonicalFileName: (FileName) => FileName,
        getCurrentDirectory: () => TypeScript.sys.getCurrentDirectory(),
        getNewLine: () => TypeScript.sys.newLine
    };
    return TypeScript.formatDiagnosticsWithColorAndContext([...Diagnostics], FormatHost);
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
export function GetImportSpecifiersForModules(TypeScriptConfigFilePath, OutPath, Modules) {
    const AbsoluteTypeScriptConfigFilePath = Path.resolve(TypeScriptConfigFilePath);
    const TypeScriptConfigDirectoryPath = Path.dirname(AbsoluteTypeScriptConfigFilePath);
    const ParsedTypeScriptConfig = ReadTypeScriptConfig(AbsoluteTypeScriptConfigFilePath);
    const AbsoluteOutPath = Path.isAbsolute(OutPath)
        ? Path.normalize(OutPath)
        : Path.resolve(TypeScriptConfigDirectoryPath, OutPath);
    const OutDirectoryPath = Path.dirname(AbsoluteOutPath);
    return Modules.map((ModulePath) => {
        if (!Path.isAbsolute(ModulePath)) {
            throw new Error(`Expected an absolute module path, but received "${ModulePath}".`);
        }
        const AbsoluteModulePath = Path.normalize(ModulePath);
        const ImportTargetPath = GetImportTargetPath(AbsoluteModulePath, ParsedTypeScriptConfig.options);
        const RelativePath = Path.relative(OutDirectoryPath, ImportTargetPath);
        const NormalizedRelativePath = NormalizePathForModuleSpecifier(RelativePath);
        if (NormalizedRelativePath.startsWith("../")
            || NormalizedRelativePath === ".."
            || NormalizedRelativePath.startsWith("./")
            || NormalizedRelativePath === ".") {
            return NormalizedRelativePath;
        }
        return `./${NormalizedRelativePath}`;
    });
}
function GetImportTargetPath(AbsoluteModulePath, CompilerOptions) {
    const TypeScriptExtension = GetTypeScriptModuleExtension(AbsoluteModulePath);
    if (TypeScriptExtension === undefined) {
        return RemoveLastExtension(AbsoluteModulePath);
    }
    const PathWithoutTypeScriptExtension = RemoveTypeScriptModuleExtension(AbsoluteModulePath, TypeScriptExtension);
    if (ShouldUseTypeScriptExtensionInImportSpecifier(CompilerOptions)) {
        return `${PathWithoutTypeScriptExtension}${TypeScriptExtension}`;
    }
    if (ShouldUseJavaScriptExtensionInImportSpecifier(CompilerOptions)) {
        return (PathWithoutTypeScriptExtension +
            GetJavaScriptExtensionForTypeScriptExtension(TypeScriptExtension));
    }
    return PathWithoutTypeScriptExtension;
}
function ShouldUseTypeScriptExtensionInImportSpecifier(CompilerOptions) {
    return (CompilerOptions.allowImportingTsExtensions === true &&
        (CompilerOptions.noEmit === true ||
            CompilerOptions.emitDeclarationOnly === true ||
            CompilerOptions.rewriteRelativeImportExtensions === true));
}
function ShouldUseJavaScriptExtensionInImportSpecifier(CompilerOptions) {
    const ModuleResolutionKind = GetEffectiveModuleResolutionKind(CompilerOptions);
    return (ModuleResolutionKind === TypeScript.ModuleResolutionKind.Node16 ||
        ModuleResolutionKind === TypeScript.ModuleResolutionKind.NodeNext);
}
function GetEffectiveModuleResolutionKind(CompilerOptions) {
    if (CompilerOptions.moduleResolution !== undefined) {
        return CompilerOptions.moduleResolution;
    }
    if (CompilerOptions.module === TypeScript.ModuleKind.Node16) {
        return TypeScript.ModuleResolutionKind.Node16;
    }
    if (CompilerOptions.module === TypeScript.ModuleKind.NodeNext) {
        return TypeScript.ModuleResolutionKind.NodeNext;
    }
    return undefined;
}
function GetTypeScriptModuleExtension(FilePath) {
    const FilePathLowerCase = FilePath.toLowerCase();
    if (FilePathLowerCase.endsWith(".d.mts")) {
        return ".mts";
    }
    if (FilePathLowerCase.endsWith(".d.cts")) {
        return ".cts";
    }
    if (FilePathLowerCase.endsWith(".d.ts")) {
        return ".ts";
    }
    if (FilePathLowerCase.endsWith(".mts")) {
        return ".mts";
    }
    if (FilePathLowerCase.endsWith(".cts")) {
        return ".cts";
    }
    if (FilePathLowerCase.endsWith(".tsx")) {
        return ".tsx";
    }
    if (FilePathLowerCase.endsWith(".ts")) {
        return ".ts";
    }
    if (FilePathLowerCase.endsWith(".jsx")) {
        return ".jsx";
    }
    if (FilePathLowerCase.endsWith(".js")) {
        return ".js";
    }
    return undefined;
}
function RemoveTypeScriptModuleExtension(FilePath, Extension) {
    const FilePathLowerCase = FilePath.toLowerCase();
    if (Extension === ".mts" && FilePathLowerCase.endsWith(".d.mts")) {
        return FilePath.slice(0, -".d.mts".length);
    }
    if (Extension === ".cts" && FilePathLowerCase.endsWith(".d.cts")) {
        return FilePath.slice(0, -".d.cts".length);
    }
    if (Extension === ".ts" && FilePathLowerCase.endsWith(".d.ts")) {
        return FilePath.slice(0, -".d.ts".length);
    }
    return FilePath.slice(0, -Extension.length);
}
function GetJavaScriptExtensionForTypeScriptExtension(Extension) {
    switch (Extension) {
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
function RemoveLastExtension(FilePath) {
    const Extension = Path.extname(FilePath);
    if (Extension === "") {
        return FilePath;
    }
    return FilePath.slice(0, -Extension.length);
}
function NormalizePathForModuleSpecifier(FilePath) {
    const NormalizedPath = FilePath.split(Path.sep).join("/");
    if (NormalizedPath === "") {
        return ".";
    }
    return NormalizedPath;
}
export const MapRecordEntriesEffect = (RecordValue, Function) => {
    const Entries = Object.entries(RecordValue);
    const Wrapper = ([Value, Key], _Index) => {
        return Function(Value, Key);
    };
    return pipe(Effect.forEach(Entries, Wrapper), Effect.map(Object.fromEntries));
};
//# sourceMappingURL=Generate.Internal.js.map