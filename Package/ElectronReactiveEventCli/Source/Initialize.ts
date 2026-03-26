/* File:      Initialize.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   This module registers the commands defined the other modules
 *            in this package.
 */

/* eslint-disable no-console */

import { Command } from "commander";
import { type FCommandName } from "./index.js";

async function ConfigureProgram(_ProgramInstance: Command): Promise<void>
{
    // ProgramInstance
    //     .name("create-electron-reactive-event")
    //     .description("Generate boilerplate for Electron + React integrations.")
    //     .showHelpAfterError()
    //     .helpOption("-h, --help", "Display help information")
    //     .helpCommand("help [command]", "Display help for command");

    // ProgramInstance.addCommand(await GetSetupCommand());
    // ProgramInstance.addCommand(await GetRegisterCommand());
}

// function CreateCommand(
//     CommandName: FCommandName
// ): Command
// {
//     const CommandInstance: Command = new Command(CommandName);

//     CommandInstance
//         .description(GetCommandDescription(CommandName))
//         .requiredOption(
//             "-o, --output <Output Type>",
//             "Output type: console | clipboard | file",
//             ParseOutputType
//         )
//         .argument(
//             "[ OutputPath ]",
//             "Required when output type is \"file\""
//         )
//         .action(
//             async (
//                 OutputPathRaw: string | undefined,
//                 OptionsRaw: IOptions,
//                 ActionCommand: Command
//             ): Promise<void> =>
//             {
//                 const Request: IGenerationRequest = BuildGenerationRequest(
//                     CommandName,
//                     OptionsRaw,
//                     OutputPathRaw,
//                     ActionCommand
//                 );

//                 const GeneratedContent: string = BuildGeneratedContent(CommandName);

//                 await EmitGeneratedContent(Request, GeneratedContent);
//             }
//         );

//     return CommandInstance;
// }

// function GetCommandDescription(CommandName: FCommandName): string
// {
//     switch (CommandName)
//     {
//         case "preload":
//         {
//             return "Generate preload boilerplate.";
//         }

//         case "provider":
//         {
//             return "Generate provider boilerplate.";
//         }
//     }
// }

// function ParseOutputType(
//     OutputTypeRaw: string
// ): FOutputType
// {
//     switch (OutputTypeRaw)
//     {
//         case "console":
//         case "clipboard":
//         case "file":
//         {
//             return OutputTypeRaw;
//         }

//         default:
//         {
//             throw new InvalidArgumentError(
//                 "Output type must be exactly one of \"console\", \"clipboard\", or \"file\"."
//             );
//         }
//     }
// }

// function BuildGenerationRequest(
//     CommandName: FCommandName,
//     Options: IOptions,
//     OutputPathRaw: string | undefined,
//     ActionCommand: Command
// ): IGenerationRequest
// {
//     if (Options.Output === "file")
//     {
//         if (OutputPathRaw === undefined)
//         {
//             ActionCommand.error(
//                 "When --output file is used, you must also provide an output path immediately afterward."
//             );
//         }

//         const OutputPath: string = resolve(OutputPathRaw);
//         const OutputPathExists: boolean = existsSync(OutputPath);

//         return {
//             CommandName,
//             OutputType: Options.Output,
//             OutputPath,
//             OutputPathExists
//         };
//     }

//     if (OutputPathRaw !== undefined)
//     {
//         ActionCommand.error(
//             "An output path may only be provided when --output file is used."
//         );
//     }

//     return {
//         CommandName,
//         OutputType: Options.Output,
//         OutputPath: undefined,
//         OutputPathExists: false
//     };
// }

// function BuildGeneratedContent(CommandName: FCommandName): string
// {
//     return "";
// };

// async function MakeConfig(): Promise<string>
// {
//     const Root: string = await GetRootDirectory();
//
// }

// async function EmitGeneratedContent(Request: IGenerationRequest, GeneratedContent: string): Promise<void>
// {
//     switch (Request.OutputType)
//     {
//         case "console":
//         {
//             console.log(GeneratedContent);
//             return;
//         }

//         case "clipboard":
//         {
//             clipboard.write(GeneratedContent);
//             console.log("Output has been written to the clipboard.");
//             return;
//         }

//         case "file":
//         {
//             await EmitFileOutput(Request, GeneratedContent);
//             return;
//         }
//     }
// }

// async function EmitFileOutput(Request: IGenerationRequest, GeneratedContent: string): Promise<void>
// {
//     if (Request.OutputPath === undefined)
//     {
//         throw new Error("OutputPath was unexpectedly undefined.");
//     }

//     mkdirSync(dirname(Request.OutputPath), { recursive: true });

//     if (Request.OutputPathExists === true)
//     {
//         const ExistingContent: string = readFileSync(
//             Request.OutputPath,
//             "utf8"
//         );

//         const UpdatedContent: string = MergeWithExistingFile(ExistingContent, GeneratedContent);

//         writeFileSync(Request.OutputPath, UpdatedContent, "utf8");

//         console.log(`Updated existing file: "${ Request.OutputPath }"`);
//     }
//     else
//     {
//         writeFileSync(Request.OutputPath, GeneratedContent, "utf8");

//         console.log(`Created new file: "${ Request.OutputPath }"`);
//     }
// }

// function MergeWithExistingFile(ExistingContent: string, GeneratedContent: string): string
// {
//     return [
//         ExistingContent,
//         "",
//         GeneratedContent,
//         ""
//     ].join("\n");
// }

function NormalizeUserArguments(UserArguments: ReadonlyArray<string>): Array<string>
{
    const NormalizedUserArguments: Array<string> = [ ];

    let IsExpectingOutputValue: boolean = false;
    let IsExpectingOutputPath: boolean = false;

    for (let Index: number = 0; Index < UserArguments.length; Index++)
    {
        const UserArgument: string | undefined = UserArguments[Index];

        if (IsExpectingOutputValue === true && UserArgument !== undefined)
        {
            NormalizedUserArguments.push(UserArgument);

            IsExpectingOutputValue = false;
            IsExpectingOutputPath = UserArgument === "file";

            continue;
        }

        if (IsExpectingOutputPath === true && UserArgument !== undefined)
        {
            NormalizedUserArguments.push(UserArgument);

            IsExpectingOutputPath = false;

            continue;
        }

        const IsHelpArgument: boolean = (
            UserArgument === "?" ||
            UserArgument === "/?" ||
            UserArgument === "/h" ||
            UserArgument === "/help"
        );

        if (IsHelpArgument)
        {
            NormalizedUserArguments.push("--help");
            continue;
        }

        if (UserArgument === "help" && ShouldTreatAsHelpCommand(UserArguments, Index) === true)
        {
            NormalizedUserArguments.push("--help");
            continue;
        }

        if (UserArgument === "-o" || UserArgument === "--output")
        {
            NormalizedUserArguments.push(UserArgument);
            IsExpectingOutputValue = true;
            continue;
        }

        if (UserArgument === "/o" || UserArgument === "/output")
        {
            NormalizedUserArguments.push("--output");
            IsExpectingOutputValue = true;
            continue;
        }

        if (UserArgument?.startsWith("-o=") === true)
        {
            const OutputValue: string = UserArgument.slice("-o=".length);

            NormalizedUserArguments.push(`--output=${ OutputValue }`);
            IsExpectingOutputPath = OutputValue === "file";

            continue;
        }

        if (UserArgument?.startsWith("--output=") === true)
        {
            const OutputValue: string = UserArgument.slice("--output=".length);

            NormalizedUserArguments.push(`--output=${ OutputValue }`);
            IsExpectingOutputPath = OutputValue === "file";

            continue;
        }

        if (UserArgument?.startsWith("/o=") === true)
        {
            const OutputValue: string = UserArgument.slice("/o=".length);

            NormalizedUserArguments.push(`--output=${ OutputValue }`);
            IsExpectingOutputPath = OutputValue === "file";

            continue;
        }

        if (UserArgument?.startsWith("/output=") === true)
        {
            const OutputValue: string = UserArgument.slice("/output=".length);

            NormalizedUserArguments.push(`--output=${ OutputValue }`);
            IsExpectingOutputPath = OutputValue === "file";

            continue;
        }

        if (UserArgument !== undefined)
        {
            NormalizedUserArguments.push(UserArgument);
        }
    }

    return NormalizedUserArguments;
}

function ShouldTreatAsHelpCommand(UserArguments: ReadonlyArray<string>, Index: number): boolean
{
    if (UserArguments[Index] !== "help")
    {
        return false;
    }

    if (UserArguments.length === 1 && Index === 0)
    {
        return true;
    }

    const IsAskingForCommandDescription: boolean = (
        UserArguments.length === 2 &&
        Index === 1 &&
        IsCommandName(UserArguments[0] || "")
    );

    if (IsAskingForCommandDescription)
    {
        return true;
    }

    return false;
}

function IsCommandName(Value: string): Value is FCommandName
{
    return [ "setup", "register" ].includes(Value);
}

async function Main(): Promise<void>
{
    const Program: Command = new Command();
    ConfigureProgram(Program);

    const UserArguments: ReadonlyArray<string> = process.argv;
    const NormalizedUserArguments: Array<string> = NormalizeUserArguments(UserArguments);

    console.log("UserArguments:\n", JSON.stringify(UserArguments, null, 4));
    console.log("NormalizedUserArguments:\n", JSON.stringify(NormalizedUserArguments, null, 4));

    await Program.parseAsync(
        NormalizedUserArguments,
        {
            from: "user"
        }
    );
}

Main();
