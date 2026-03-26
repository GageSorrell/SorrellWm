#!/usr/bin/env node
/* File:      Setup.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import { GetPackageRootDirectory, GetSafeNewPath, TryAsync } from "@sorrell/utilities";
import { GoBackChoice, PromptModule, SelectInterfacesFromModule } from "./Select.js";
import { basename, resolve } from "path";
import { Code } from "@sorrell/cli-utilities";
import { Command } from "commander";
import type { FCliConfig } from "./Schema.Types.js";
import type { FSelectedInterfaces } from "./Select.Types.js";
import type { FSetupOptions } from "./Initialize.Types.js";
import type { Ora } from "ora";
import { RunCommand } from "./Shared.js";
import ora from "ora";
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

async function WriteCliConfig(FileName: string, CliConfig: FCliConfig): Promise<void>
{
    const ThisOra: Ora = ora({
        text: `Writing ${ Code(FileName) } to your package's root directory...`
    }).start();

    const RootDirectory: string = await GetPackageRootDirectory();

    const ConfigPathBase: string = resolve(RootDirectory, FileName);

    const ConfigPath: string = await GetSafeNewPath(ConfigPathBase);

    const ConfigContents: string = JSON.stringify(CliConfig, null, 4);

    const { Error } = await TryAsync(writeFile(ConfigPath, ConfigContents));

    const ConfigPathFileName: string = basename(ConfigPath);

    if (Error === undefined)
    {
        /* eslint-disable-next-line @stylistic/max-len */
        ThisOra.succeed(`The file ${ Code(ConfigPath) } was written successfully!`);
        console.log(`Please open the file and fill out its fields to use the ${ Code("register") } command.`);
    }
    else
    {
        /* eslint-disable-next-line @stylistic/max-len */
        ThisOra.fail(`The file ${ Code(ConfigPathFileName) } could not be written in ${ Code(RootDirectory) }.  Here is the error:`);
        console.error(JSON.stringify(Error, null, 4) + "\n");
    }
}

async function SetupInteractive(this: Command): Promise<void>
{
    let SelectedModule: string | undefined = undefined;
    let SelectedInterfaces: FSelectedInterfaces | undefined = undefined;
    const HasSelectedEverything = (InInterfaces: FSelectedInterfaces | undefined): boolean =>
    {
        return (
            InInterfaces?.Main !== undefined &&
            InInterfaces?.Renderer !== undefined &&
            InInterfaces?.Main !== GoBackChoice &&
            InInterfaces?.Renderer !== GoBackChoice
        );
    };

    while (!HasSelectedEverything(SelectedInterfaces))
    {
        const ThisSelectedModule: string = await PromptModule(
            await GetPackageRootDirectory(),
            SelectedInterfaces
        );

        const TheseInterfaces: FSelectedInterfaces = await SelectInterfacesFromModule(
            ThisSelectedModule,
            SelectedInterfaces
        );

        if (TheseInterfaces.Main === undefined && TheseInterfaces.Renderer === undefined)
        {
            /* eslint-disable-next-line @stylistic/max-len */
            console.log(`No interfaces were found in this module that ${ Code("extend IMainRegistrar") } or ${ Code("IRendererRegistrar") }.\nPlease choose another module.`);
        }

        if (TheseInterfaces.Main !== undefined && TheseInterfaces.Main !== GoBackChoice)
        {
            if (SelectedInterfaces === undefined)
            {
                SelectedInterfaces =
                    {
                        Main: TheseInterfaces.Main,
                        Renderer: undefined
                    };
            }
            else
            {
                SelectedInterfaces.Main = TheseInterfaces.Main;
            }
        }

        if (TheseInterfaces.Renderer !== undefined && TheseInterfaces.Renderer !== GoBackChoice)
        {
            if (SelectedInterfaces === undefined)
            {
                SelectedInterfaces =
                    {
                        Main: undefined,
                        Renderer: TheseInterfaces.Renderer
                    };
            }
            else
            {
                SelectedInterfaces.Renderer = TheseInterfaces.Renderer;
            }
        }

        if (HasSelectedEverything(TheseInterfaces))
        {
            SelectedModule = ThisSelectedModule;
            SelectedInterfaces = TheseInterfaces;
        }
    }

    console.log(`SelectedModule === ${ SelectedModule }`);
}

async function SetupNoInteractive(this: Command): Promise<void>
{
    const DefaultName: string = "electron-reactive-event.json";
    await WriteCliConfig(DefaultName, GetEmptyCliConfig());
}

async function Setup(this: Command): Promise<void>
{
    const { interactive: IsInteractive }: FSetupOptions = this.opts();

    console.log(`Is Interactive: ${ IsInteractive }.`);

    if (IsInteractive)
    {
        await SetupInteractive.call(this);
        return;
    }
    else
    {
        await SetupNoInteractive.call(this);
        return;
    }
}

async function Main(): Promise<void>
{
    const SetupCommand: Command = new Command("setup")
        /* eslint-disable-next-line @stylistic/max-len */
        .description("Create the config file needed to register your event declarations automatically in your project's build step.")
        .option("--no-interactive", "Write an empty settings file to the root of your package.", true)
        .action(Setup);

    await RunCommand(SetupCommand);
}

Main();
