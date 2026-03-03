/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FIpcFrontendEvents,
    FRichEvents,
    FRichFrontendEvents,
    TGetResponseFromKey,
    TGetRichResponseAsFailure,
    TGetRichResponseAsSuccess } from "../Shared/Event";

export type TIpcState<Type extends keyof FIpcFrontendEvents> =
{
    Data: TGetResponseFromKey<Type>["Data"] | undefined;
    Error: TGetResponseFromKey<Type>["Error"] | undefined;
};

export type TIpcStateStrict<Type extends keyof FRichEvents> =
{
    Data: TGetRichResponseAsSuccess<Type>["Data"];
    Error: TGetRichResponseAsFailure<Type>["Error"] | undefined;
};

export type TUseSendIpcEventReturnType<Type extends keyof FIpcFrontendEvents> = Readonly<TIpcState<Type>>;

export type TUseSendIpcEventStrictReturnType<Type extends keyof FRichFrontendEvents> = Readonly<{
    Data: Exclude<TIpcStateStrict<Type>["Data"], undefined>,
    Error: TIpcStateStrict<Type>["Error"]
}>;
