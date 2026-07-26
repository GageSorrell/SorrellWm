/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Documentation/PropInspector
 *
 * @file      PropInspector.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** Extract prop documentation directly from the library's TypeScript source. */

import * as FileSystem from "node:fs";
import * as Path from "node:path";
import * as TypeScript from "typescript";
import type { StorySource } from "../Story.js";
import { fileURLToPath } from "node:url";

export interface PropDocumentation
{
    readonly DefaultValue?: string;
    readonly Description: string;
    readonly Name: string;
    readonly Required: boolean;
    readonly Type: string;
}

const Cache = new Map<string, ReadonlyArray<PropDocumentation>>();
const PackageRoot = ResolvePackageRoot();
let Program: TypeScript.Program | undefined;

export const InspectProps = (Definition: StorySource): ReadonlyArray<PropDocumentation> =>
{
    const Key = `${ Definition.Path }#${ Definition.Props }`;
    const Cached = Cache.get(Key);
    if (Cached !== undefined)
    {
        return Cached;
    }

    try
    {
        const File = Path.resolve(PackageRoot, "Source", Definition.Path);
        const DocumentationProgram = GetProgram();
        const Source = DocumentationProgram.getSourceFile(File);
        if (Source === undefined)
        {
            return [ ];
        }
        const Checker = DocumentationProgram.getTypeChecker();
        const Defaults = FindDefaults(Source, Definition.Component);
        let Declaration: TypeScript.InterfaceDeclaration | TypeScript.TypeAliasDeclaration
            | undefined;
        for (const Statement of Source.statements)
        {
            if ((TypeScript.isInterfaceDeclaration(Statement)
                    || TypeScript.isTypeAliasDeclaration(Statement))
                && Statement.name.text === Definition.Props)
            {
                Declaration = Statement;
                break;
            }
        }
        if (Declaration === undefined)
        {
            return [ ];
        }
        const PropsType = Checker.getTypeAtLocation(Declaration);
        const Result = Checker
            .getPropertiesOfType(PropsType)
            .map((Property: TypeScript.Symbol): PropDocumentation =>
            {
                const Name = Property.getName();
                const DefaultValue = Defaults.get(Name);
                const PropertyDeclaration = Property.valueDeclaration ?? Property.declarations?.[0];
                const PropertyType = PropertyDeclaration === undefined
                    ? undefined
                    : Checker.getTypeOfSymbolAtLocation(Property, PropertyDeclaration);
                const Description = TypeScript.displayPartsToString(
                    Property.getDocumentationComment(Checker)
                );
                return {
                    ...(DefaultValue === undefined ? { } : { DefaultValue }),
                    Description,
                    Name,
                    Required: (Property.flags & TypeScript.SymbolFlags.Optional) === 0
                    && DefaultValue === undefined,
                    Type: PropertyType === undefined
                        ? "unknown"
                        : Checker.typeToString(PropertyType, PropertyDeclaration)
                };
            });
        Cache.set(Key, Result);
        return Result;
    }
    catch
    {
        return [ ];
    }
}

function GetProgram(): TypeScript.Program
{
    if (Program === undefined)
    {
        const ConfigPath = Path.resolve(PackageRoot, "tsconfig.json");
        const Config = TypeScript.readConfigFile(ConfigPath, TypeScript.sys.readFile);
        const Parsed = TypeScript.parseJsonConfigFileContent(
            Config.config,
            TypeScript.sys,
            PackageRoot
        );
        Program = TypeScript.createProgram(Parsed.fileNames, {
            ...Parsed.options,
            noEmit: true
        });
    }
    return Program;
}

function ResolvePackageRoot(): string
{
    const WorkingDirectory = process.cwd();
    if (FileSystem.existsSync(Path.join(WorkingDirectory, "Source"))
        && FileSystem.existsSync(Path.join(WorkingDirectory, "tsconfig.json")))
    {
        return WorkingDirectory;
    }
    return Path.resolve(Path.dirname(fileURLToPath(import.meta.url)), "../../../..");
}

function FindDefaults(Source: TypeScript.SourceFile, Component: string): ReadonlyMap<string, string>
{
    const Result = new Map<string, string>();
    const Visit = (Node: TypeScript.Node): void =>
    {
        if (TypeScript.isBindingElement(Node)
            && TypeScript.isIdentifier(Node.name)
            && Node.initializer !== undefined)
        {
            Result.set(Node.name.text, Node.initializer.getText(Source));
        }
        TypeScript.forEachChild(Node, Visit);
    };
    const ComponentStatement = Source.statements.find((Statement: TypeScript.Statement) =>
        (TypeScript.isFunctionDeclaration(Statement) && Statement.name?.text === Component)
        || (TypeScript.isVariableStatement(Statement)
            && Statement.declarationList.declarations.some((Declaration: TypeScript.VariableDeclaration) =>
                TypeScript.isIdentifier(Declaration.name) && Declaration.name.text === Component))
    );
    if (ComponentStatement !== undefined)
    {
        Visit(ComponentStatement);
    }
    return Result;
}
