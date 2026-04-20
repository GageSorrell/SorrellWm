/**
 * @file      Event.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    FIpcFrontendChannel,
    FPoorBackendEvents,
    FPoorResponseAsSuccess,
    TEventCallback,
    TPoorResponseAsFailure
} from "../../Shared";

export type TIpcCallback<ChannelType extends FIpcFrontendChannel = FIpcFrontendChannel> =
{
    Channel: ChannelType;
    Callback: TEventCallback<ChannelType>;
};

export type TPoorEventResponse<Type extends keyof FPoorBackendEvents> =
    | FPoorResponseAsSuccess
    | TPoorResponseAsFailure<Type>;
