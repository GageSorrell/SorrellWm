/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IRegistrarBase } from "./Internal/index.js";

export interface IMainRegistrarBase extends IRegistrarBase
{
    Owner: "Main";
}

export interface IRendererRegistrarBase extends IRegistrarBase
{
    Owner: "Renderer";
}
