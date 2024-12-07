/* File:      Build.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import * as Fs from "fs";
import * as Path from "path";
import type {
    FComplexFlag,
    FComplexFlagKey,
    FFlag,
    FFlagKey,
    FFunctionArgument,
    FRegisteredFunction,
    FSimpleFlagKey } from "./index.Types.js";
import { GetMonorepoPath, GetRef, Run, type TRef } from "ScriptUtility";
import { register } from "module";

/* Comment: This file uses the following naming convention for C++ files:
 *    * `Source` files end in `.cpp`
 *    * `Header` files end in `.h`
 *    * **`Cpp` files refer to either**
 */

const FileHeader: string = "/* File:      GeneratedTypes.d.ts\n * Author:    Gage Sorrell <gage@sorrell.sh>\n * Copyright: (c) 2024 Gage Sorrell\n * License:   MIT\n */\n\n/* AUTO-GENERATED FILE. */\n";

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

/** Get the argument vector as it would appear in a TypeScript function definition. */
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

/** Get a comma-separated list of a function's arguments, without type definitions. */
const GetArguments = (RegisteredFunction: FRegisteredFunction): string =>
{
    return RegisteredFunction.Arguments.map((Argument: FFunctionArgument): string => Argument.Name).join(", ");
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

const GetFunctionDeclarations = async (CppFiles: Array<string>): Promise<Array<FRegisteredFunction>> =>
{
    const RegisteredFunctions: Array<FRegisteredFunction> = [ ];
    for await (const FilePath of CppFiles)
    {
        const Contents: string = await Fs.promises.readFile(FilePath, { encoding: "utf-8" });
        const MacroCallIndices: Array<number> = FindAllIndices(Contents, MacroName);
        for await (const MacroCallIndex of MacroCallIndices)
        {
            const MacroArgumentVectorStartIndex: number = Contents.indexOf("(", MacroCallIndex) + 1;
            const MacroArgumentVectorEndIndex: number = Contents.indexOf(")", MacroArgumentVectorStartIndex);
            const MacroArgumentVectorString: string =
                Contents.substring(MacroArgumentVectorStartIndex, MacroArgumentVectorEndIndex);
            const MacroArgumentVector: Array<string> =
                MacroArgumentVectorString.split(",").map((Argument: string): string =>
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
                Arguments,
                FilePath,
                Flags,
                Name,
                ReturnType
            });
        }
    }

    return RegisteredFunctions;
};

const PatchInitializationFile = async (RegisteredFunctions: Array<FRegisteredFunction>): Promise<void> =>
{
    const InitializationFilePath: string = Path.resolve(
        GetMonorepoPath(),
        "Application",
        "Windows",
        "Initialization.cpp"
    );
    const InitializationSourceFile: Array<string> =
        (await Fs.promises.readFile(InitializationFilePath, { encoding: "utf-8" })).split("\n");
    const IncludesRegionBeginComment: string = "/* BEGIN AUTO-GENERATED REGION: INCLUDES. */";
    const ExportsRegionBeginComment: string = "/* BEGIN AUTO-GENERATED REGION: EXPORTS. */";
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
};

const GenerateTypesDeclarationsFile = async (
    RegisteredFunctions: Array<FRegisteredFunction>
): Promise<void> =>
{
    const Declarations: Array<string> =
        RegisteredFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
        {
            const ExportName: string = GetExportName(RegisteredFunction);
            const ArgumentVector: string = GetArgumentVector(RegisteredFunction);
            return `export function ${ ExportName }(${ ArgumentVector }): ${ RegisteredFunction.ReturnType }`;
        });

    /* eslint-disable @stylistic/max-len */
    const GeneratedTypesFileContents: string = FileHeader + Declarations.join("\n");
    const GeneratedTypesFilePath: string = Path.resolve(GetMonorepoPath(), "Application", "Windows", "GeneratedTypes.d.ts");
    /* eslint-enable @stylistic/max-len */

    await Fs.promises.writeFile(GeneratedTypesFilePath, GeneratedTypesFileContents);
};

const GenerateIpcCode = async (RegisteredFunctions: Array<FRegisteredFunction>): Promise<void> =>
{
    const ExposedFunctions: Array<FRegisteredFunction> = RegisteredFunctions.filter((RegisteredFunction: FRegisteredFunction): boolean =>
    {
        return RegisteredFunction.Flags.map((Flag: FFlag): string => Flag.Name).includes("Renderer");
    });

    // 5. For functions marked `Renderer`, generate IPC code for main to receive request from renderer

    // Each `Renderer` function should have:
    //    1. A `ipcMain.handle` call whose channel is the function name, and function calls the C++ function
    //    2. An anonymous function that calls `ipcRenderer.invoke` declared in the file that calls `exposeInMainWorld`, and whose name is the function name (but prefixed/suffixed with something like `_Internal`)
    //    3. A function in a Renderer module that shares the same name and signature as the actual JS function, and calls the exposed IPC function and returns the result
    const HandleCallsFilePath: string = Path.resolve(GetMonorepoPath(), "Application", "Source", "Main", "RendererFunctions.ts");

    const HandleStatements: Array<string> = ExposedFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
    {
        const FunctionName: string = GetExportName(RegisteredFunction);
        return `ipcMain.handle(${ FunctionName }, (${ GetArgumentVector(RegisteredFunction) }): Promise<void> =>
        {
            return ${ FunctionName }(${ GetArguments(RegisteredFunction) });
        })`;
    });

    const HandleFileImportStatement: string = `import { ${ ExposedFunctions.map(GetExportName).join(", ") } } from "@sorrellwm/windows";\n`;
    const EslintDisableStatement: string = "\n/* eslint-disable */\n\n";

    const HandleCallsFile: string = FileHeader + EslintDisableStatement + HandleFileImportStatement + HandleStatements;

    await Fs.promises.writeFile(HandleCallsFilePath, HandleCallsFile);

    const ExposedCalls: string = ExposedFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
    {
        const FunctionName: string = GetExportName(RegisteredFunction);
        const Arguments: string = GetArguments(RegisteredFunction);
        const ReturnType: string = RegisteredFunction.ReturnType;
        const HasArguments: boolean = Arguments !== "";
        return HasArguments
            ? `${ FunctionName }: (${ GetArgumentVector(RegisteredFunction) }): ${ ReturnType } => ipcRenderer.invoke("${ FunctionName }", ${ Arguments })`
            : `${ FunctionName }: (): ${ ReturnType } => ipcRenderer.invoke("${ FunctionName }")`;
    }).join(",\n");

    const PreloadContents: string = `
/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

/* eslint-disable-next-line @typescript-eslint/typedef */
const ElectronHandler =
{
    ipcRenderer:
    {
        on(Channel: string, InFunction: ((...Arguments: Array<unknown>) => void))
        {
            const subscription = (_event: IpcRendererEvent, ...args: Array<unknown>) =>
            {
                return InFunction(...args);
            };

            ipcRenderer.on(Channel, subscription);

            return () =>
            {
                ipcRenderer.removeListener(Channel, subscription);
            };
        },
        once(Channel: string, InFunction: ((...Arguments: Array<unknown>) => void))
        {
            ipcRenderer.once(
                Channel,
                (_Event: Electron.Event, ..._Arguments: Array<unknown>) => InFunction(..._Arguments)
            );
        },
        sendMessage(Channel: string, ...Arguments: Array<unknown>)
        {
            ipcRenderer.send(Channel, ...Arguments);
        }
    },
    ${ ExposedCalls }
};

contextBridge.exposeInMainWorld("electron", ElectronHandler);

export type FElectronHandler = typeof ElectronHandler;

\n`;

    const PreloadPath: string = Path.resolve(
        GetMonorepoPath(),
        "Application",
        "Source",
        "Main",
        "Preload.ts"
    );

    await Fs.promises.writeFile(PreloadPath, PreloadContents);

    const IpcFilePath: string = Path.resolve(
        GetMonorepoPath(),
        "Application",
        "Source",
        "Renderer",
        "Ipc.ts"
    );

    const GetImportLine = (RegisteredFunctions: FRegisteredFunction): string =>
    {
        const FunctionName: string = GetExportName(RegisteredFunctions);
        return `${ FunctionName } as ${ FunctionName }Imported`;
    };

    /* eslint-disable-next-line @stylistic/max-len */
    const IpcFileImportStatement: string = `import { ${ ExposedFunctions.map(GetImportLine).join(", ") } } from "@sorrellwm/windows";\n`;
    const IpcFileExportedFunctions: string =
        ExposedFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
        {
            const FunctionName: string = GetExportName(RegisteredFunction);
            return `export const ${ FunctionName } = window.electron.${ FunctionName }Imported`;
        }).join("\n");
    const IpcFileContents: string =
        FileHeader +
        IpcFileImportStatement +
        IpcFileExportedFunctions +
        "\n";

    await Fs.promises.writeFile(IpcFilePath, IpcFileContents);
};

type FRegisteredFunctionHook =
    <TReturnType, TArgumentTypeVector extends Array<unknown>>(
        InitialValue: TReturnType,
        ...Arguments: TArgumentTypeVector
    ) => Readonly<[ ReturnValue: TReturnType ]>;

const GenerateHooks = async (RegisteredFunctions: Array<FRegisteredFunction>): Promise<void> =>
{
    // The hook should be in an auto-generated module, with this pattern:

    //     const MakeHookFunctionDefinition: string = `
    // const MakeHook = (FunctionName: string): FRegisteredFunctionHook =>
    // {
    //     return <TReturnType, TArgumentTypeVector extends Array<unknown>>(
    //         InitialValue: TReturnType,
    //         ...Arguments: TArgumentTypeVector
    //     ): Readonly<[ ReturnValue: TReturnType ]> =>
    //     {
    //         const [ ReturnValue, SetReturnValue ] = useState<TReturnType>(InitialValue);

    //         window.electron[FunctionName](...Arguments);

    //         return [ ReturnValue ] as const;
    //     };
    // };\n`;

    const GeneratedModulePath: string = Path.resolve(
        GetMonorepoPath(),
        "Application",
        "Source",
        "Renderer",
        "Hooks.Generated.ts"
    );


};

const Main = async (): Promise<void> =>
{
    const CppFiles: Array<string> = await GetCppFiles();
    const RegisteredFunctions: Array<FRegisteredFunction> = await GetFunctionDeclarations(CppFiles);
    await Promise.all([
        () => PatchInitializationFile(RegisteredFunctions),
        () => GenerateTypesDeclarationsFile(RegisteredFunctions),
        () => GenerateIpcCode(RegisteredFunctions)
    ]);
    // 6. For functions marked `Renderer` *and* `Hook`, Generate React hook for functions
};

Run(Main, "Build", "Builds SorrellWm.");
