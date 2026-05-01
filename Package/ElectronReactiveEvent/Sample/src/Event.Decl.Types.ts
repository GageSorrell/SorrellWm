/**
 * @file      Event.Decl.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventDecl, RendererOwner } from "electron-reactive-event";

export type SetColorTemperature = EventDecl<
    RendererOwner,
    number,
    never,
    "TemperatureOutOfRange"
>;
