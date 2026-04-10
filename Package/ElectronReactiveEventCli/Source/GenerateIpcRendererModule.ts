/* File:      GenerateIpcRenderer.Command.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { GetHeader, SetCommand, Try, TryError } from "./Command";
import type { CliConfig } from "./Config.Types";
import { GetConfigSafe } from "./Config";
import { GetRelativeImportPath } from "./DeclareEvents";
import { writeFile } from "node:fs/promises";

export function GetIpcPath(
    Config: CliConfig,
    Owner: "Main" | "Renderer"
): (() => Promise<string>)
{
    return async function(): Promise<string>
    {
        if ("IpcModulePath" in Config && Config.IpcModulePath !== undefined)
        {
            if (Owner in Config.IpcModulePath && Config.IpcModulePath[Owner] !== undefined)
            {
                return Config.IpcModulePath[Owner];
            }
            else
            {
                /* eslint-disable-next-line @stylistic/max-len */
                throw new TryError(`The ${ Owner } property of IpcModulePath was not found in the config file.`);
            }
        }
        else
        {
            throw new TryError("The IpcModulePath property was not found in the config file.");
        }
    };
}

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
import { getReactiveIpcHooks } from "electron-reactive-event/scoped";

const {
    useInvokeEvent: UseInvokeEvent,
    useInvokeEventDeferred: UseInvokeEventDeferred,
    useOnEvent: UseOnEvent,
    useOnEventDeferred: UseOnEventDeferred,
    useOnceEvent: UseOnceEvent,
    useOnceEventDeferred: UseOnceEventDeferred,
    useOffEventDeferred: UseOffEventDeferred,
    useSendEvent: UseSendEvent,
    useSendEventDeferred: UseSendEventDeferred
} = getReactiveIpcHooks<PackageKey>();

export const useInvokeEvent: typeof UseInvokeEvent = UseInvokeEvent;
export const useInvokeEventDeferred: typeof UseInvokeEventDeferred = UseInvokeEventDeferred;
export const useOnEvent: typeof UseOnEvent = UseOnEvent;
export const useOnEventDeferred: typeof UseOnEventDeferred = UseOnEventDeferred;
export const useOnceEvent: typeof UseOnceEvent = UseOnceEvent;
export const useOnceEventDeferred: typeof UseOnceEventDeferred = UseOnceEventDeferred;
export const useOffEventDeferred: typeof UseOffEventDeferred = UseOffEventDeferred;
export const useSendEvent: typeof UseSendEvent = UseSendEvent;
export const useSendEventDeferred: typeof UseSendEventDeferred = UseSendEventDeferred;
`;
        await writeFile(ModulePath, Contents, { encoding: "utf-8" });
    };
}

export async function GenerateIpcRendererModule(): Promise<void>
{
    const Config: CliConfig = await GetConfigSafe();
    const ModulePath: string = await Try(
        "Loading the IpcModulePath.Renderer path from the config file...",
        "Found the IpcModulePath.Renderer in your package's root directory!",
        GetIpcPath(Config, "Renderer")
    );

    await Try(
        "Writing the file...",
        `Wrote the hooks successfully to ${ ModulePath }!`,
        Inner(Config, ModulePath)
    );
}

export async function GenerateIpcRendererModuleCommand(): Promise<void>
{
    SetCommand("generate-ipc renderer");
    await GenerateIpcRendererModule();
}
