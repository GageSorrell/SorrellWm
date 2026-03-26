/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, Error, IRendererRegistrarBase, Response } from "./index.js";
import type {
    Channel,
    DeclHasResponseType,
    ErrorPayloadDeclKey,
    ResponseDeclKey,
    RequestDeclKey,
    RendererCallbackArgumentBase,
    MainCallbackArgumentBase,
    CallbackArgumentRequestPart,
    IRegistrarBase,
    RegistrarOwner} from "./Internal/index.js";

export type CallbackErrorReturn<
    ChannelType extends keyof Registrar,
    Registrar
> =
    ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
        ? ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
            ? [ Registrar[ChannelType][ErrorPayloadDeclKey] ] extends [ never ]
                ? Promise<{
                    Error: string;
                }>
                : Promise<{
                    Error:
                    {
                        Message: string;
                        Payload: Registrar[ChannelType][ErrorPayloadDeclKey];
                    }
                }>
            : never
        : never;

export type CallbackSuccessReturn<
    ChannelType extends Channel<Registrar>,
    Registrar extends IRegistrarBase
> =
    DeclHasResponseType<ChannelType, Registrar> extends true
        ? ResponseDeclKey extends keyof Registrar[ChannelType]
            ? Promise<{
                Data: Response<ChannelType, Registrar>;
            }>
            : Promise<never>
        : Promise<void>;

export type CallbackReturn<
    ChannelType extends Channel<Registrar>,
    Registrar extends IRegistrarBase
> =
    | CallbackSuccessReturn<ChannelType, Registrar>
    | CallbackErrorReturn<ChannelType, Registrar>;

export type AwaitedCallback<
    ChannelType extends Channel<Registrar>,
    Registrar extends IRegistrarBase
> =
    Awaited<CallbackReturn<ChannelType, Registrar>>;

// export type Callback<ChannelType extends keyof Registrar, Registrar> =
//     RequestDeclKey extends keyof Registrar[ChannelType]
//         ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
//             ? () => CallbackReturn<ChannelType, Registrar>
//             : (
//                 (Request: Request<ChannelType, Registrar>) =>
//                 CallbackReturn<ChannelType, Registrar>
//             )
//         : never;

// /** `RendererCallback`s live under the `renderer`, *i.e.*, they receive `main` events. */
// export type RendererCallback<ChannelType extends keyof Registrar, Registrar> =
//     RequestDeclKey extends keyof Registrar[ChannelType]
//         ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
//             ? (
//                 | (() => CallbackReturn<ChannelType, Registrar>)
//                 | ((Event: IpcMainEvent) => CallbackReturn<ChannelType, Registrar>)
//             )
//             : (
//                 | ((Request: Request<ChannelType, Registrar>) => CallbackReturn<ChannelType, Registrar>)
//                 | ((
//                     Event: IpcMainEvent,
//                     Request: Request<ChannelType, Registrar>
//                 ) => CallbackReturn<ChannelType, Registrar>)
//             )
//         : never;

export type RendererCallbackArgument<ChannelType extends keyof Registrar, Registrar> =
    RequestDeclKey extends keyof Registrar[ChannelType]
        ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
            ? RendererCallbackArgumentBase
            : (
                RendererCallbackArgumentBase &
                CallbackArgumentRequestPart<ChannelType, Registrar>
            )
        : RendererCallbackArgumentBase;

export type MainCallbackArgument<ChannelType extends Channel<Registrar>, Registrar extends IRegistrarBase> =
    RequestDeclKey extends keyof Registrar[ChannelType]
        ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
            ? MainCallbackArgumentBase
            : (
                MainCallbackArgumentBase &
                CallbackArgumentRequestPart<ChannelType, Registrar>
            )
        : MainCallbackArgumentBase;

/** `MainCallback`s live under `main`, *i.e.*, they receive `renderer` events. */
export type MainCallback<ChannelType extends Channel<Registrar>, Registrar extends IRegistrarBase> =
    (Argument: MainCallbackArgument<ChannelType, Registrar>)
        => CallbackReturn<ChannelType, Registrar>;

/** `RendererCallback`s live under the `renderer`, *i.e.*, they receive `main` events. */
export type RendererCallback<
    ChannelType extends Channel<Registrar>,
    Registrar extends IRegistrarBase
> =
    (Argument: RendererCallbackArgument<ChannelType, Registrar>)
        => CallbackReturn<ChannelType, Registrar>;

export type Callback<
    ChannelType extends Channel<Registrar>,
    Owner extends RegistrarOwner,
    Registrar extends IRegistrarBase
> =
    "Renderer" extends Owner
        ? MainCallback<ChannelType, Registrar>
        : RendererCallback<ChannelType, Registrar>;

/** Use this to define your event callbacks as a record. */
export type CallbackRecord<
    ChannelType extends Channel<Registrar>,
    Owner extends RegistrarOwner,
    Registrar extends IRegistrarBase
> =
    {
        [ Key in ChannelType ]: Owner extends "Renderer"
            ? MainCallback<Key, Registrar>
            : RendererCallback<Key, Registrar>;
    };

export type MainRegisterCallback<Registrar extends IRegistrarBase> =
    <ChannelType extends Channel<Registrar>>(
        Channel: ChannelType,
        Callback: MainCallback<ChannelType, Registrar>
    ) => void;

export type RendererRegisterCallback<Registrar extends IRegistrarBase> =
    <ChannelType extends Channel<Registrar>>(
        Channel: ChannelType,
        Callback: RendererCallback<ChannelType, Registrar>
    ) => void;

export type RegisterCallbacks<Owner extends RegistrarOwner, Registrar extends IRegistrarBase> =
    <ChannelType extends Channel<Registrar>>(
        Record: CallbackRecord<ChannelType, Owner, Registrar>
    ) => void;

/** @Summary The result returned from `UseSendEvent` or `SendEventDeferred`. */
export type RendererResponse<
    ChannelType extends Channel<RendererRegistrar>,
    RendererRegistrar extends IRendererRegistrarBase
> =
    DeclHasResponseType<ChannelType, RendererRegistrar> extends true
        ? ResponseDeclKey extends keyof RendererRegistrar[ChannelType]
            ? (
                | Readonly<{
                    Data: undefined;
                    Error: undefined;
                    IsPending: true;
                }>
                | Readonly<{
                    Data: Response<ChannelType, RendererRegistrar>;
                    Error: undefined;
                    IsPending: false;
                }>
                | Readonly<{
                    Data: undefined;
                    Error: Error<ChannelType, RendererRegistrar>;
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
                Error: Error<ChannelType, RendererRegistrar>;
                IsPending: false;
            }>
        );
