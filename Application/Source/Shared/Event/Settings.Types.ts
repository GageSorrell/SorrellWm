/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FExternalSetting, FSettings } from "../Settings";
import type { FRequestDeclNone, FResponseDeclNone, TEventDecl } from "@sorrellwm/event";
import type { TEventErrorCode } from "./ErrorCodes.Types";

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
        GetExternalSettingState: TEventDecl<
            FExternalSetting,
            FSettings[FExternalSetting],
            FGetExternalSettingStateErrorCode
        >;
        GetSetting: TEventDecl<
            keyof FSettings,
            FSettings[keyof FSettings],
            FGetSettingErrorCode
        >;
        GetSettings: TEventDecl<
            FRequestDeclNone,
            FSettings,
            FGetSettingsErrorCode
        >;
        CheckForUpdates: TEventDecl<
            FRequestDeclNone,
            FUpdateStatus,
            FCheckForUpdatesErrorCode
        >;
        UpdateSettings: TEventDecl<
            FSettings,
            FResponseDeclNone,
            FUpdateSettingsErrorCode
        >;
    }
};
