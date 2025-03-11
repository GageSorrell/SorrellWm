/* File:      Build.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import * as Fs from "fs";
import * as Path from "path";
import {
    DoTask,
    DoTasks,
    FormatCode,
    GetPath,
    GetRef,
    LogError,
    MapSome,
    Run,
    type TRef,
    c } from "ScriptUtility";
import type {
    FComplexFlag,
    FComplexFlagKey,
    FFlag,
    FFlagKey,
    FFunctionArgument,
    FRegisteredFunction,
    FSimpleFlagKey } from "./index.Types.js";

/* Comment: This file uses the following naming convention for C++ files:
 *    * `Source` files end in `.cpp`
 *    * `Header` files end in `.h`
 *    * **`Cpp` files refer to either**
 */

/* eslint-disable-next-line @stylistic/max-len */
const FileHeader: string = "/* File:      GeneratedTypes.d.ts\n * Author:    Gage Sorrell <gage@sorrell.sh>\n * Copyright: (c) 2024 Gage Sorrell\n * License:   MIT\n */\n\n/* AUTO-GENERATED FILE. */\n\n/* eslint-disable */\n\n";

const MacroName: string = "DECLARE_NAPI_FUNCTION";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
const GetArgumentVector = (Arguments: Array<FFunctionArgument>): string =>
{
    let OutString: string = "";
    Arguments.forEach((Argument: FFunctionArgument, Index: number): void =>
    {
        const ArgumentFormatted: string = `${ Argument.Name }: ${ Argument.Type }`;
        OutString += ArgumentFormatted;
        if (Index !== Arguments.length - 1)
        {
            OutString += ", ";
        }
    });

    return OutString;
};

/** Get a comma-separated list of a function's arguments, without type definitions. */
const GetArguments = (RegisteredFunction: FRegisteredFunction): string =>
{
    return RegisteredFunction.Arguments
        .map((Argument: FFunctionArgument): string => Argument.Name)
        .join(", ");
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

const GetFlagByName = (
    RegisteredFunction: FRegisteredFunction,
    FlagKey: FFlagKey,
    ValueRef: TRef<string>
): boolean =>
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
                const Sep: "=" = "=" as const;
                const FlagValue: string = FlagInstance.slice(FlagInstance.indexOf(Sep) + 2, -1);

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

    /* eslint-disable-next-line no-constant-condition */
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

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
    const SourcePath: string = Path.resolve(GetPath("Windows"), "Source");
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
            const IsCommentedOut: boolean = ((): boolean =>
            {
                // 1. Get line
                    // 1. Get preceding line break
                    // 2. Get following line break
                // 2. Trim line
                // 3. See if starts with `//` or `/*`
                let FoundPrecedingLineBreak: boolean = false;
                let Index: number = MacroCallIndex;
                while (!FoundPrecedingLineBreak)
                {
                    if (Contents[Index] === "\n")
                    {
                        FoundPrecedingLineBreak = true;
                    }
                    else
                    {
                        Index -= 1;
                    }
                }
                const EndIndex: number = Contents.indexOf("\n", Index + 1);

                const TrimmedLine: string = Contents.substring(Index, EndIndex);
                return TrimmedLine.startsWith("//") || TrimmedLine.startsWith("/*");
            })();

            if (IsCommentedOut)
            {
                continue;
            }

            const MacroArgumentVectorStartIndex: number = Contents.indexOf("(", MacroCallIndex) + 1;
            const MacroArgumentVectorEndIndex: number = Contents.indexOf(")", MacroArgumentVectorStartIndex);
            const MacroArgumentVectorString: string =
                Contents.substring(MacroArgumentVectorStartIndex, MacroArgumentVectorEndIndex);
            const MacroArgumentVector: Array<string> =
                MacroArgumentVectorString.split(",").map((MacroArgument: string): string =>
                {
                    return MacroArgument.trim();
                });
            const Name: string = MacroArgumentVector[0];
            const ReturnType: string = MacroArgumentVector[1];
            const Flags: Array<FFlag> = MapSome(MacroFlagKeys, (MacroFlag: FFlagKey): FFlag | undefined =>
            {
                const FlagValueRef: TRef<string> = GetRef<string>();
                if (HasFlag(MacroArgumentVector, MacroFlag, FlagValueRef))
                {
                    return FlagValueRef.Current !== undefined
                        ? {
                            Name: MacroFlag,
                            Value: FlagValueRef.Current as string
                        }
                        : {
                            Name: (MacroFlag as FSimpleFlagKey)
                        };
                }
                else
                {
                    return undefined;
                }
            });

            const Arguments: Array<FFunctionArgument> = [ ];
            const LastFlagIndex: number = ((): number =>
            {
                if (Flags.length === 0)
                {
                    return -Infinity;
                }
                else
                {
                    const Indices: Array<number> = Flags.map((Flag: FFlag): number =>
                    {
                        // console.log("MacroArgVec", MacroArgumentVector, Flag.Name);
                        return MacroArgumentVector.findIndex((MacroArgument: string): boolean =>
                        {
                            return MacroArgument.startsWith(Flag.Name);
                        });
                    });

                    return Math.max(...Indices);
                }
            })();

            const FunctionArgumentVector: Array<string> = [ ];

            /* The function name and return type are the `2`. */
            const HasFunctionArguments: boolean = MacroArgumentVector.length - Flags.length > 2;
            if (HasFunctionArguments)
            {
                console.log(`Function ${ Name } has function arguments.`);
                if (Flags.length > 0)
                {
                    console.log(`Function ${ Name } has flags.`);
                    console.log("\n", MacroArgumentVector, "\n\n", LastFlagIndex);
                    FunctionArgumentVector.push(...MacroArgumentVector.slice(LastFlagIndex + 1));
                }
                else
                {
                    FunctionArgumentVector.push(...MacroArgumentVector.slice(2));
                }
                // if (Flags.length > 0)
                // {
                //     /* eslint-disable @stylistic/max-len */
                //     // console.log(
                //     //     `Function ${ Name } of return type ${ ReturnType } has the following MacroArgumentVector,\n    `,
                //     //     MacroArgumentVector,
                //     //     "\n    while the sliced array is\n    ",
                //     //     [ ...MacroArgumentVector ].slice(LastFlagIndex - 1)
                //     // );
                //     /* eslint-enable @stylistic/max-len */
                //     FunctionArgumentVector.push(...MacroArgumentVector.slice(LastFlagIndex - 1));
                // }
                // else
                // {
                //     /* eslint-disable-next-line @stylistic/max-len */
                //     /* The macro argument vector does not specify any flags, but specifies function arguments. */
                //     FunctionArgumentVector.push(...MacroArgumentVector.slice(2 + Flags.length));
                // }

                console.log(`FunctionArgumentVector is ${ FunctionArgumentVector.join(", ") }.`);
                FunctionArgumentVector.forEach((FunctionArgumentPart: string, Index: number): void =>
                {
                    if (Index % 2 === 1)
                    {
                        return;
                    }

                    const Name: string = FunctionArgumentPart;
                    const Type: string = FunctionArgumentVector[Index + 1];

                    console.log(`ARG: ${ Name } ${ Type } of ${ Name }.`);

                    Arguments.push({
                        Name,
                        Type
                    });
                });
            }

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
        GetPath("Windows"),
        "Source",
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
        // console.log(`Here, ExportName is ${ ExportName }.`);
        // console.log(RegisteredFunction);
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
            const ArgumentVector: string = GetArgumentVector(RegisteredFunction.Arguments);
            /* eslint-disable-next-line @stylistic/max-len */
            return `export function ${ ExportName }(${ ArgumentVector }): ${ RegisteredFunction.ReturnType };`;
        });

    const NontrivialTypes: Set<string> = await (async (): Promise<Set<string>> =>
    {
        /* A trick for finding words that are types: each instance is preceded by `: `. */
        const Matches: Set<string> = new Set<string>();
        const Pattern: RegExp = /: (\w+)/g;
        let Match: RegExpExecArray | null = null;
        while ((Match = Pattern.exec(Declarations.join("\n"))) !== null)
        {
            /* All trivial types start with lowercase letters,   *
             * all nontrivial types start with a capital letter. */
            if (Match[1][0] === Match[1][0].toUpperCase())
            {
                Matches.add(Match[1]);
            }
        }
        return Matches;
    })();

    const CoreTypesFilePath: string = Path.resolve(GetPath("Windows"), "Core.d.ts");
    const CoreTypesFile: string = await Fs.promises.readFile(CoreTypesFilePath, { encoding: "utf-8" });

    /* eslint-disable-next-line @stylistic/max-len */
    const ImportStatement: string = `import type { ${ Array.from(NontrivialTypes).join(", ") } } from "./Core";\n\n`;

    NontrivialTypes.forEach((NontrivialType: string): void =>
    {
        const TypeIsDefinedInCore: boolean = CoreTypesFile.includes(`export type ${ NontrivialType } =`);
        if (!TypeIsDefinedInCore)
        {
            /* eslint-disable-next-line @stylistic/max-len */
            LogError(`Type ${ c(NontrivialType) } is referenced by a function, but it is not defined in ${ c("Core.d.ts") }`);
        }
    });

    /* eslint-disable @stylistic/max-len */
    const GeneratedTypesFileContents: string =
        FileHeader +
        ImportStatement +
        Declarations.join("\n") + "\n";
    const GeneratedTypesFilePath: string = Path.resolve(GetPath("Windows"), "Types.Generated.d.ts");
    /* eslint-enable @stylistic/max-len */

    await Fs.promises.writeFile(GeneratedTypesFilePath, GeneratedTypesFileContents);
};

const GenerateIpcCode = async (RegisteredFunctions: Array<FRegisteredFunction>): Promise<void> =>
{
    const ExposedFunctions: Array<FRegisteredFunction> =
        RegisteredFunctions.filter((RegisteredFunction: FRegisteredFunction): boolean =>
        {
            return RegisteredFunction.Flags.map((Flag: FFlag): string => Flag.Name).includes("Renderer");
        });

    // 5. For functions marked `Renderer`, generate IPC code for main to receive request from renderer

    /* eslint-disable @stylistic/max-len */
    // Each `Renderer` function should have:
    //    1. A `ipcMain.handle` call whose channel is the function name, and function calls the C++ function
    //    2. An anonymous function that calls `ipcRenderer.invoke` declared in the file that calls `exposeInMainWorld`, and whose name is the function name (but prefixed/suffixed with something like `_Internal`)
    //    3. A function in a Renderer module that shares the same name and signature as the actual JS function, and calls the exposed IPC function and returns the result
    /* eslint-enable @stylistic/max-len */
    const HandleCallsFilePath: string = Path.resolve(
        GetPath("Main"),
        "RendererFunctions.Generated.ts"
    );

    const HandleStatements: string =
        ExposedFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
        {
            const FunctionName: string = GetExportName(RegisteredFunction);
            /* eslint-disable-next-line @stylistic/max-len */
            return `ipcMain.handle("${ FunctionName }", (${ GetArgumentVector(RegisteredFunction.Arguments) }): Promise<${ RegisteredFunction.ReturnType }> =>\n{\n    return Promise.resolve(${ FunctionName }(${ GetArguments(RegisteredFunction) }));\n});`;
        }).join("\n\n");

    const CoreTypeImports: Array<string> =
    [
        ...new Set<string>(
            ExposedFunctions.map((ExposedFunction: FRegisteredFunction): Array<string> =>
            {
                const IsTypeNontrivial = (Type: string): boolean =>
                {
                    return Type[0] === Type[0].toUpperCase();
                };

                const FunctionArgumentTypes: Array<string> =
                    ExposedFunction.Arguments.map((Argument: FFunctionArgument): string =>
                    {
                        return Argument.Type;
                    });

                /* eslint-disable-next-line @stylistic/max-len */
                console.log(`ATTEMPTING ExposedFunction ${ ExposedFunction.Name }.\nReturnType: ${ ExposedFunction.ReturnType }, ${ FunctionArgumentTypes.join(", ") }`);
                const TypesToConsider: Array<string> =
                [
                    ExposedFunction.ReturnType,
                    ...FunctionArgumentTypes
                ];

                return TypesToConsider.filter(IsTypeNontrivial);
            }).flat()
        )
    ];

    const TypeImports: string = CoreTypeImports.map((Type: string): string => `type ${ Type }`).join(", ");
    const FunctionImports: string = ExposedFunctions.map(GetExportName).join(", ");

    const HandleFileImportStatement: string =
        `import { ${ FunctionImports }, ${ TypeImports } } from "@sorrellwm/windows";\n\n`;

    const IpcImportStatement: string = "import { ipcMain } from \"electron\"\n";

    const HandleCallsFile: string =
        FileHeader +
        IpcImportStatement +
        HandleFileImportStatement +
        HandleStatements +
        "\n";

    await Fs.promises.writeFile(HandleCallsFilePath, HandleCallsFile);

    const ExposedCalls: string = ExposedFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
    {
        const FunctionName: string = GetExportName(RegisteredFunction);
        const Arguments: string = GetArguments(RegisteredFunction);
        const ReturnType: string = RegisteredFunction.ReturnType;
        const HasArguments: boolean = Arguments !== "";
        /* eslint-disable @stylistic/max-len */
        return HasArguments
            ? `${ FunctionName }: async (${ GetArgumentVector(RegisteredFunction.Arguments) }): Promise<${ ReturnType }> => ipcRenderer.invoke("${ FunctionName }", ${ Arguments })`
            : `${ FunctionName }: async (): Promise<${ ReturnType }> => ipcRenderer.invoke("${ FunctionName }")`;
        /* eslint-enable @stylistic/max-len */
    }).join(",\n");

    /* eslint-disable-next-line @stylistic/max-len */
    const PreloadImportStatement: string = `import { ${ ExposedFunctions.map(GetExportName).join(", ") }, ${ CoreTypeImports } } from "@sorrellwm/windows";\n`;

    const PreloadContents: string = `/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

/* eslint-disable */

import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
${ PreloadImportStatement }

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

    const PreloadPath: string = Path.resolve(GetPath("Main"), "Preload.ts");

    await Fs.promises.writeFile(PreloadPath, PreloadContents);

    const IpcFilePath: string = Path.resolve(GetPath("Renderer"), "Ipc.ts");

    const IpcFileExportedFunctions: string =
        ExposedFunctions.map((RegisteredFunction: FRegisteredFunction): string =>
        {
            const FunctionName: string = GetExportName(RegisteredFunction);
            return `export const ${ FunctionName } = window.electron.${ FunctionName };`;
        }).join("\n");
    const IpcFileContents: string =
        FileHeader +
        IpcFileExportedFunctions +
        "\n";

    await Fs.promises.writeFile(IpcFilePath, IpcFileContents);
};

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
type FRegisteredFunctionHook =
    <TReturnType, TArgumentTypeVector extends Array<unknown>>(
        InitialValue: TReturnType,
        ...Arguments: TArgumentTypeVector
    ) => Readonly<[ ReturnValue: TReturnType ]>;

const GenerateHooks = async (RegisteredFunctions: Array<FRegisteredFunction>): Promise<void> =>
{
    /* eslint-disable @stylistic/max-len */
    type FHookDefinition =
    {
        Hook: string;
        ImportedTypes: Array<string>;
    };

    const HookDefinitions: Array<FHookDefinition> =
        RegisteredFunctions.filter((RegisteredFunction: FRegisteredFunction): boolean =>
        {
            return RegisteredFunction.Flags.map(Flag => Flag.Name).includes("Hook");
        }).map((RegisteredFunction: FRegisteredFunction): FHookDefinition =>
        {
            const { Arguments, Name, ReturnType } = RegisteredFunction;
            const ImportedTypes: Array<string> = Arguments.filter((Argument: FFunctionArgument): boolean =>
            {
                return Argument.Type[0] === Argument.Type[0].toUpperCase();
            }).map((Argument: FFunctionArgument): string =>
            {
                return Argument.Type;
            });

            if (ReturnType[0] === ReturnType[0].toUpperCase())
            {
                ImportedTypes.push(ReturnType);
            }

            const ArgumentVector: string = GetArgumentVector(Arguments);
            const ArgumentNames: string = Arguments.map(Arg => Arg.Name).join(", ");
            const Hook: string = `export const Use${ Name } = (InitialValue: ${ ReturnType }${ Arguments.length > 0 ? ", " : "" }${ ArgumentVector }): Readonly<[ ${ ReturnType } ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<${ ReturnType }>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: ${ ReturnType } = await window.electron.${ GetExportName(RegisteredFunction) }(${ ArgumentNames });
            SetReturnValue((_Old: ${ ReturnType }): ${ ReturnType } =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.${ GetExportName(RegisteredFunction) }, ${ Arguments.map(Arg => Arg.Name).join(", ") } ]);

    return [ ReturnValue ] as const;
};`;

            return {
                Hook,
                ImportedTypes
            };

        });

    const ImportedTypes: Array<string> = Array.from(new Set<string>(HookDefinitions.map(Def => Def.ImportedTypes).flat()));
    const SorrellWmImportStatement: string = ImportedTypes.length > 0
        ? `import { ${ ImportedTypes.map((Type: string) => `type ${ Type }`) } } from "@sorrellwm/windows";`
        : "";
    const ImportStatements: string = `import { useEffect, useState } from "react";\n${ SorrellWmImportStatement }\n\n`;
    const HookDefinitionsString: string = HookDefinitions.map(Def => Def.Hook).join("\n\n");

    const HookModuleContents: string = FileHeader + ImportStatements + HookDefinitionsString;

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const GeneratedModulePath: string = Path.resolve(GetPath("Renderer"), "Hooks.Generated.ts");
    await Fs.promises.writeFile(GeneratedModulePath, HookModuleContents, { encoding: "utf-8" });
};

const Main = async (): Promise<void> =>
{
    const CppFiles: Array<string> = await DoTask(GetCppFiles, "Finding project C++ files");
    const RegisteredFunctions: Array<FRegisteredFunction> =
        await DoTask(() => GetFunctionDeclarations(CppFiles), "Parsing function declarations");

    try
    {
        await DoTasks(
            [
                () => PatchInitializationFile(RegisteredFunctions),
                /* eslint-disable-next-line @stylistic/max-len */
                `${ FormatCode("#include") }'ing relevant headers in ${ FormatCode("Initialization.cpp") } file and listing in export map`
            ],
            [
                () => GenerateTypesDeclarationsFile(RegisteredFunctions),
                "Generating the types declaration file"
            ],
            [
                () => GenerateIpcCode(RegisteredFunctions),
                `Generating IPC calls for functions marked ${ FormatCode("Renderer") }`
            ],
            [
                () => GenerateHooks(RegisteredFunctions),
                `Generating hooks for functions marked ${ FormatCode("Hook") }`
            ]
        );
    }
    catch (Error: unknown)
    {
        console.log("Build Error");
        console.log(Error);
    }
};

Run(Main, "Build", "Builds SorrellWm.");
