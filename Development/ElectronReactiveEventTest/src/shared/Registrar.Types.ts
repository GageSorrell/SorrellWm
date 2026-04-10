/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { EmptyEventParameter, EventDecl, MainOwner, RendererOwner } from "electron-reactive-event";

export type Notify = EventDecl<
    MainOwner,
    string,
    EmptyEventParameter,
    "Nah"
>;

export type GetData = EventDecl<
    RendererOwner,
    boolean
>;

export type GetDataPayload = EventDecl<
    RendererOwner,
    { RequestProperty: Record<PropertyKey, unknown>; },
    EmptyEventParameter,
    [ "NotFound", number ]
>;

export type GetDataFoo = EventDecl<
    RendererOwner,
    { RequestProperty: Record<PropertyKey, unknown>; }
>;

export type SetData = EventDecl<
    RendererOwner,
    number,
    { Foo: boolean; },
    "CouldNotSet"
>;
