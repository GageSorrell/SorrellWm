/* File:      Build.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import * as Fs from "fs";
import * as Path from "path";
import { GetMonorepoPath, GetRef, InsertLine, Run, type TRef } from "ScriptUtility";
import type { FRegisteredFunction, FFlag, FFunctionArgument, FFlagKey, FSimpleFlagKey, FComplexFlagKey, FComplexFlag } from "./index.Types.js";
import { compileFunction } from "vm";
import { register } from "module";
import { resolveObjectURL } from "buffer";

/* Comment: This file uses the following naming convention for C++ files:
 *    * `Source` files end in `.cpp`
 *    * `Header` files end in `.h`
 *    * **`Cpp` files refer to either**
 */

const MacroName: string = "DECLARE_NAPI_FUNCTION";
const MacroSimpleFlagKeys: Readonly<Array<FSimpleFlagKey>> =
[
    "Hook",
    "Renderer"
] as const;

const MacroComplexFlagKeys: Readonly<Array<FComplexFlagKey>> =
[
    "ExportName"
] as const;

const MacroFlagKeys: Readonly<Array<FFlagKey>> =
[
    "ExportName",
    "Hook",
    "Renderer"
] as const;

const GetArgumentVector = (RegisteredFunction: FRegisteredFunction): string =>
{
    let OutString = "";
    RegisteredFunction.Arguments.forEach((Argument: FFunctionArgument, Index: number): void =>
    {
        const ArgumentFormatted: string = `${ Argument.Name }: ${ Argument.Type }`;
        OutString += ArgumentFormatted;
        if (Index !== RegisteredFunction.Arguments.length - 1)
        {
            OutString += ", ";
        }
    });

    return OutString;
};

const GetExportName = (RegisteredFunction: FRegisteredFunction): string =>
{
    const ExportedNameRef: TRef<string> = GetRef<string>();
    const HasCustomExportedName: boolean = GetFlagByName(RegisteredFunction, "ExportName", ExportedNameRef);
    if (HasCustomExportedName)
    {
        return ExportedNameRef.Current as string;
    }
    else
    {
        return RegisteredFunction.Name;
    }
};


const GetFlagByName = (RegisteredFunction: FRegisteredFunction, FlagKey: FFlagKey, ValueRef: TRef<string>): boolean =>
{
    const FlagInstance: FFlag | undefined = RegisteredFunction.Flags.find((Flag: FFlag): boolean =>
    {
        return Flag.Name === FlagKey;
    });

    if (FlagInstance !== undefined)
    {
        if (ValueRef !== undefined)
        {
            const IsComplexFlag: boolean = MacroComplexFlagKeys.includes(FlagKey as FComplexFlagKey);
            if (IsComplexFlag)
            {
                ValueRef.Current = (FlagInstance as FComplexFlag).Value;
            }
        }

        return true;
    }
    else
    {
        return false;
    }
};

const HasFlag = (MacroArgumentVector: Array<string>, FlagKey: FFlagKey, ValueRef?: TRef<string>): boolean =>
{
    const FlagInstance: string | undefined = MacroArgumentVector.find((MacroArgument: string): boolean =>
    {
        return MacroArgument.startsWith(FlagKey);
    });

    if (FlagInstance !== undefined)
    {
        if (ValueRef !== undefined)
        {
            const IsComplexFlag: boolean = MacroComplexFlagKeys.includes(FlagKey as FComplexFlagKey);
            if (IsComplexFlag)
            {
                const Sep: "=" = "=";
                const FlagValue: string = FlagInstance.slice(FlagInstance.indexOf(Sep) + 1);

                ValueRef.Current = FlagValue;
            }
        }

        return true;
    }
    else
    {
        return false;
    }
};

const FindAllIndices = (String: string, Substring: string): Array<number> =>
{
    const OutArray: Array<number> = [ ];

    while (true)
    {
        const PreviousIndex: number = OutArray.length > 0 ? OutArray[OutArray.length - 1] : 0;
        const Index: number = String.indexOf(Substring, PreviousIndex + 1);
        if (Index !== -1)
        {
            OutArray.push(Index);
        }
        else
        {
            break;
        }
    }

    return OutArray;
};

const FindFirstCapitalAfterIndex = (Input: string, StartIndex: number): number =>
{
    for (let Index: number = StartIndex; Index < Input.length - 1; Index++)
    {
        if (Input[Index] === " " && /^[A-Z]$/.test(Input[Index + 1]))
        {
            return Index + 1;
        }
    }
    return -1;
};

const GetCppFiles = async (): Promise<Array<string>> =>
{
    const SourcePath: string = Path.resolve(GetMonorepoPath(), "Application", "Windows");
    return (await Fs.promises.readdir(SourcePath, { recursive: true }))
        .filter((FilePath: string): boolean =>
        {
            return (
                FilePath.endsWith(".cpp") ||
                FilePath.endsWith(".h")
            ) &&
            /* This is the header in which the macro is defined. */
            !FilePath.endsWith("Typedefs.h");
        })
        .map((RelativeFilePath: string): string =>
        {
            return Path.resolve(SourcePath, RelativeFilePath);
        });
};

const Main = async (): Promise<void> =>
{
    const CppFiles: Array<string> = await GetCppFiles();
    // 2. Across all header files, find all macro calls that register functions
    const RegisteredFunctions: Array<FRegisteredFunction> = [ ];
    for await (const FilePath of CppFiles)
    {
        const Contents: string = await Fs.promises.readFile(FilePath, { encoding: "utf-8" });
        const MacroCallIndices: Array<number> = FindAllIndices(Contents, MacroName);
        for await (const MacroCallIndex of MacroCallIndices)
        {
            const MacroArgumentVectorStartIndex: number = Contents.indexOf("(", MacroCallIndex) + 1;
            const MacroArgumentVectorEndIndex: number = Contents.indexOf(")", MacroArgumentVectorStartIndex);
            const MacroArgumentVectorString: string = Contents.substring(MacroArgumentVectorStartIndex, MacroArgumentVectorEndIndex);
            const MacroArgumentVector: Array<string> = MacroArgumentVectorString.split(",").map((Argument: string): string =>
            {
                return Argument.trim();
            });
            const Name: string = MacroArgumentVector[0];
            const ReturnType: string = MacroArgumentVector[1];
            const Flags: Array<FFlag> = MacroFlagKeys.map((MacroFlag: FFlagKey): FFlag =>
            {
                const FlagValueRef: TRef<string> = GetRef<string>();
                if (HasFlag(MacroArgumentVector, MacroFlag, FlagValueRef))
                {
                    return {
                        Name: MacroFlag,
                        Value: FlagValueRef.Current as string
                    };
                }
                else
                {
                    return {
                        Name: (MacroFlag as FSimpleFlagKey)
                    };
                }
            });

            const Arguments: Array<FFunctionArgument> = [ ];
            const LastFlagIndex: number = ((): number =>
            {
                const Indices: Array<number> = Flags.map((Flag: FFlag): number =>
                {
                    return MacroArgumentVector.indexOf(Flag.Name);
                });

                return Math.max(...Indices);
            })();
            const FunctionArgumentVector: Array<string> = [ ];
            if (MacroArgumentVector.length > LastFlagIndex)
            {
                FunctionArgumentVector.push(...MacroArgumentVector.slice(LastFlagIndex + 1));
            }
            FunctionArgumentVector.forEach((FunctionArgumentPart: string, Index: number): void =>
            {
                if (Index % 2 === 1)
                {
                    return;
                }

                const Name: string = FunctionArgumentPart;
                const Type: string = FunctionArgumentVector[Index + 1];

                Arguments.push({
                    Name,
                    Type
                });
            });

            RegisteredFunctions.push({
                Name,
                FilePath,
                ReturnType,
                Arguments,
                Flags
            });
        }
    }

    // 3a. Add include statement to Initialization.cpp, if not already present
    const InitializationFilePath: string = Path.resolve(
        GetMonorepoPath(),
        "Application",
        "Windows",
        "Initialization.cpp"
    );
    const InitializationSourceFile: Array<string> = (await Fs.promises.readFile(InitializationFilePath, { encoding: "utf-8" })).split("\n");
    const IncludesRegionBeginComment: string = "/* BEGIN AUTO-GENERATED REGION: INCLUDES. */"
    const ExportsRegionBeginComment: string = "/* BEGIN AUTO-GENERATED REGION: EXPORTS. */"
    const IncludesRegionStartIndex: number = InitializationSourceFile.indexOf(IncludesRegionBeginComment) + 1;
    const ExportsRegionStartIndex: number = InitializationSourceFile.indexOf(ExportsRegionBeginComment) + 1;
    const GetIncludeStatement = (RegisteredFunction: FRegisteredFunction): string =>
    {
        const IncludePath: string = RegisteredFunction.FilePath
            .split(Path.sep)
            .slice(RegisteredFunction.FilePath.indexOf("Windows") + 1)
            .join("/");

        return `#include "${ IncludePath }"`;
    };

    for await (const RegisteredFunction of RegisteredFunctions)
    {
        const IncludeStatement: string = GetIncludeStatement(RegisteredFunction);
        if (!InitializationSourceFile.includes(IncludeStatement))
        {
            InitializationSourceFile.splice(IncludesRegionStartIndex, 0, IncludeStatement);
        }

        const ExportName: string = GetExportName(RegisteredFunction);
        const ExportStatement: string = `{ "${ RegisteredFunction.Name }", "${ ExportName }" }`;
        if (!InitializationSourceFile.includes(ExportStatement))
        {
            InitializationSourceFile.splice(ExportsRegionStartIndex, 0, ExportStatement);
        }
    }

    // 4. Generate `index.d.ts`
    const Declarations: Array<string> = RegisteredFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
    {
        const ExportName: string = GetExportName(RegisteredFunction);
        const ArgumentVector: string = GetArgumentVector(RegisteredFunction);
        return `export function ${ ExportName }(${ ArgumentVector }): ${ RegisteredFunction.ReturnType }`;
    });

    const GeneratedTypesFileHeader: string = `/* File:      GeneratedTypes.d.ts\n * Author:    Gage Sorrell <gage@sorrell.sh>\n * Copyright: (c) 2024 Gage Sorrell\n * License:   MIT\n */\n\n/* AUTO-GENERATED FILE. */\n`;
    const GeneratedTypesFileContents: string = GeneratedTypesFileHeader + Declarations.join("\n");
    const GeneratedTypesFilePath: string = Path.resolve(GetMonorepoPath(), "Application", "Windows", "GeneratedTypes.d.ts");

    await Fs.promises.writeFile(GeneratedTypesFilePath, GeneratedTypesFileContents);

    // 5. For functions marked `Renderer`, generate IPC code for main to receive request from renderer
    // 6. For functions marked `Renderer` *and* `Hook`, Generate React hook for functions
};

Run(Main, "Build", "Builds SorrellWm.");
