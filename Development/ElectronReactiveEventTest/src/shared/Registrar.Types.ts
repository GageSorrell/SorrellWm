/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    EmptyEventParameter,
    EventDecl,
    IMainRegistrarBase,
    IRendererRegistrarBase } from "../../../../Package/ElectronReactiveEvent/Distribution/index.inner";

export interface IMainRegistrar extends IMainRegistrarBase
{
    Notify: EventDecl<
        string,
        EmptyEventParameter,
        "Nah"
    >;
}

export interface IRendererRegistrar extends IRendererRegistrarBase
{
    GetData: EventDecl<
        EmptyEventParameter,
        number,
        "NotFound"
    >;

    SetData: EventDecl<
        number,
        EmptyEventParameter,
        "CouldNotSet"
    >;
}
