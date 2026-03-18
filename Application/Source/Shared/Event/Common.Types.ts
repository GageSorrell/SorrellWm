/* File:      Common.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FHexColor, HMonitor } from "@sorrellwm/windows";
import type { FAnnotatedPanel, FPanel } from "../Tree.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";
import type { TIpcBackendEvent, TIpcFrontendEvent } from "./EventBase.Types";
import type { FStore } from "../Store.Types";
import type { FExternalWindow } from "../Window/ExternalWindow.Types";
import type { FFloatingWindow } from "../Window/FloatingWindow.Types";
import type { FInsertableWindowData } from "./Insert.Types";

export type FActivateErrorCode = TEventErrorCode<"">;

export type FTearDownErrorCode = TEventErrorCode<"">;

export type FGetIdErrorCode = TEventErrorCode<"">;

export type FGetMonitorFromFocusedWindowErrorCode = TEventErrorCode<"ActiveWindowUndefined">;

export type FGetAnnotatedPanelsErrorCode = TEventErrorCode<"">;

export type FGetCurrentPanelErrorCode = TEventErrorCode<"">;

export type FGetIsLightModeErrorCode = TEventErrorCode<"">;

export type FGetThemeColorErrorCode = TEventErrorCode<"">;

export type FGetPanelScreenshotsErrorCode = TEventErrorCode<"">;

export type FGetInsertableWindowDataErrorCode = TEventErrorCode<"">;

export type FLogErrorCode = TEventErrorCode<"">;

export type FMaximizeFloatingWindowErrorCode = TEventErrorCode<"">;

export type FMinimizeFloatingWindowErrorCode = TEventErrorCode<"">;

export type FNotifyReadyErrorCode = TEventErrorCode<"">;

export type FReadyForRouteErrorCode = TEventErrorCode<"">;

export type FRestoreFloatingWindowErrorCode = TEventErrorCode<"">;

export type FRequestTearDownErrorCode = TEventErrorCode<"">;

export type FGetExternalWindowStateErrorCode = TEventErrorCode<"">;

export type FGetFloatingWindowStateErrorCode = TEventErrorCode<"">;

export type FGetStoreErrorCode = TEventErrorCode<"">;

export type FUpdateErrorCode = TEventErrorCode<"">;

export type FSetStoreErrorCode = TEventErrorCode<"">;

export type FRequestRestartErrorCode = TEventErrorCode<"">;

export type FAllowActivationErrorCode = TEventErrorCode<"">;

export type FPreventActivationErrorCode = TEventErrorCode<"">;

export type FGetIsElevatedErrorCode = TEventErrorCode<"">;

export type FOpenWebPageErrorCode = TEventErrorCode<"">;

declare module "./Event.Types"
{
    interface IFrontendEventRegistrar
    {
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
        GetIsActiveWindowTiled: TIpcFrontendEvent<
            undefined,
            { IsTiled: boolean; },
            FGetCurrentPanelErrorCode
        >;
        GetIsLightMode: TIpcFrontendEvent<
            undefined,
            { IsLightMode: boolean; },
            FGetIsLightModeErrorCode
        >;
        Update: TIpcFrontendEvent<
            undefined,
            undefined,
            FUpdateErrorCode
        >;
        OpenWebPage: TIpcFrontendEvent<
            string,
            undefined,
            FOpenWebPageErrorCode
        >;
        GetIsElevated: TIpcFrontendEvent<
            undefined,
            { IsElevated: boolean; },
            FGetIsElevatedErrorCode
        >;
        AllowActivation: TIpcFrontendEvent<
            undefined,
            undefined,
            FAllowActivationErrorCode
        >;
        PreventActivation: TIpcFrontendEvent<
            undefined,
            undefined,
            FPreventActivationErrorCode
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
        NotifyReady: TIpcFrontendEvent<
            undefined,
            undefined,
            FNotifyReadyErrorCode
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
        RequestRestart: TIpcFrontendEvent<
            undefined,
            undefined,
            FRequestRestartErrorCode
        >;
        RequestTearDown: TIpcFrontendEvent<
            undefined,
            undefined,
            FRequestTearDownErrorCode
        >;
    }

    interface IBackendEventRegistrar
    {
        Activate: TIpcBackendEvent<
            boolean,
            undefined,
            FActivateErrorCode
        >;
        TearDown: TIpcBackendEvent<
            undefined,
            undefined,
            FTearDownErrorCode
        >;
    }
};
