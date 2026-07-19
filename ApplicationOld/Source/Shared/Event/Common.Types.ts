/**
 * @file      Common.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FAnnotatedPanel, FPanel } from "../Tree.Types";
import type { FHexColor, HMonitor } from "@sorrell/wm-windows";
import type { EventDecl } from "reactive-event";
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

declare module "reactive-event/registrar"
{
    interface Registrar
    {
        GetId: EventDecl<
            RendererOwner,
            never,
            { Id: number | undefined; },
            FGetIdErrorCode
        >;
        GetMonitorFromFocusedWindow: EventDecl<
            RendererOwner,
            never,
            { Monitor: HMonitor; },
            FGetMonitorFromFocusedWindowErrorCode
        >;
        GetAnnotatedPanels: EventDecl<
            RendererOwner,
            never,
            { AnnotatedPanels: TArray<FAnnotatedPanel> },
            FGetAnnotatedPanelsErrorCode
        >;
        GetCurrentPanel: EventDecl<
            RendererOwner,
            never,
            FPanel,
            FGetCurrentPanelErrorCode
        >;
        GetIsActiveWindowTiled: EventDecl<
            RendererOwner,
            never,
            boolean,
            FGetCurrentPanelErrorCode
        >;
        GetIsLightMode: EventDecl<
            RendererOwner,
            never,
            boolean,
            FGetIsLightModeErrorCode
        >;
        Update: EventDecl<
            RendererOwner,
            never,
            never,
            FUpdateErrorCode
        >;
        OpenWebPage: EventDecl<
            RendererOwner,
            string,
            never,
            FOpenWebPageErrorCode
        >;
        GetIsElevated: EventDecl<
            RendererOwner,
            never,
            { IsElevated: boolean; },
            FGetIsElevatedErrorCode
        >;
        AllowActivation: EventDecl<
            RendererOwner,
            never,
            never,
            FAllowActivationErrorCode
        >;
        PreventActivation: EventDecl<
            RendererOwner,
            never,
            never,
            FPreventActivationErrorCode
        >;
        GetStore: EventDecl<
            RendererOwner,
            never,
            FStore,
            FGetStoreErrorCode
        >;
        SetStore: EventDecl<
            RendererOwner,
            FStore,
            never,
            FSetStoreErrorCode
        >;
        GetThemeColor: EventDecl<
            RendererOwner,
            never,
            FHexColor,
            FGetThemeColorErrorCode
        >;
        GetPanelScreenshots: EventDecl<
            RendererOwner,
            never,
            TArray<string>,
            FGetPanelScreenshotsErrorCode
        >;
        GetExternalWindowState: EventDecl<
            RendererOwner,
            never,
            FExternalWindow,
            FGetExternalWindowStateErrorCode
        >;
        GetFloatingWindowState: EventDecl<
            RendererOwner,
            never,
            FFloatingWindow,
            FGetFloatingWindowStateErrorCode
        >;
        GetInsertableWindowData: EventDecl<
            RendererOwner,
            never,
            { InsertableWindowData: TArray<FInsertableWindowData> },
            FGetInsertableWindowDataErrorCode
        >;
        Log: EventDecl<
            RendererOwner,
            TArray<unknown>,
            never,
            FLogErrorCode
        >;
        MaximizeFloatingWindow: EventDecl<
            RendererOwner,
            never,
            never,
            FMaximizeFloatingWindowErrorCode
        >;
        MinimizeFloatingWindow: EventDecl<
            RendererOwner,
            never,
            never,
            FMinimizeFloatingWindowErrorCode
        >;
        NotifyReady: EventDecl<
            RendererOwner,
            never,
            never,
            FNotifyReadyErrorCode
        >;
        ReadyForRoute: EventDecl<
            RendererOwner,
            never,
            never,
            FReadyForRouteErrorCode
        >;
        RestoreFloatingWindow: EventDecl<
            RendererOwner,
            never,
            never,
            FRestoreFloatingWindowErrorCode
        >;
        RequestRestart: EventDecl<
            RendererOwner,
            never,
            never,
            FRequestRestartErrorCode
        >;
        RequestTearDown: EventDecl<
            RendererOwner,
            never,
            never,
            FRequestTearDownErrorCode
        >;
    }

    interface Registrar
    {
        Activate: EventDecl<
            RendererOwner,
            boolean,
            never,
            FActivateErrorCode
        >;
        TearDown: EventDecl<
            RendererOwner,
            never,
            never,
            FTearDownErrorCode
        >;
    }
};
