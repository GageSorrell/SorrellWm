/* File:      EventErrorCodes.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FUnspecifiedErrorCode = "UnspecifiedError";

export type FUnknownErrorCode =
    | FUnspecifiedErrorCode
    | string;

type TEventErrorCode<T extends string> = T | FUnspecifiedErrorCode;

export type FActivateErrorCode = TEventErrorCode<"">;

export type FTearDownErrorCode = TEventErrorCode<"">;

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

export type FOnChangeFocusErrorCode = TEventErrorCode<"">;

export type FReadyForRouteErrorCode = TEventErrorCode<"">;

export type FRequestTearDownErrorCode = TEventErrorCode<"">;

export type FGetSettingsErrorCode = TEventErrorCode<"">;

export type FGetSettingErrorCode = TEventErrorCode<"">;
