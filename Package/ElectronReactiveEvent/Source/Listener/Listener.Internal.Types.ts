/* File:      Listener.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { RawResponse, Request } from "./Listener.Types";
import type { Channel } from "../Channel";
import type { EmptyOverloadParameterValue } from "./Listener.Internal";
import type { IpcMainInvokeEvent } from "electron/main";
import type { PackageKeys } from "../Internal";
import type { RendererOwner } from "../Decl";

/** This type is used internally by overloaded (private) signatures. */
export type EmptyOverloadParameter = typeof EmptyOverloadParameterValue;

/**
 * The base type for {@link Handler | handlers}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type HandlerInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    {
        (
            event: IpcMainInvokeEvent,
            request: Request<PackageKey, RendererOwner, ChannelType>
        ): Promise<RawResponse<PackageKey, ChannelType>>;
    };
