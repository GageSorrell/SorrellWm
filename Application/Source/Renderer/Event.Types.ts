/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FBackendChannelTagger,
    FFrontendChannelTagger,
    FIpcFrontendChannel,
    FIpcFrontendEvents,
    FRichEvents,
    FRichFrontendEvents,
    TGetResponseFromKey,
    TGetRichResponse,
    TGetRichResponseAsFailure,
    TGetRichResponseAsSuccess,
    TRequest,
    TRichResponseFailure,
    TRichResponseSuccess } from "../Shared/Event";
import type { FSimpleCallback } from "../Shared/Utility";
import type { TInternal } from "./Utility";

export type CEvent = TInternal<{
    Id: number | undefined;
    TagBackend: FBackendChannelTagger;
    TagFrontend: FFrontendChannelTagger;
}>;

export type TIpcStatePending<PendingType extends boolean> =
{
    IsPending: PendingType;
};

export type TIpcState<Type extends keyof FIpcFrontendEvents> =
    TIpcStatePending<boolean> &
    {
        Data: TGetResponseFromKey<Type>["Data"] | undefined;
        Error: TGetResponseFromKey<Type>["Error"] | undefined;
    };

export type TGetRichIpcState<ChannelType extends keyof FRichFrontendEvents> =
    TGetRichResponse<FRichEvents[ChannelType]["Response"]> &
    Pick<TIpcState<ChannelType>, "IsPending">;

export type TGetRichIpcStateAsSuccess<ChannelType extends keyof FRichEvents> =
    TRichResponseSuccess<NonNullable<FRichEvents[ChannelType]["Response"]["Data"]>> &
    TIpcStatePending<false>;

export type TGetRichIpcStateAsFailure<Type extends keyof FRichEvents> =
    TRichResponseFailure<NonNullable<FRichEvents[Type]["Response"]["Error"]>> &
    TIpcStatePending<false>;

export type TIpcStateStrict<Type extends keyof FRichEvents> =
    TIpcStatePending<boolean> &
    {
        Data: TGetRichResponseAsSuccess<Type>["Data"];
        Error: TGetRichResponseAsFailure<Type>["Error"] | undefined;
    };

export type TUseSendIpcEventReturnType<Type extends keyof FIpcFrontendEvents> = Readonly<TIpcState<Type>>;

export type FSendIpcEventCallback = <ChannelType extends FIpcFrontendChannel>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>
) => FSimpleCallback;

export type FSendIpcEvent = <ChannelType extends FIpcFrontendChannel>(
    Channel: ChannelType,
    Request: TRequest<ChannelType>
) => Promise<TIpcState<ChannelType>>;

export type TUseSendIpcEventStrictReturnType<Type extends keyof FRichFrontendEvents> = Readonly<
    TIpcStatePending<boolean> &
    {
        Data: Exclude<TIpcStateStrict<Type>["Data"], undefined>,
        Error: TIpcStateStrict<Type>["Error"],
    }
>;
