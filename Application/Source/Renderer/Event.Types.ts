/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FIpcFrontendEvents,
    FRichEvents,
    FRichFrontendEvents,
    FSingleRichFrontendEvents,
    TGetErrorCode,
    TGetResponseFromKey,
    TGetRichResponseAsFailure,
    TGetRichResponseAsSuccess,
    TGetSingleRichResponseData} from "!/Event";

export type TIpcState<T extends keyof FIpcFrontendEvents> =
{
    Data: TGetResponseFromKey<T>["Data"] | undefined;
    Error: TGetResponseFromKey<T>["Error"] | undefined;
};

export type TIpcStateStrict<T extends keyof FRichEvents> =
{
    Data: TGetRichResponseAsSuccess<T>["Data"];
    Error: TGetRichResponseAsFailure<T>["Error"] | undefined;
};

export type TUseSendIpcEventReturnType<T extends keyof FIpcFrontendEvents> = Readonly<TIpcState<T>>;

export type TUseSendIpcEventStrictReturnType<T extends keyof FRichFrontendEvents> = Readonly<{
    Data: Exclude<TIpcStateStrict<T>["Data"], undefined>,
    Error: TIpcStateStrict<T>["Error"]
}>;

export type TUseSendIpcEventStrictSingleReturnType<T extends keyof FSingleRichFrontendEvents> =
    Readonly<[ Data: TGetSingleRichResponseData<T>, Error: TGetErrorCode<T> | undefined ]>;
