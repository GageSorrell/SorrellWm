/* File:      EventErrorCodes.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FUnspecifiedErrorCode = "UnspecifiedError";

export type FUnknownErrorCode =
    | FUnspecifiedErrorCode
    | string;

// #region Frontend

type TEventErrorCode<Type extends string> = Type | FUnspecifiedErrorCode;

export type FBringIntoPanelErrorCode = TEventErrorCode<"">;

export type FGetMonitorFromFocusedWindowErrorCode = TEventErrorCode<"ActiveWindowUndefined">;

export type FGetAnnotatedPanelsErrorCode = TEventErrorCode<"">;

export type FGetCurrentPanelErrorCode = TEventErrorCode<"">;

export type FGetFocusDataErrorCode = TEventErrorCode<
    | "CurrentPanelUndefined"
    | "FocusedVertexUndefined"
>;

export type FGetIsLightModeErrorCode = TEventErrorCode<"">;

export type FGetThemeColorErrorCode = TEventErrorCode<"">;

export type FGetPanelScreenshotsErrorCode = TEventErrorCode<"">;

export type FGetInsertableWindowDataErrorCode = TEventErrorCode<"">;

export type FLogErrorCode = TEventErrorCode<"">;

export type FMaximizeFloatingWindowErrorCode = TEventErrorCode<"">;

export type FMinimizeFloatingWindowErrorCode = TEventErrorCode<"">;

export type FMoveFloatingWindowErrorCode = TEventErrorCode<"">;

export type FNotifyReadyErrorCode = TEventErrorCode<"">;

export type FOnChangeFocusErrorCode = TEventErrorCode<"">;

export type FReadyForRouteErrorCode = TEventErrorCode<"">;

export type FRestoreFloatingWindowErrorCode = TEventErrorCode<"">;

export type FRequestTearDownErrorCode = TEventErrorCode<"">;

export type FUpdateSettingErrorCode = TEventErrorCode<"">;

export type FGetExternalWindowStateErrorCode = TEventErrorCode<"">;

export type FGetFloatingWindowStateErrorCode = TEventErrorCode<"">;

export type FGetSettingsErrorCode = TEventErrorCode<"">;

export type FGetSettingErrorCode = TEventErrorCode<"">;

// #endregion Frontend
// #region Backend

export type FActivateErrorCode = TEventErrorCode<"">;

export type FNavigateErrorCode = TEventErrorCode<"">;

export type FTearDownErrorCode = TEventErrorCode<"">;
// #endregion Backend
