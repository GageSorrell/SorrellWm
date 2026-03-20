/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIsEventDecl } from "./Event.Types";

export type TChannel<
    EventRegistrarType extends Record<KeyType, unknown>,
    KeyType extends string = Extract<keyof EventRegistrarType, string>
> = keyof EventRegistrarType extends string
    ? keyof EventRegistrarType
    : never;

/** Map a registrar interface to its naturally-corresponding `Record` type. */
export type TRegistrarDecls<EventRegistrarType> =
    TIsRegistrar<EventRegistrarType> extends true
        ? {
            [ Key in keyof EventRegistrarType as Extract<keyof EventRegistrarType, string> ]:
            EventRegistrarType[Key];
        }
        : never;

export type TIsRegistrar<EventRegistrarType> =
    keyof EventRegistrarType extends string
        ? TIsEventDecl<EventRegistrarType[keyof EventRegistrarType]> extends true
            ? true
            : false
        : false;
