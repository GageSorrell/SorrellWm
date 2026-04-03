/* File:      Channel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter } from "./index.js";
import type { Internal } from "./Internal/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

type EquipEventDeclWithName<Registrar> =
    {
        [ Key in keyof Registrar as Extract<Key, string> ]:
        Internal.Utility.Values<Registrar> &
        {
            Name: Extract<Key, string>;
        }
    };

type RegistrarWithNames<Registrar> = Internal.Utility.Values<EquipEventDeclWithName<Registrar>>;

interface IEventDeclNoResponse
{
    ResponseDeclType: EmptyEventParameter;
}

/** Channels whose event declarations define a response type. */
export type Response<Registrar> =
    Exclude<
        RegistrarWithNames<Registrar>,
        IEventDeclNoResponse
    >;

/** Channels whose event declarations do *not* define a response type. */
export type NoResponse<Registrar> =
    Extract<
        RegistrarWithNames<Registrar>,
        IEventDeclNoResponse
    >;

type WithRequestHelper<Registrar> =
    {
        [ Key in keyof Registrar ]:
        Internal.Event.RequestDeclKey extends keyof Registrar[Key]
            ? EmptyEventParameter extends Registrar[Key][Internal.Event.RequestDeclKey]
                ? undefined
                : Key
            : never
    };

/** Channels whose event declarations specify a request type. */
export type Request<Registrar extends Internal.Registrar.IRegistrarBase> =
    Extract<
        Channel<Registrar>,
        Internal.Utility.Values<WithRequestHelper<Registrar>>
    >;

/** Channels whose event declarations do *not* specify a request type. */
export type NoRequest<Registrar extends Internal.Registrar.IRegistrarBase> =
    Extract<
        Channel<Registrar>,
        WithRequestHelper<Registrar>
    >;

/** A channel is the (`string`) key of an event declaration property in a registrar. */
export type Channel<Registrar extends Internal.Registrar.IRegistrarBase> =
    Exclude<
        keyof Registrar,
        "Owner" | symbol | number
    >;

