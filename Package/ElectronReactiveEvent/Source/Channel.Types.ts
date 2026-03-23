/* File:      Channel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { EmptyEventParameter } from "./index.js";
import type { Values } from "./Internal/index.js";

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
