/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { IsEventDecl } from "./Event.Types.js";
import type { Values } from "./Utility.Types.js";

export type Channel<Registrar extends IRegistrarBase> =
    Exclude<
        keyof Registrar,
        "Owner" | symbol | number
    >;

/** Map a registrar interface to its naturally-corresponding `Record` type. */
export type RegistrarDecls<Registrar> =
    IsRegistrar<Registrar> extends true
        ? {
            [ Key in keyof Registrar as Extract<keyof Registrar, string> ]:
            Registrar[Key];
        }
        : never;

export type IsRegistrar<Registrar> =
    keyof Registrar extends string
        ? IsEventDecl<Values<Registrar>> extends true
            ? true
            : false
        : false;

export type RegistrarOwner =
    | "Main"
    | "Renderer";

export interface IRegistrarBase
{
    Owner: RegistrarOwner;
}
