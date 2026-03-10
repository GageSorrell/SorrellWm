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
import { UseSendIpcEvent, UseSendIpcEventDeferred } from "./Event";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Log";
import { Identity } from "./Utility";
import type { TIpcState } from "./Event.Types";
import type { TPromiseThenFunction } from "../Shared/Utility";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Settings");

export type FSettings = Readonly<FAppSettings>;
type TUpdateFunction = <Type extends keyof FSettings,>(Setting: Type, Value: FSettings[Type]) => void;

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

export const UpdateSetting = <Type extends keyof FSettings,>(Setting: Type, Value: FSettings[Type]): void =>
{
    const { OutUpdateFunction } = useContext<CSettings>(SettingsContext);
    OutUpdateFunction(Setting, Value);
};

export const Settings = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ OutSettings, SetOutSettings ] = useState<FSettings>(DefaultSettings);

    const OnGetSettings: TPromiseThenFunction<TIpcState<"GetSettings"> | undefined> =
        useCallback((Value: TIpcState<"GetSettings"> | undefined): void =>
        {
            SetOutSettings((Old: FSettings): FSettings =>
            {
                if (Value !== undefined)
                {
                    if (Value.Data !== undefined)
                    {
                        return Value.Data.Settings;
                    }
                }

                return Old;
            });
        }, [ ]);

    UseSendIpcEvent("GetSettings", undefined, OnGetSettings);

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const OutUpdateFunction: TUpdateFunction =
        <Type extends keyof FSettings,>(Setting: Type, Value: FSettings[Type]): void =>
        {
            const NewSettings: FAppSettings = { ...OutSettings };
            NewSettings[Setting] = Value;
            SendIpcEvent("UpdateSettings", NewSettings);
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
