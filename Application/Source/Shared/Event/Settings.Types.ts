/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventDecl, RendererOwner } from "reactive-event";
import type { FExternalSetting, FSettings } from "../Settings";
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

declare module "reactive-event/registrar"
{
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    interface Registrar
    {
        GetExternalSettingState: EventDecl<
            RendererOwner,
            FExternalSetting,
            FSettings[FExternalSetting],
            FGetExternalSettingStateErrorCode
        >;
        GetSetting: EventDecl<
            RendererOwner,
            keyof FSettings,
            FSettings[keyof FSettings],
            FGetSettingErrorCode
        >;
        GetSettings: EventDecl<
            RendererOwner,
            never,
            FSettings,
            FGetSettingsErrorCode
        >;
        CheckForUpdates: EventDecl<
            RendererOwner,
            never,
            FUpdateStatus,
            FCheckForUpdatesErrorCode
        >;
        UpdateSettings: EventDecl<
            RendererOwner,
            FSettings,
            never,
            FUpdateSettingsErrorCode
        >;
    }
};
