/**
 * @file      EventErrorCodes.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
