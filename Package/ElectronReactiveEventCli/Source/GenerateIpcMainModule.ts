/* File:      GenerateIpcMainModule.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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
import { getReactiveIpcMain } from "electron-reactive-event/scoped";

const {
    addListener: AddListener,
    handle: Handle,
    handleOnce: HandleOnce,
    off: Off,
    on: On,
    once: Once,
    removeAllListeners: RemoveAllListeners,
    removeHandler: RemoveHandler,
    removeListener: RemoveListener
} = getReactiveIpcFunctions<PackageKey>();

export const addListener: typeof AddListener = AddListener;
export const handle: typeof Handle = Handle;
export const handleOnce: typeof HandleOnce = HandleOnce;
export const off: typeof Off = Off;
export const on: typeof On = On;
export const once: typeof Once = Once;
export const removeAllListeners: typeof RemoveAllListeners = RemoveAllListeners;
export const removeHandler: typeof RemoveHandler = RemoveHandler;
export const removeListener: typeof RemoveListener = RemoveListener;
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
