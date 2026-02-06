/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FAnnotatedPanel, FFocusChange, FPanel } from "#/Tree";
import type {
    FBringIntoPanelErrorCode,
    FGetAnnotatedPanelsErrorCode,
    FGetCurrentPanelErrorCode,
    FGetFocusDataErrorCode,
    FGetInsertableWindowDataErrorCode,
    FGetIsLightModeErrorCode,
    FGetMonitorFromFocusedWindowErrorCode,
    FGetPanelScreenshotsErrorCode,
    FGetThemeColorErrorCode,
    FLogErrorCode,
    FOnChangeFocusErrorCode,
    FReadyForRouteErrorCode,
    FRequestTearDownErrorCode } from "./ErrorCodes.Types";
import type { FHexColor, HMonitor } from "@sorrellwm/windows";
import type { TIpcBackendEvent, TIpcEventsBase, TIpcFrontendEvent } from "./EventBase.Types";
import type { FFocusData } from "!/Event/Focus.Types";
import type { FInsertableWindowData } from "./Insert.Types";

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
}>;

export type FIpcBackendEvents = TIpcEventsBase<{
    Activate: TIpcBackendEvent<
        boolean,
        undefined,
        string
    >;
    TearDown: TIpcBackendEvent<
        undefined,
        undefined,
        string
    >;
}>;
