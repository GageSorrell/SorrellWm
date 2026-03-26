/* File:      Utility.Renderer.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IRendererRegistrarBase, RendererResponse, SendEventDeferredReturn } from "./index.js";
import type { Channel } from "./Internal/index.js";

export function IsEventSuccess<
    ChannelType extends Channel<RendererRegistrar>,
    RendererRegistrar extends IRendererRegistrarBase
>(
    { Error, IsPending }: RendererResponse<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends Channel<RendererRegistrar>,
    RendererRegistrar extends IRendererRegistrarBase
>(
    { Error }: SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends Channel<RendererRegistrar>,
    RendererRegistrar extends IRendererRegistrarBase
>(
    Response: (
        | RendererResponse<ChannelType, RendererRegistrar>
        | SendEventDeferredReturn<ChannelType, RendererRegistrar>
    )
): boolean
{
    return ("IsPending" in Response)
        ? !Response.IsPending && Response.Error === undefined
        : Response.Error === undefined;
}

export function IsEventFailure<
    ChannelType extends Channel<RendererRegistrar>,
    RendererRegistrar extends IRendererRegistrarBase
>(
    Response: RendererResponse<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends Channel<RendererRegistrar>,
    RendererRegistrar extends IRendererRegistrarBase
>(
    Response: SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends Channel<RendererRegistrar>,
    RendererRegistrar extends IRendererRegistrarBase
>(
    Response:
        | RendererResponse<ChannelType, RendererRegistrar>
        | SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean
{
    return !IsEventSuccess(Response);
}
