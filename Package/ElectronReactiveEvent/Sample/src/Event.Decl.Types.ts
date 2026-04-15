/* File:      Event.Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventDecl, RendererOwner } from "electron-reactive-event";

export type SetColorTemperature = EventDecl<
    RendererOwner,
    number,
    EmptyEventParameter,
    "TemperatureOutOfRange"
>;
