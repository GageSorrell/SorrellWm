/* File:      Utility.Renderer.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { RendererResponse, SendEventDeferredReturn } from "./index.js";

export function IsEventSuccess<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    { Error, IsPending }: RendererResponse<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    { Error }: SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
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
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    Response: RendererResponse<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    Response: SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    Response:
        | RendererResponse<ChannelType, RendererRegistrar>
        | SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean
{
    return !IsEventSuccess(Response);
}
