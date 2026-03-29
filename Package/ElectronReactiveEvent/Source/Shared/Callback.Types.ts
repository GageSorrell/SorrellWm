/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel, Event } from "../index.js";
import type { IpcMainInvokeEvent, IpcRendererEvent } from "electron";
import type { Internal } from "../Internal/index.js";
import type { Shared } from "./index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

export namespace Argument
{
    export namespace Base
    {
        export type Main =
            {
                Event: IpcMainInvokeEvent;
            };

        export type Renderer =
            {
                Event: IpcRendererEvent;
            };
    }

    export type Base<Registrar extends Internal.Registrar.IRegistrarBase> =
        Registrar extends Shared.Registrar.IMainRegistrarBase
            ? Base.Main
            : Base.Renderer;

    export type RequestPart<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        {
            Request: Event.Request<ChannelType, Registrar>;
        };
}
