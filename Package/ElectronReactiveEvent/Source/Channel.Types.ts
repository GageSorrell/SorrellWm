/* File:      Channel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { EmptyEventParameter } from "./index.js";
import type { Channel, IRegistrarBase, RequestDeclKey, Values } from "./Internal/index.js";

type EquipEventDeclWithName<Registrar> =
    {
        [ Key in keyof Registrar as Extract<Key, string> ]:
        Values<Registrar> &
        {
            Name: Extract<Key, string>;
        }
    };

type RegistrarWithNames<Registrar> = Values<EquipEventDeclWithName<Registrar>>;

interface IEventDeclNoResponse
{
    ResponseDeclType: EmptyEventParameter;
}

/** @Summary Channels whose event declarations define a response type. */
export type ResponseChannel<Registrar> =
    Exclude<
        RegistrarWithNames<Registrar>,
        IEventDeclNoResponse
    >;

/** @Summary Channels whose event declarations do *not* define a response type. */
export type NoResponseChannel<Registrar> =
    Extract<
        RegistrarWithNames<Registrar>,
        IEventDeclNoResponse
    >;

type ChannelsWithRequestHelper<Registrar> =
    {
        [ Key in keyof Registrar ]:
        RequestDeclKey extends keyof Registrar[Key]
            ? EmptyEventParameter extends Registrar[Key][RequestDeclKey]
                ? undefined
                : Key
            : never
    };

/** @Summary Channels whose event declarations specify a request type. */
export type RequestChannel<Registrar extends IRegistrarBase> =
    Extract<
        Channel<Registrar>,
        Values<ChannelsWithRequestHelper<Registrar>>
    >;

/** @Summary Channels whose event declarations do *not* specify a request type. */
export type NoRequestChannel<Registrar extends IRegistrarBase> =
    Extract<
        Channel<Registrar>,
        ChannelsWithRequestHelper<Registrar>
    >;
