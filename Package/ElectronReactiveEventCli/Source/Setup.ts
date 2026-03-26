/* File:      Setup.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { GetRootDirectory, GetSafeNewPath } from "./Utility.js";
import { Command } from "commander";
import type { FCliConfig } from "./Schema.Types.js";
import type { FSetupOptions } from "./Initialize.Types.js";
import { resolve } from "path";
import { writeFile } from "fs/promises";

function GetEmptyCliConfig(): FCliConfig
{
    return {
        main:
        {
            name: "",
            path: ""
        },
        outPath: "",
        renderer:
        {
            name: "",
            path: ""
        }
    };
}

async function SetupNoInteractive(this: Command): Promise<void>
{
    // Create default `FSchema` object, write to root path.
    // Write to the project root with the default file name
    // (if a file with that path already exists, append `(${ number })`)

    const RootDirectory: string = await GetRootDirectory();

    const ConfigFileNameBase: string = "electron-reactive-event.json";
    const ConfigPathBase: string = resolve(RootDirectory, ConfigFileNameBase);

    const ConfigPath: string = await GetSafeNewPath(ConfigPathBase);

    const ConfigContents: string = JSON.stringify(GetEmptyCliConfig(), null, 4);

    try
    {
        await writeFile(ConfigPath, ConfigContents);
    }
    catch (WriteFileError)
    {

    }
}

async function Setup(this: Command): Promise<void>
{
    const { interactive: IsInteractive }: FSetupOptions = this.opts();

    if (!IsInteractive)
    {
        await SetupNoInteractive.call(this);
        return;
    }
}

export async function GetSetupCommand(): Promise<Command>
{
    const SetupCommand: Command = new Command("setup")
        /* eslint-disable-next-line @stylistic/max-len */
        .description("Create the config file needed to register your event declarations automatically in your project's build step.")
        .option("--no-interactive")
        .action(Setup);

    return SetupCommand;
}
