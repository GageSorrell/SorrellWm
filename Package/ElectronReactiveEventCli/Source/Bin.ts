#!/usr/bin/env node

/* File:      Bin.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc, no-console */

import { AllCommand } from "./All.Command";
import { DeclareEventsCommand } from "./DeclareEvents.Command";
import { GenerateIpcCommand } from "./GenerateIpc.Command";
import { GenerateIpcMainModuleCommand } from "./GenerateIpcMainModule";
import { GenerateIpcRendererModuleCommand } from "./GenerateIpcRendererModule";
import { GenerateScopedTypesCommand } from "./GenerateScopedTypes.Command";
import { GetPackageRootDirectory } from "@sorrell/utilities";
import { SetupCommand } from "./Setup";
import { readFile } from "fs/promises";
import { resolve } from "path";

async function ShowHelp(): Promise<void>
{
    type PackageJson = { version: string; };
    const Root: string = await GetPackageRootDirectory();
    const PackageJson: PackageJson =
        JSON.parse(await readFile(resolve(Root, "package.json"), { encoding: "utf-8" })) as PackageJson;

    const Version: string = PackageJson.version;
    /* eslint-disable @stylistic/max-len */
    console.log(`electron-reactive-event-cli v${ Version }.\nCopyright 2026 Gage Sorrell.\nReleased under the MIT license.\n
Commands (Core):

    all:                   Performs everything below but setup.
    declare-events:        Generates a module that augments the Registrar with your event declarations.
    generate-scoped-types: Generates copies of the types exported by electron-reactive-event/scoped, but scoped to your PackageKey.
    generate-types:        Alias for generate-scoped-types.
    generate-ipc main:     Generates a module that exports reactive IPC functions for main.
    generate-ipc renderer: Generates a module that exports reactive IPC functions for the renderer.,
    generate-ipc:          Generates IPC modules for main and renderer.
    set-up:                Creates a config file.  This is necessary for using the CLI.
    setup:                 Alias for set-up.

Commands (Miscellaneous):
    docs:                  Opens the documentation reference in the default browser.
    download-sample:       Downloads the sample project.
    help:                  Outputs this text.
`);
    /* eslint-enable @stylistic/max-len */
}

async function Main(): Promise<void>
{
    type Commands = Readonly<Record<string, (() => Promise<void>)>>;
    const Commands: Commands =
        {
            all: AllCommand,

            "declare-events": DeclareEventsCommand,

            "generate-scoped-types": GenerateScopedTypesCommand,
            "generate-types": GenerateScopedTypesCommand,

            "generate-ipc": GenerateIpcCommand,
            "generate-ipc main": GenerateIpcMainModuleCommand,
            "generate-ipc renderer": GenerateIpcRendererModuleCommand,

            "set-up": SetupCommand,
            setup: SetupCommand
        } as const;

    const Command: string = process.argv[process.argv.length - 1] as string;

    if ([ "main", "renderer" ].includes(Command))
    {
        const CommandWithArgument: string = process.argv.slice(-2).join(" ");

        if (CommandWithArgument in Commands && Commands[CommandWithArgument] !== undefined)
        {
            await Commands[CommandWithArgument]();
            process.exit(0);
        }
        else
        {
            await ShowHelp();
            process.exit(1);
        }
    }
    else if (Command in Commands && Commands[Command] !== undefined)
    {
        await Commands[Command]();
        process.exit(0);
    }
    else
    {
        await ShowHelp();
        process.exit(1);
    }
}

Main();
