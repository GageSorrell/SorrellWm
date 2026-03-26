/* File:      Common.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FAnnotatedPanel, FPanel } from "../Tree.Types";
import type { FHexColor, HMonitor } from "@sorrellwm/windows";
import type { FRequestDeclNone, FResponseDeclNone, TEventDecl } from "electron-reactive-event";
import type { FExternalWindow } from "../Window/ExternalWindow.Types";
import type { FFloatingWindow } from "../Window/FloatingWindow.Types";
import type { FInsertableWindowData } from "./Insert.Types";
import type { FStore } from "../Store.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";

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
        GetId: TEventDecl<
            FRequestDeclNone,
            { Id: number | undefined; },
            FGetIdErrorCode
        >;
        GetMonitorFromFocusedWindow: TEventDecl<
            FRequestDeclNone,
            { Monitor: HMonitor; },
            FGetMonitorFromFocusedWindowErrorCode
        >;
        GetAnnotatedPanels: TEventDecl<
            FRequestDeclNone,
            { AnnotatedPanels: TArray<FAnnotatedPanel> },
            FGetAnnotatedPanelsErrorCode
        >;
        GetCurrentPanel: TEventDecl<
            FRequestDeclNone,
            FPanel,
            FGetCurrentPanelErrorCode
        >;
        GetIsActiveWindowTiled: TEventDecl<
            FRequestDeclNone,
            boolean,
            FGetCurrentPanelErrorCode
        >;
        GetIsLightMode: TEventDecl<
            FRequestDeclNone,
            boolean,
            FGetIsLightModeErrorCode
        >;
        Update: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FUpdateErrorCode
        >;
        OpenWebPage: TEventDecl<
            string,
            FResponseDeclNone,
            FOpenWebPageErrorCode
        >;
        GetIsElevated: TEventDecl<
            FRequestDeclNone,
            { IsElevated: boolean; },
            FGetIsElevatedErrorCode
        >;
        AllowActivation: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FAllowActivationErrorCode
        >;
        PreventActivation: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FPreventActivationErrorCode
        >;
        GetStore: TEventDecl<
            FRequestDeclNone,
            FStore,
            FGetStoreErrorCode
        >;
        SetStore: TEventDecl<
            FStore,
            FResponseDeclNone,
            FSetStoreErrorCode
        >;
        GetThemeColor: TEventDecl<
            FRequestDeclNone,
            FHexColor,
            FGetThemeColorErrorCode
        >;
        GetPanelScreenshots: TEventDecl<
            FRequestDeclNone,
            TArray<string>,
            FGetPanelScreenshotsErrorCode
        >;
        GetExternalWindowState: TEventDecl<
            FRequestDeclNone,
            FExternalWindow,
            FGetExternalWindowStateErrorCode
        >;
        GetFloatingWindowState: TEventDecl<
            FRequestDeclNone,
            FFloatingWindow,
            FGetFloatingWindowStateErrorCode
        >;
        GetInsertableWindowData: TEventDecl<
            FRequestDeclNone,
            { InsertableWindowData: TArray<FInsertableWindowData> },
            FGetInsertableWindowDataErrorCode
        >;
        Log: TEventDecl<
            TArray<unknown>,
            FResponseDeclNone,
            FLogErrorCode
        >;
        MaximizeFloatingWindow: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FMaximizeFloatingWindowErrorCode
        >;
        MinimizeFloatingWindow: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FMinimizeFloatingWindowErrorCode
        >;
        NotifyReady: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FNotifyReadyErrorCode
        >;
        ReadyForRoute: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FReadyForRouteErrorCode
        >;
        RestoreFloatingWindow: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FRestoreFloatingWindowErrorCode
        >;
        RequestRestart: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FRequestRestartErrorCode
        >;
        RequestTearDown: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FRequestTearDownErrorCode
        >;
    }

    interface IBackendEventRegistrar
    {
        Activate: TEventDecl<
            boolean,
            FResponseDeclNone,
            FActivateErrorCode
        >;
        TearDown: TEventDecl<
            FRequestDeclNone,
            FResponseDeclNone,
            FTearDownErrorCode
        >;
    }
};
