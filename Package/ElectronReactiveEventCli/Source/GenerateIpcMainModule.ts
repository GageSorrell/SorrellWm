/**
 * @file      GenerateIpcMainModule.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { GetHeader, SetCommand, Try } from "./Command";
import type { CliConfig } from "./Config.Types";
import { GetConfigSafe } from "./Config";
import { GetIpcPath } from "./GenerateIpcRendererModule";
import { GetRelativeImportPath } from "./DeclareEvents";
import { writeFile } from "fs/promises";

function Inner(
    Config: CliConfig,
    ModulePath: string
): (() => Promise<void>)
{
    return async function(): Promise<void>
    {
        const Header: string = GetHeader(ModulePath, "declare-events");
        const ImportPath: string = GetRelativeImportPath(Config.ScopedModulePath, ModulePath);
        const Contents: string = Header + `import type { PackageKey } from "${ ImportPath }";
import { type IpcMainReactive, getReactiveIpcMain } from "electron-reactive-event/scoped";

export const ipcMain: IpcMainReactive<PackageKey> = getReactiveIpcMain<PackageKey>();
`;
        await writeFile(ModulePath, Contents, { encoding: "utf-8" });
    };
}

export async function GenerateIpcMainModule(): Promise<void>
{
    const Config: CliConfig = await GetConfigSafe();
    const ModulePath: string = await Try(
        "Loading the IpcModulePath.Main path from the config file...",
        "Found the IpcModulePath.Main in your package's root directory!",
        GetIpcPath(Config, "Main")
    );

    await Try(
        "Writing the file...",
        `Wrote the hooks successfully to ${ ModulePath }!`,
        Inner(Config, ModulePath)
    );
}

export async function GenerateIpcMainModuleCommand(): Promise<void>
{
    SetCommand("generate-ipc main");
    await GenerateIpcMainModule();
}
