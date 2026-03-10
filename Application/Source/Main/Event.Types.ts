/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FIpcFrontendChannel,
    FPoorBackendEvents,
    FPoorResponseAsSuccess,
    TEventCallback,
    TPoorResponseAsFailure
} from "../Shared/Event";

export type TIpcCallback<ChannelType extends FIpcFrontendChannel = FIpcFrontendChannel> =
{
    Channel: ChannelType;
    Callback: TEventCallback<ChannelType>;
};

export type TPoorEventResponse<Type extends keyof FPoorBackendEvents> =
    | FPoorResponseAsSuccess
    | TPoorResponseAsFailure<Type>;
