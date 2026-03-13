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
    FGetExternalSettingStateErrorCode,
    FGetExternalWindowStateErrorCode,
    FGetFloatingWindowStateErrorCode,
    FGetFocusDataErrorCode,
    FGetIdErrorCode,
    FGetInsertableWindowDataErrorCode,
    FGetIsLightModeErrorCode,
    FGetMonitorFromFocusedWindowErrorCode,
    FGetPanelScreenshotsErrorCode,
    FGetSettingErrorCode,
    FGetSettingsErrorCode,
    FGetStoreErrorCode,
    FGetThemeColorErrorCode,
    FLogErrorCode,
    FMaximizeFloatingWindowErrorCode,
    FMinimizeFloatingWindowErrorCode,
    FMoveFloatingWindowErrorCode,
    FNavigateErrorCode,
    FNotifyReadyErrorCode,
    FOnChangeFocusErrorCode,
    FReadyForRouteErrorCode,
    FRequestTearDownErrorCode,
    FRestoreFloatingWindowErrorCode,
    FSetStoreErrorCode,
    FTearDownErrorCode,
    FUpdateSettingsErrorCode,
    FCheckForUpdatesErrorCode,
    FUpdateErrorCode} from "./ErrorCodes.Types";
import type { FAnnotatedPanel, FFocusChange, FPanel } from "#/Tree";
import type { FExternalSetting, FSettings } from "../Settings";
import type { FHexColor, HMonitor } from "@sorrellwm/windows";
import type { TIpcBackendEvent, TIpcEventsBase, TIpcFrontendEvent } from "./EventBase.Types";
import type { FExternalWindow } from "../Window/ExternalWindow.Types";
import type { FFloatingWindow } from "../Window/FloatingWindow.Types";
import type { FFocusData } from "./Focus.Types";
import type { FInsertableWindowData } from "./Insert.Types";
import type { FNavigateRequest } from "./Navigate.Types";
import type { FStore } from "../Store.Types";
import type { FTranslation } from "./Move.Types";
import type { FUpdateStatus } from "./Settings.Types";

export type FIpcFrontendEvents = TIpcEventsBase<{
    BringIntoPanel: TIpcFrontendEvent<
        FAnnotatedPanel,
        undefined,
        FBringIntoPanelErrorCode
    >;
    GetId: TIpcFrontendEvent<
        undefined,
        { Id: number | undefined; },
        FGetIdErrorCode
    >;
    GetMonitorFromFocusedWindow: TIpcFrontendEvent<
        undefined,
        { Monitor: HMonitor; },
        FGetMonitorFromFocusedWindowErrorCode
    >;
    GetAnnotatedPanels: TIpcFrontendEvent<
        undefined,
        { AnnotatedPanels: TArray<FAnnotatedPanel> },
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
    CheckForUpdates: TIpcFrontendEvent<
        undefined,
        FUpdateStatus,
        FCheckForUpdatesErrorCode
    >;
    Update: TIpcFrontendEvent<
        undefined,
        undefined,
        FUpdateErrorCode
    >;
    GetSettings: TIpcFrontendEvent<
        undefined,
        FSettings,
        FGetSettingsErrorCode
    >;
    GetStore: TIpcFrontendEvent<
        undefined,
        FStore,
        FGetStoreErrorCode
    >;
    SetStore: TIpcFrontendEvent<
        FStore,
        undefined,
        FSetStoreErrorCode
    >;
    GetExternalSettingState: TIpcFrontendEvent<
        FExternalSetting,
        { Setting: FSettings[FExternalSetting] },
        FGetExternalSettingStateErrorCode
    >;
    GetThemeColor: TIpcFrontendEvent<
        undefined,
        { ThemeColor: FHexColor; },
        FGetThemeColorErrorCode
    >;
    GetPanelScreenshots: TIpcFrontendEvent<
        undefined,
        { Screenshots: TArray<string>; },
        FGetPanelScreenshotsErrorCode
    >;
    GetExternalWindowState: TIpcFrontendEvent<
        undefined,
        FExternalWindow,
        FGetExternalWindowStateErrorCode
    >;
    GetFloatingWindowState: TIpcFrontendEvent<
        undefined,
        FFloatingWindow,
        FGetFloatingWindowStateErrorCode
    >;
    GetInsertableWindowData: TIpcFrontendEvent<
        undefined,
        { InsertableWindowData: TArray<FInsertableWindowData> },
        FGetInsertableWindowDataErrorCode
    >;
    Log: TIpcFrontendEvent<
        TArray<unknown>,
        undefined,
        FLogErrorCode
    >;
    MaximizeFloatingWindow: TIpcFrontendEvent<
        undefined,
        undefined,
        FMaximizeFloatingWindowErrorCode
    >;
    MinimizeFloatingWindow: TIpcFrontendEvent<
        undefined,
        undefined,
        FMinimizeFloatingWindowErrorCode
    >;
    MoveFloatingWindow: TIpcFrontendEvent<
        FTranslation,
        undefined,
        FMoveFloatingWindowErrorCode
    >;
    NotifyReady: TIpcFrontendEvent<
        undefined,
        undefined,
        FNotifyReadyErrorCode
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
    RestoreFloatingWindow: TIpcFrontendEvent<
        undefined,
        undefined,
        FRestoreFloatingWindowErrorCode
    >;
    RequestTearDown: TIpcFrontendEvent<
        undefined,
        undefined,
        FRequestTearDownErrorCode
    >;
    UpdateSettings: TIpcFrontendEvent<
        FSettings,
        undefined,
        FUpdateSettingsErrorCode
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
