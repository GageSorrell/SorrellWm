/* File:      Renderer.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback, Channel, Event } from "../index.js";
import type { Internal } from "../Internal/index.js";

/* eslint-disable @typescript-eslint/naming-convention */

/** The result returned from `UseSendEvent` or `SendEventDeferred`. */
export type Response<
    ChannelType extends Channel.Channel<RendererRegistrar>,
    RendererRegistrar extends Internal.Registrar.IRegistrarBase
> =
    Internal.Factory.DeclHasResponseType<ChannelType, RendererRegistrar> extends true
        ? Internal.Event.ResponseDeclKey extends keyof RendererRegistrar[ChannelType]
            ? (
                | Readonly<{
                    Data: undefined;
                    Error: undefined;
                    IsPending: true;
                }>
                | Readonly<{
                    Data: Event.Response<ChannelType, RendererRegistrar>;
                    Error: undefined;
                    IsPending: false;
                }>
                | Readonly<{
                    Data: undefined;
                    Error: Callback.ReturnType.Error<ChannelType, RendererRegistrar>;
                    IsPending: false;
                }>
            )
            : never
        : (
            | Readonly<{
                Error: undefined;
                IsPending: true;
            }>
            | Readonly<{
                Error: Callback.ReturnType.Error<ChannelType, RendererRegistrar>;
                IsPending: false;
            }>
        );

