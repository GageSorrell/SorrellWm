/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FExternalSetting, FSettings } from "../Settings";
import type { TEventErrorCode } from "./ErrorCodes.Types";
import type { TIpcFrontendEvent } from "./EventBase.Types";

export type FUpdateStatus =
{
    AvailableVersion: string | undefined;
};

export type FUpdateSettingsErrorCode = TEventErrorCode<"">;
export type FGetSettingsErrorCode = TEventErrorCode<"">;
export type FGetSettingErrorCode = TEventErrorCode<"">;
export type FCheckForUpdatesErrorCode = TEventErrorCode<"">;
export type FGetExternalSettingStateErrorCode = TEventErrorCode<"">;

declare module "./Event.Types"
{
    interface IFrontendEventRegistrar
    {
        GetExternalSettingState: TIpcFrontendEvent<
            FExternalSetting,
            { Setting: FSettings[FExternalSetting] },
            FGetExternalSettingStateErrorCode
        >;
        GetSetting: TIpcFrontendEvent<
            keyof FSettings,
            { Setting: FSettings[keyof FSettings] },
            FGetSettingErrorCode
        >;
        GetSettings: TIpcFrontendEvent<
            undefined,
            FSettings,
            FGetSettingsErrorCode
        >;
        CheckForUpdates: TIpcFrontendEvent<
            undefined,
            FUpdateStatus,
            FCheckForUpdatesErrorCode
        >;
        UpdateSettings: TIpcFrontendEvent<
            FSettings,
            undefined,
            FUpdateSettingsErrorCode
        >;
    }
};
