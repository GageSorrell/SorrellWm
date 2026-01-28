/* File:      EventErrorCodes.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FUnspecifiedErrorCode = "UnspecifiedError";
type TEventErrorCode<T extends string> = T | FUnspecifiedErrorCode;

export type FActivateErrorCode = TEventErrorCode<"">;

export type FTearDownErrorCode = TEventErrorCode<"">;

export type FBringIntoPanelErrorCode = TEventErrorCode<"">;

export type FGetAnnotatedPanelsErrorCode = TEventErrorCode<"">;

export type FGetCurrentPanelErrorCode = TEventErrorCode<"">;

export type FGetFocusDataErrorCode = TEventErrorCode<"">;

export type FGetPanelScreenshotsErrorCode = TEventErrorCode<"">;

export type FGetInsertableWindowDataErrorCode = TEventErrorCode<"">;

export type FLogErrorCode = TEventErrorCode<"">;

export type FOnChangeFocusErrorCode = TEventErrorCode<"">;

export type FReadyForRouteErrorCode = TEventErrorCode<"">;

