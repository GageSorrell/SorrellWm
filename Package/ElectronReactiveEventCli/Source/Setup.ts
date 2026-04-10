/* File:      Setup.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc, no-console */

import { ConfigFileName, GetDefaultConfig } from "./Config";
import { SetCommand, Try, TryError } from "./Command";
import { GetPackageRootDirectory } from "@sorrell/utilities";
import { existsSync } from "fs";
import { resolve } from "path";
import { writeFile } from "fs/promises";

async function GetDefaultWrittenConfig(): Promise<string>
{
    const Lines: Array<string> = JSON.stringify(await GetDefaultConfig(), null, 4).split("\n");
    const InsertionIndex: number = Lines.findIndex((Line: string): boolean =>
    {
        return Line.includes("AugmentationModulePath: string;");
    });

    const CommentedContent: Array<string> = `//     /**
//      * \`electron-reactive-event-cli\` can create modules for you that export the reactive
//      * IPC functions, scoped to your \`PackageKey\`.
//      */
//     IpcModulePath?:
//     {
//         /** The path of the module that calls \`getReactiveIpcMain\`, and exports its output. */
//         Main?: string;

//         /** The path of the module that calls \`getReactiveIpcHooks\`, and exports its output. */
//         Renderer?: string;
//     };
`.split("\n");

    return Lines.toSpliced(InsertionIndex, 0, ...CommentedContent, "\n").join("\n");
}

async function Inner(): Promise<string>
{
    const Root: string = await GetPackageRootDirectory();
    const ConfigPath: string = resolve(Root, ConfigFileName);
    if (!existsSync(ConfigPath))
    {
        try
        {
            console.log("Going to write file...");
            await writeFile(
                ConfigPath,
                await GetDefaultWrittenConfig(),
                { encoding: "utf-8" }
            );

            console.log("Wrote file!", ConfigPath);

            return ConfigPath;
        }
        catch (Error: unknown)
        {
            throw new TryError(undefined, Error);
        }
    }
    else
    {
        throw new TryError(`A file was already found at ${ ConfigPath }.  Exiting!`);
    }
}

export async function SetupCommand(): Promise<void>
{
    SetCommand("setup");
    await Try(
        /* eslint-disable-next-line @stylistic/max-len */
        "Writing the default config file to electron-reactive-event.config.jsonc in the root of your package...",
        (Result: string) => `Successfully wrote the config file at\n\n    ${ Result }!`,
        Inner
    );
}
