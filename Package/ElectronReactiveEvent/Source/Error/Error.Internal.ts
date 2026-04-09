/* File:      Error.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    ReactiveEventErrorDataInternal,
    ReactiveEventErrorMessage,
    ReactiveEventErrorPayload } from "./Error.Internal.Types";
import type { Channel } from "../Channel";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import type { PackageKeys } from "../Internal";

/**
 * Describes an error of an event.  This is used by `handle`, and is translated
 * into the response given to the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export class ReactiveEventErrorInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.ErrorMessageOnly<PackageKey>
>
{
    public constructor(Data: ReactiveEventErrorDataInternal<PackageKey, ChannelType>)
    {
        this.Message = Data.Message;
        this.Payload = Data.Payload;
    }

    public Message: ReactiveEventErrorMessage<PackageKey, ChannelType>;
    public Payload:
        | ReactiveEventErrorPayload<PackageKey, ChannelType>
        | EmptyOverloadParameter;
};
