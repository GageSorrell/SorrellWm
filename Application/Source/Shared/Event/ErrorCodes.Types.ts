/* File:      EventErrorCodes.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FUnspecifiedErrorCode = "UnspecifiedError";

export type FUnknownErrorCode =
    | FUnspecifiedErrorCode
    | string;

export type TEventErrorCode<Type extends string> = Type | FUnspecifiedErrorCode;

// #region Frontend

// #endregion Frontend
// #region Backend

// #endregion Backend
