/**
 * @file      Store.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type FStore, GetDefaultStore } from "../Shared";
import { RegisterInitializationFunction } from "#/Initialize/Initialize";
import Settings from "electron-settings";

export const GetStore = async (): Promise<FStore> =>
{
    const OutSettings: FStore | null = await Settings.get("Store") as FStore | null;
    return (OutSettings !== null)
        ? OutSettings
        : GetDefaultStore();
};

export const SetStore = async (NewStore: FStore): Promise<void> =>
{
    await Settings.set("Store", NewStore);
};

const InitializeStore = async (): Promise<void> =>
{
    if (!Settings.hasSync("Store"))
    {
        Settings.set("Store", GetDefaultStore());
    }
};

RegisterInitializationFunction("Store", InitializeStore);
