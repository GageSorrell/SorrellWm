/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, Error, Request, Response } from "./index.js";
import type {
    Channel,
    DeclHasResponseType,
    ErrorPayloadDeclKey,
    ResponseDeclKey,
    RequestDeclKey } from "./Internal/index.js";

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

export type CallbackSuccessReturn<ChannelType extends keyof Registrar, Registrar> =
    DeclHasResponseType<ChannelType, Registrar> extends true
        ? ResponseDeclKey extends keyof Registrar[ChannelType]
            ? Promise<{
                Data: Response<ChannelType, Registrar>;
            }>
            : Promise<never>
        : Promise<void>;

export type CallbackReturn<ChannelType extends keyof Registrar, Registrar> =
    | CallbackSuccessReturn<ChannelType, Registrar>
    | CallbackErrorReturn<ChannelType, Registrar>;

export type AwaitedCallback<ChannelType extends keyof Registrar, Registrar> =
    Awaited<CallbackReturn<ChannelType, Registrar>>;

export type Callback<ChannelType extends keyof Registrar, Registrar> =
    RequestDeclKey extends keyof Registrar[ChannelType]
        ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
            ? () => CallbackReturn<ChannelType, Registrar>
            : (
                (Request: Request<ChannelType, Registrar>) =>
                CallbackReturn<ChannelType, Registrar>
            )
        : never;

/** Use this to define your event callbacks as a record. */
export type CallbackRecord<ChannelType extends keyof Registrar, Registrar> =
    {
        [ Key in ChannelType ]: Callback<Key, Registrar>;
    };

export type RegisterCallback<Registrar> = <ChannelType extends Channel<Registrar>>(
    Channel: ChannelType,
    Callback: Callback<ChannelType, Registrar>
) => void;

export type RegisterCallbacks<Registrar> = <ChannelType extends Channel<Registrar>>(
    Record: CallbackRecord<ChannelType, Registrar>
) => void;

/** @Summary The result returned from `UseSendEvent` or `SendEventDeferred`. */
export type RendererResponse<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar
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
