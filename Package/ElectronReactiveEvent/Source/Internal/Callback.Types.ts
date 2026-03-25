/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcMainInvokeEvent, IpcRendererEvent } from "electron";
import type { Callback, MainCallback, RendererCallback, Request } from "../index.js";
import type { RequestDeclKey } from "./index.js";

export type MainCallbackArgumentBase =
{
    Event: IpcMainInvokeEvent;
};

export type RendererCallbackArgumentBase =
{
    Event: IpcRendererEvent;
};

// export type RendererCallbackArgumentInternal<ChannelType extends keyof Registrar, Registrar> =
//     RequestDeclKey extends keyof Registrar[ChannelType]
//         ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
//             ? EmptyEventParameter
//             :  RendererCallbackArgumentBase
//         : (
//             RendererCallbackArgumentBase &
//             {
//                 Request: Request<ChannelType, Registrar>
//             }
//         );

// export type MainCallbackArgument<ChannelType extends keyof Registrar, Registrar> =
//     RequestDeclKey extends keyof Registrar[ChannelType]
//         ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
//             ? EmptyEventParameter
//             :  MainCallbackArgumentBase
//         : (
//             MainCallbackArgumentBase &
//             {
//                 Request: Request<ChannelType, Registrar>
//             }
//         );

export type CallbackArgumentRequestPart<ChannelType extends keyof Registrar, Registrar> =
{
    Request: Request<ChannelType, Registrar>;
};

export type RendererCallbackArgumentInternal<ChannelType extends keyof Registrar, Registrar> =
    RendererCallbackArgumentBase &
    CallbackArgumentRequestPart<ChannelType, Registrar>;

export type MainCallbackArgumentInternal<ChannelType extends keyof Registrar, Registrar> =
    MainCallbackArgumentBase &
    CallbackArgumentRequestPart<ChannelType, Registrar>;

export type MainCallbackInternal<ChannelType extends keyof Registrar, Registrar> =
    (Argument: MainCallbackArgumentInternal<ChannelType, Registrar>)
        => ReturnType<MainCallback<ChannelType, Registrar>>;

export type RendererCallbackInternal<ChannelType extends keyof Registrar, Registrar> =
    (Argument: RendererCallbackArgumentInternal<ChannelType, Registrar>)
        => ReturnType<RendererCallback<ChannelType, Registrar>>;
