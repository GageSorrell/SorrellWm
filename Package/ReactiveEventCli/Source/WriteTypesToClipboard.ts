/**
 * @file      WriteTypesToClipboard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable */

import clipboard from "clipboardy";
import { resolve } from "path";
import ts, { type DeclarationWithTypeParameters, type TypeParameterDeclaration } from "typescript";

// function GetExportedTypeNames(PackageEntryDeclarationPath: string): Array<string>
// {
//     const Program = ts.createProgram([ PackageEntryDeclarationPath ], {});
//     const TypeChecker = Program.getTypeChecker();
//     const SourceFile = Program.getSourceFile(PackageEntryDeclarationPath);

//     if (!SourceFile)
//     {
//         return [];
//     }

//     const ModuleSymbol =
//         TypeChecker.getSymbolAtLocation(SourceFile) ??
//         (SourceFile as unknown as { symbol?: ts.Symbol }).symbol;

//     if (!ModuleSymbol)
//     {
//         return [];
//     }

//     const ExportedSymbols = TypeChecker.getExportsOfModule(ModuleSymbol);

//     return ExportedSymbols
//         .filter((Symbol) =>
//         {
//             const Flags = Symbol.getFlags();

//             return Boolean(
//                 Flags & ts.SymbolFlags.TypeAlias ||
//                 Flags & ts.SymbolFlags.Interface ||
//                 Flags & ts.SymbolFlags.Class ||
//                 Flags & ts.SymbolFlags.Enum ||
//                 Flags & ts.SymbolFlags.TypeParameter ||
//                 Flags & ts.SymbolFlags.NamespaceModule
//             );
//         })
//         .map((Symbol) => Symbol.getName())
//         .sort();
// }

type ExportedTypeDeclaration =
    | ts.ClassDeclaration
    | ts.InterfaceDeclaration
    | ts.TypeAliasDeclaration
    | ts.EnumDeclaration
    | ts.NamespaceDeclaration;

type TypesRecord = Record<"Scoped" | "Unscoped", Array<string>>;

function GetExportedTypeNamesWithTypeParameterVectors(
    PackageEntryDeclarationPath: string
): TypesRecord
{
    const Program = ts.createProgram([PackageEntryDeclarationPath], {});
    const TypeChecker = Program.getTypeChecker();
    const SourceFile = Program.getSourceFile(PackageEntryDeclarationPath);

    const EmptyRecord: TypesRecord =
        {
            Scoped: [ ],
            Unscoped: [ ]
        }

    if (!SourceFile)
    {
        return EmptyRecord;
    }

    const ModuleSymbol =
        TypeChecker.getSymbolAtLocation(SourceFile) ??
        (SourceFile as typeof SourceFile & { symbol?: ts.Symbol }).symbol;

    if (!ModuleSymbol)
    {
        return EmptyRecord;
    }

    const ScopedResults = new Set<string>();
    const UnscopedResults = new Set<string>();

    for (const ExportedSymbol of TypeChecker.getExportsOfModule(ModuleSymbol))
    {
        const ResolvedSymbol: ts.Symbol =
            ExportedSymbol.getFlags() & ts.SymbolFlags.Alias
                ? TypeChecker.getAliasedSymbol(ExportedSymbol)
                : ExportedSymbol;

        const Declaration = GetExportedTypeDeclaration(ResolvedSymbol);

        if (!Declaration)
        {
            continue;
        }

        const ToString = (TypeParameter: TypeParameterDeclaration): string =>
        {
            if (TypeParameter.constraint !== undefined)
            {
                return `${ TypeParameter.name.getText() } extends ${ TypeParameter.constraint.getText() }`;
            }
            else
            {
                return TypeParameter.name.getText()
            }
        };

        const TypeParameters = ts.getEffectiveTypeParameterDeclarations(Declaration as DeclarationWithTypeParameters);

        const IsScopedType: boolean = TypeParameters.some((TypeParameter: TypeParameterDeclaration) => TypeParameter.name.getText() === "PackageKey");

        const TypeParameterNames: Array<string> = TypeParameters
            .filter((TypeParameter: TypeParameterDeclaration): boolean =>
            {
                return TypeParameter.name.getText() !== "PackageKey";
            })
            .map(ToString);

        const TypeParameterVector =
            TypeParameterNames.length === 0
                ? ""
                : `<${TypeParameterNames.join(", ")}>`;


        if (IsScopedType)
        {
            ScopedResults.add(`${ResolvedSymbol.getName()}${TypeParameterVector};`);
        }
        else
        {
            UnscopedResults.add(`${ResolvedSymbol.getName()}${TypeParameterVector};`);
        }
    }

    const ToArray = (In: Set<string>): Array<string> => Array.from(In).sort();
    const Trim = (Type: string) => Type.replaceAll(";", "");
    return {
        Scoped: ToArray(ScopedResults).map(Trim),
        Unscoped: ToArray(UnscopedResults).map(Trim)
    };
}

function GetExportedTypeDeclaration(
    Symbol: ts.Symbol
): ExportedTypeDeclaration | undefined
{
    const Declarations = Symbol.getDeclarations() ?? [ ];

    return Declarations.find(
        (Declaration): Declaration is ExportedTypeDeclaration =>
            ts.isClassDeclaration(Declaration) ||
            ts.isInterfaceDeclaration(Declaration) ||
            ts.isTypeAliasDeclaration(Declaration) ||
            ts.isEnumDeclaration(Declaration) ||
            ts.isNamespaceExport(Declaration)
    );
}


// function GetOutput(): string
// {
//     const Types: TypesRecord = GetExportedTypeNamesWithTypeParameterVectors(resolve("..", "ReactiveEvent", "Source", "index.Scoped.ts"));
//     Out.push(...Types.Scoped.map((Type: string): string =>
//     {
//         Type = Type.replaceAll(";", "");
//         const Name: string = Type.includes("<")
//             ? Type.slice(0, Type.indexOf("<"))
//             : Type;

//         const TypeArgumentVector: string | undefined = ((): string | undefined =>
//         {
//             if (!Type.includes("<"))
//             {
//                 return undefined;
//             }

//             const Input: string =
//                 Type.slice(Type.indexOf("<") + 1, Type.indexOf(">"))

//             const Matches: Array<string> = [ ];
//             const Pattern: RegExp = /(?:^|,)\s*([^,\s]+)/g;

//             let Match: RegExpExecArray | null;

//             while ((Match = Pattern.exec(Input)) !== null)
//             {
//                 Matches.push(Match[1] as string);
//             }

//             return Matches.join(", ");
//         })();

//         return `${ Name }: \"export type ${ Type } = ${ Name }Imported<${ TypeArgumentVector }>;\"`;
//     }));

//     Out.push("// UNSCOPED");

//     Out.push(...Types.Unscoped.map((Type: string): string =>
//     {
//         Type = Type.replaceAll(";", "");
//         const Name: string = Type.includes("<")
//             ? Type.slice(0, Type.indexOf("<"))
//             : Type;

//         return Name;
//     }));

//     return Out.join("\n");
// }

// const Out: string = GetOutput();

clipboard.writeSync(JSON.stringify(GetExportedTypeNamesWithTypeParameterVectors(resolve("..", "ReactiveEvent", "Source", "index.Scoped.ts")), null, 4));
console.log("Wrote to the clipboard!");

// const OutOld: Array<string> = Types.map((Type: string): string =>
// {
//     const IpcMainKeys: Array<string> =
//     [
//         "addListener",
//         "handle",
//         "handleOnce",
//         "off",
//         "on",
//         "once",
//         "removeAllListeners",
//         "removeHandler",
//         "removeListener"
//     ];

//     const ShouldRedefine: boolean = (
//         Type.includes("PackageKey") ||
//         IpcMainKeys.map(Key => Key.toLowerCase()).some(Key => Type.toLowerCase().startsWith(Key)) ||
//         Type.toLowerCase().startsWith("use")
//     );
//     if (ShouldRedefine)
//     {
//         const TypeName: string = Type.slice(0, Type.indexOf("<"));
//         if (Type.indexOf(",") !== Type.lastIndexOf(","))
//         {
//             const TypeParameterVector: string = Type.slice(Type.indexOf("<"), Type.indexOf(">")).replace("PackageKey, ", "");
//             const StringDelimiter: string = Type.includes("PackageKey")
//                 ? "`"
//                 : "\"";

//             const Almost: string = (
//                 TypeName +
//                 `: ${ StringDelimiter }export type ${ TypeName }${ TypeParameterVector }> = ` +
//                 Type.replace(TypeName, `${ TypeName }Imported`).replace("PackageKey", "${ PackageKey }") +
//                 `${ StringDelimiter },`
//             );

//             const Out: string = Almost.replace("OwnerType", "OwnerType extends EventOwner")

//             return Out;
//         }
//         else
//         {
//             if (Type.includes("PackageKey"))
//             {
//                 const TypeNameBase: string = Type.replace(";", "");
//                 const TypeName: string = TypeNameBase.slice(0, TypeNameBase.indexOf("<"));
//                 return `${ TypeName }: \`export type ${ TypeName } = ${ TypeName }Imported<\${ PackageKey }>;\`,`;
//             }
//             else
//             {
//                 const TypeNameBase: string = Type.replace(";", "");
//                 const Out: string = TypeNameBase.includes("<")
//                     ? TypeNameBase.slice(TypeNameBase.indexOf("<"), TypeNameBase.indexOf(">"))
//                     : TypeNameBase;
//                 return `${ Out }: ReexportedType,`;
//             }
//         }
//     }
//     else
//     {
//         const TypeNameBase: string = Type.replace(";", "");
//         const TypeName: string = TypeNameBase + Type.includes("<")
//             ? Type.slice(0, Type.indexOf("<"))
//             : "";
//         return `${ TypeName }: ReexportedType,`;
//     }
// });

// clipboard.writeSync(OutOld.join("\n"));

// // const OldTypesArray: Array<string> = Object.keys(OldTypes);
// // const NewTypes: Array<string> = Types.map(Type => Type.toLowerCase());
// // const New: Array<string> = OldTypesArray.filter(Type => !NewTypes.some(NewType => NewType.includes(Type.toLowerCase())));

// // clipboard.writeSync(New.join("\n"));
// console.log(`✔️  Wrote ${ Out.length } types to the clipboard.`);
