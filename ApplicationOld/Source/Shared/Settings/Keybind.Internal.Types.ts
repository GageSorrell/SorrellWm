/**
 * @file      Keybind.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { FKeybindDisplayNames } from "./Keybind.Types";

/**
 * The type used to construct {@link FKeybindDisplayNames}.
 */
export type TRecurrence<Type> =
    Type extends Record<PropertyKey, Record<PropertyKey, unknown>>
        ? {
            [ Key in keyof Type ]: TRecurrence<Type[Key]>;
        }
        : Type extends Record<PropertyKey, unknown>
            ? {
                [ Key in keyof Type ]: string;
            }
            : string;
