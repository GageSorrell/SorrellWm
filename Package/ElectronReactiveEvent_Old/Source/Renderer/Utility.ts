/* File:      Utility.Renderer.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type * as Renderer from "./Renderer.Types.js";
import type { Channel } from "../index.js";
import type { Provider } from "./index.js";
import type { Shared } from "../Shared/index.js";

export function IsEventSuccess<
    ChannelType extends Channel.Channel<RendererRegistrar>,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
    { Error, IsPending }: Renderer.Response<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends Channel.Channel<RendererRegistrar>,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
    { Error }: Provider.Send.Deferred.ReturnType<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends Channel.Channel<RendererRegistrar>,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
    Response: (
        | Renderer.Response<ChannelType, RendererRegistrar>
        | Provider.Send.Deferred.ReturnType<ChannelType, RendererRegistrar>
    )
): boolean
{
    return ("IsPending" in Response)
        ? !Response.IsPending && Response.Error === undefined
        : Response.Error === undefined;
}

export function IsEventFailure<
    ChannelType extends Channel.Channel<RendererRegistrar>,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
    Response: Renderer.Response<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends Channel.Channel<RendererRegistrar>,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
    Response: Provider.Send.Deferred.ReturnType<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends Channel.Channel<RendererRegistrar>,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
    Response:
        | Renderer.Response<ChannelType, RendererRegistrar>
        | Provider.Send.Deferred.ReturnType<ChannelType, RendererRegistrar>
): boolean
{
    return !IsEventSuccess(Response);
}
