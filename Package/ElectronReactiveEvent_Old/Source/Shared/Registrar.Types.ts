/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Internal } from "../Internal/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

export interface IMainRegistrarBase extends Internal.Registrar.IRegistrarBase
{
    Owner: "Main";
}

export interface IRendererRegistrarBase extends Internal.Registrar.IRegistrarBase
{
    Owner: "Renderer";
}

/** The `Owner` of an event declaration is the from whom a given event is sent. */
export type Owner =
    | "Main"
    | "Renderer";
