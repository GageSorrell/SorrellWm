/* File:      Settings.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type Context,
    type PropsWithChildren,
    type ReactNode,
    createContext,
    useCallback,
    useContext,
    useState } from "react";
import { DefaultSettings, type FSettings as FAppSettings } from "../Shared/Settings";
import { SendIpcEvent, UseSendIpcEvent } from "./Event";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Log";
import { Identity } from "./Utility";
import type { TIpcState } from "./Event.Types";
import type { TPromiseThenFunction } from "!/Utility";

const Log: FLogger = GetLogger("Settings");

export type FSettings = Readonly<FAppSettings>;
type TUpdateFunction = <T extends keyof FSettings,>(Setting: T, Value: FSettings[T]) => void;

export type CSettings =
{
    OutSettings: FSettings;
    OutUpdateFunction: TUpdateFunction;
};

const DefaultContextSettings: CSettings =
{
    OutSettings: DefaultSettings,
    OutUpdateFunction: Identity
};

const SettingsContext: Context<CSettings> = createContext<CSettings>(DefaultContextSettings);

export const UseSettings = (): FSettings =>
{
    return useContext<CSettings>(SettingsContext).OutSettings;
};

export const UseSetting = <SettingKey extends keyof FSettings,>(
    SettingKey: SettingKey
): Readonly<[ Setting: FSettings[SettingKey] ]> =>
{
    const Setting: FSettings[SettingKey] = UseSettings()[SettingKey];

    return [ Setting ] as const;
};

export const UpdateSetting = <T extends keyof FSettings,>(Setting: T, Value: FSettings[T]): void =>
{
    const { OutUpdateFunction } = useContext<CSettings>(SettingsContext);
    OutUpdateFunction(Setting, Value);
};

export const Settings = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ OutSettings, SetOutSettings ] = useState<FSettings>(DefaultSettings);

    const OnGetSettings: TPromiseThenFunction<TIpcState<"GetSettings">> =
        useCallback(({ Data }: TIpcState<"GetSettings">): void =>
        {
            Log("OnGetSettings");
            if (Data !== undefined)
            {
                SetOutSettings((_Old: FSettings): FSettings =>
                {
                    return Data.Settings;
                });
            }
        }, [ ]);

    UseSendIpcEvent("GetSettings", undefined, OnGetSettings);

    const OutUpdateFunction: TUpdateFunction =
        <T extends keyof FSettings,>(Setting: T, Value: FSettings[T]): void =>
        {
            SendIpcEvent("UpdateSetting", { Setting, Value });
        };

    const value: CSettings =
    {
        OutSettings,
        OutUpdateFunction
    };

    return (
        <SettingsContext.Provider { ...{ value } }>
            { children }
        </SettingsContext.Provider>
    );
};
