/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FIpcFrontendChannel,
    FIpcFrontendEvents,
    FRichEvents,
    FRichFrontendEvents,
    TGetResponseFromKey,
    TGetRichResponseAsFailure,
    TGetRichResponseAsSuccess,
    TRequest } from "../Shared/Event";
import type { FSimpleCallback } from "../Shared/Utility";
import type { MutableRefObject } from "react";

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

export type TUseSendIpcEventReturnType<Type extends keyof FIpcFrontendEvents> =
    Readonly<TIpcState<Type>>;

export type FSendIpcEventCallback = <ChannelType extends FIpcFrontendChannel>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>
) => FSimpleCallback;

export type FSendIpcEvent = <ChannelType extends FIpcFrontendChannel>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>,
    RemoveListenerRef?: MutableRefObject<FSimpleCallback | undefined>
) => Promise<TIpcState<ChannelType>>;

export type TUseSendIpcEventStrictReturnType<Type extends keyof FRichFrontendEvents> = Readonly<{
    Data: Exclude<TIpcStateStrict<Type>["Data"], undefined>,
    Error: TIpcStateStrict<Type>["Error"]
}>;
