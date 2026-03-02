/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FActivateErrorCode,
    FBringIntoPanelErrorCode,
    FGetAnnotatedPanelsErrorCode,
    FGetCurrentPanelErrorCode,
    FGetFocusDataErrorCode,
    FGetInsertableWindowDataErrorCode,
    FGetIsLightModeErrorCode,
    FGetMonitorFromFocusedWindowErrorCode,
    FGetPanelScreenshotsErrorCode,
    FGetSettingErrorCode,
    FGetSettingsErrorCode,
    FGetThemeColorErrorCode,
    FLogErrorCode,
    FNavigateErrorCode,
    FOnChangeFocusErrorCode,
    FReadyForRouteErrorCode,
    FRequestTearDownErrorCode,
    FTearDownErrorCode,
    FUpdateSettingErrorCode } from "./ErrorCodes.Types";
import type { FAnnotatedPanel, FFocusChange, FPanel } from "#/Tree";
import type { FHexColor, HMonitor } from "@sorrellwm/windows";
import type { TIpcBackendEvent, TIpcEventsBase, TIpcFrontendEvent } from "./EventBase.Types";
import type { FFocusData } from "!/Event/Focus.Types";
import type { FInsertableWindowData } from "./Insert.Types";
import type { FNavigateRequest } from "./Navigate.Types";
import type { FSettings } from "../Settings";

// @TODO Create proper string unions for the error codes for each event.
export type FIpcFrontendEvents = TIpcEventsBase<{
    BringIntoPanel: TIpcFrontendEvent<
        FAnnotatedPanel,
        undefined,
        FBringIntoPanelErrorCode
    >;
    GetMonitorFromFocusedWindow: TIpcFrontendEvent<
        undefined,
        { Monitor: HMonitor; },
        FGetMonitorFromFocusedWindowErrorCode
    >;
    GetAnnotatedPanels: TIpcFrontendEvent<
        undefined,
        { AnnotatedPanels: Array<FAnnotatedPanel> },
        FGetAnnotatedPanelsErrorCode
    >;
    GetCurrentPanel: TIpcFrontendEvent<
        undefined,
        FPanel,
        FGetCurrentPanelErrorCode
    >;
    GetFocusData: TIpcFrontendEvent<
        undefined,
        FFocusData,
        FGetFocusDataErrorCode
    >;
    GetIsLightMode: TIpcFrontendEvent<
        undefined,
        { IsLightMode: boolean; },
        FGetIsLightModeErrorCode
    >;
    GetSetting: TIpcFrontendEvent<
        keyof FSettings,
        { Setting: FSettings[keyof FSettings] },
        FGetSettingErrorCode
    >;
    GetSettings: TIpcFrontendEvent<
        undefined,
        { Settings: FSettings; },
        FGetSettingsErrorCode
    >;
    GetThemeColor: TIpcFrontendEvent<
        undefined,
        { ThemeColor: FHexColor; },
        FGetThemeColorErrorCode
    >;
    GetPanelScreenshots: TIpcFrontendEvent<
        undefined,
        { Screenshots: Array<string>; },
        FGetPanelScreenshotsErrorCode
    >;
    GetInsertableWindowData: TIpcFrontendEvent<
        undefined,
        { InsertableWindowData: Array<FInsertableWindowData> },
        FGetInsertableWindowDataErrorCode
    >;
    Log: TIpcFrontendEvent<
        Array<unknown>,
        undefined,
        FLogErrorCode
    >;
    OnChangeFocus: TIpcFrontendEvent<
        FFocusChange,
        undefined,
        FOnChangeFocusErrorCode
    >;
    ReadyForRoute: TIpcFrontendEvent<
        undefined,
        undefined,
        FReadyForRouteErrorCode
    >;
    RequestTearDown: TIpcFrontendEvent<
        undefined,
        undefined,
        FRequestTearDownErrorCode
    >;
    UpdateSetting: TIpcFrontendEvent<
        { Setting: keyof FSettings; Value: FSettings[keyof FSettings] },
        undefined,
        FUpdateSettingErrorCode
    >;
}>;

export type FIpcBackendEvents = TIpcEventsBase<{
    Activate: TIpcBackendEvent<
        boolean,
        undefined,
        FActivateErrorCode
    >;
    Navigate: TIpcBackendEvent<
        FNavigateRequest,
        undefined,
        FNavigateErrorCode
    >;
    TearDown: TIpcBackendEvent<
        undefined,
        undefined,
        FTearDownErrorCode
    >;
}>;
