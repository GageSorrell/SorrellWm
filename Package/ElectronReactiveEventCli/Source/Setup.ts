/**
 * @file      Setup.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc, no-console */

import { Code, type Wrapper as WrapperOuter } from "@sorrell/cli-utilities";
import { DefaultConfigFileName, GetDefaultConfig } from "./Config";
import { RunListr, SimpleError } from "./Shared";
import { readFile, writeFile } from "fs/promises";
import Chalk from "chalk";
import { GetPackageRootDirectory } from "@sorrell/utilities";
import type { Listr } from "listr2";
import { ListrEnquirerPromptAdapter } from "@listr2/prompt-adapter-enquirer";
import { SetCommand } from "./Command";
import { existsSync } from "fs";
import { resolve } from "path";

async function GetDefaultWrittenConfig(): Promise<string>
{
    const SchemaLine: string =
        "$schema: \"https://electron-reactive-event.sorrell.sh/CliConfig.Schema.json\"";

    const Lines: Array<string> = JSON.stringify(await GetDefaultConfig(), null, 4)
        .split("\n")
        .splice(1, 0, SchemaLine, "\n");

    const InsertionIndex: number = Lines.findIndex((Line: string): boolean =>
    {
        return Line.includes("AugmentationModulePath: string;");
    });

    /* eslint-disable-next-line @stylistic/max-len */
    const CommentedContent: Array<string> = `//     // \`electron-reactive-event-cli\` can create modules for you that export the reactive
//     // IPC functions, scoped to your \`PackageKey\`.
//     "IpcModulePath": {
//         // The path of the module that calls \`getReactiveIpcMain\`, and exports its output.
//         "Main": "",

//         // The path of the module that calls \`getReactiveIpcHooks\`, and exports its output.
//         "Renderer": ""
//     };
`.split("\n");

    return Lines.toSpliced(InsertionIndex, 0, ...CommentedContent, "\n").join("\n");
}

// async function Inner(): Promise<string>
// {
//     const Root: string = await GetPackageRootDirectory();
//     const ConfigPath: string = resolve(Root, ConfigFileName);
//     if (!existsSync(ConfigPath))
//     {
//         try
//         {
//             console.log("Going to write file...");
//             await writeFile(
//                 ConfigPath,
//                 await GetDefaultWrittenConfig(),
//                 { encoding: "utf-8" }
//             );

//             console.log("Wrote file!", ConfigPath);

//             return ConfigPath;
//         }
//         catch (Error: unknown)
//         {
//             throw new TryError(undefined, Error);
//         }
//     }
//     else
//     {
//         throw new TryError(`A file was already found at ${ ConfigPath }.  Exiting!`);
//     }
// }

export async function SetupCommand(): Promise<void>
{
    SetCommand("setup");

    type Context =
        {
            AlreadyHasUpdateReactiveScript: boolean;
            ConfigAlreadyExists: boolean;
            PackageJson: Record<string, unknown>;
            RootDirectory: string;
            WriteNpmScript: boolean;
        };

    type Wrapper = WrapperOuter<Context>;

    await RunListr<Context>([
        {
            task: async (Context: Context, Task: Wrapper): Promise<void> =>
            {
                try
                {
                    Context.RootDirectory = await GetPackageRootDirectory();
                }
                catch
                {
                    Task.title = "Failed to find root directory of a NodeJS project.";
                    /* eslint-disable-next-line @stylistic/max-len */
                    throw new SimpleError("It appears that the command was not run from within a NodeJS project.  Exiting.");
                }

                Task.title = "Found root directory of current NodeJS project.";
            },
            title: "Finding root directory of current NodeJS project."
        },
        {
            task: async (Context: Context, Task: Wrapper): Promise<void> =>
            {
                if (existsSync(resolve(Context.RootDirectory, DefaultConfigFileName)))
                {
                    Task.title = "Found existing config file.";
                    Context.ConfigAlreadyExists = true;
                }

                Task.title = "Did not find an existing config file.";
            },
            title: "Checking for existing config file."
        },
        {
            skip: (Context: Context) => Context.ConfigAlreadyExists,
            task: async (Context: Context, Task: Wrapper): Promise<void> =>
            {
                const ConfigPath: string = resolve(Context.RootDirectory, DefaultConfigFileName);
                try
                {
                    await writeFile(
                        ConfigPath,
                        await GetDefaultWrittenConfig(),
                        { encoding: "utf-8" }
                    );
                    Task.title = "Wrote default config file.";
                }
                catch
                {
                    Task.title = "Failed to write default config file.";
                    throw new SimpleError("Unable to write default config file.  Exiting.");
                }
            },
            title: "Writing default config file."
        },
        {
            task: async (Context: Context, Task: Wrapper): Promise<void> =>
            {
                Context.WriteNpmScript = await Task.prompt(ListrEnquirerPromptAdapter).run({
                    initial: true,
                    /* eslint-disable-next-line @stylistic/max-len */
                    message: `Add ${ Code("npm") } script "${ Code("update-reactive") }" to run the ${ Code("declare-events") } and ${ Code("generate") } commands for you?`,
                    type: "Toggle"
                });

                /* eslint-disable-next-line @stylistic/max-len */
                Task.title = `Determined that the ${ Code("npm") } script "${ Code("update-reactive") }" ${ Context.WriteNpmScript ? Chalk.italic("should") : "should " + Chalk.italic("not") } be added.`;
            },
            /* eslint-disable-next-line @stylistic/max-len */
            title: `Determining whether the ${ Code("npm") } script "${ Code("update-reactive") }" should be added.`
        },
        {
            skip: (Context: Context) => !Context.WriteNpmScript,
            task: async (_Context: Context, Task: Wrapper): Promise<Listr> =>
            {
                return Task.newListr((ParentTask: Omit<Wrapper, "skip" | "enabled">) => [
                    {
                        task: async (Context: Context, Task: Wrapper): Promise<void> =>
                        {
                            const PackageJsonPath: string = resolve(Context.RootDirectory, "package.json");
                            const PackageJsonContents: string =
                                await readFile(PackageJsonPath, { encoding: "utf-8" });

                            Context.PackageJson = JSON.parse(PackageJsonContents);
                            Task.title = `Read the project's ${ Code("package.json") }.`;
                        },
                        title: `Reading the project's ${ Code("package.json") }.`
                    },
                    {
                        task: async (Context: Context, Task: Wrapper): Promise<void> =>
                        {
                            if (
                                "scripts" in Context.PackageJson &&
                                typeof Context.PackageJson.scripts === "object" &&
                                Context.PackageJson.scripts !== null
                            )
                            {
                                if ("update-reactive" in Context.PackageJson.scripts)
                                {
                                    Context.AlreadyHasUpdateReactiveScript = true;
                                    Task.title = `Found existing "${ Code("update-reactive") }" script.`;
                                    return;
                                }
                            }

                            Context.AlreadyHasUpdateReactiveScript = false;
                            Task.title = `No existing "${ Code("update-reactive") }" script found.`;
                        },
                        title: `Checking for existing "${ Code("update-reactive") }" script.`
                    },
                    {
                        skip: (Context: Context) => Context.AlreadyHasUpdateReactiveScript,
                        task: async (Context: Context, Task: Wrapper): Promise<void> =>
                        {
                            const ScriptsUndefined: boolean = (
                                !("scripts" in Context.PackageJson) ||
                                Context.PackageJson.scripts === undefined
                            );

                            if (ScriptsUndefined)
                            {
                                Context.PackageJson.scripts = { };
                            }

                            (Context.PackageJson.scripts as Record<string, string>)["update-reactive"] =
                                /* eslint-disable-next-line @stylistic/max-len */
                                "electron-reactive-event-cli declare-events && electron-reactive-event-cli generate";

                            const OutPackageJson: string = JSON.stringify(Context.PackageJson, null, 2);
                            await writeFile(
                                resolve(Context.RootDirectory, "package.json"),
                                OutPackageJson,
                                { encoding: "utf-8" }
                            );

                            Task.title = `Saved changes to ${ Code("package.json") }.`;

                            /* eslint-disable-next-line @stylistic/max-len */
                            ParentTask.title = `Added "${ Code("update-reactive") }" script to ${ Code("package.json") }.`;
                        },
                        title: `Saving changes to ${ Code("package.json") }.`
                    }
                ], { concurrent: false });
            },
            title: `Adding "${ Code("update-reactive") }" script to ${ Code("package.json") }.`
        }
    ],
    "Failed to finish setup.",
    {
        concurrent: false
    });

    console.log(`${ Chalk.green("✓") } Completed ${ Code("setup") } successfully!`);
}
