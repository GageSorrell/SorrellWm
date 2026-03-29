/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

import type { IsEventDecl } from "./Event.Types.js";
import type { Shared } from "../Shared/index.js";
import type { Values } from "./Utility.Types.js";

export interface IRegistrarBase
{
    Owner: Shared.Registrar.Owner;
}

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

export type RendererOwnerKey = "Renderer";
export type MainOwnerKey = "Main";
