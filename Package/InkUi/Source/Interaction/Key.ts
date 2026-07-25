/**
 *
 *
 * @module @sorrell/ink-ui/Interaction/Key
 *
 * @file      Key.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Ink from "ink";
import { Struct } from "effect";

export const EmptyKey: Ink.Key =
    {
        downArrow: false,
        leftArrow: false,
        rightArrow: false,
        upArrow: false,

        pageDown: false,
        pageUp: false,

        end: false,
        home: false,

        backspace: false,
        capsLock: false,
        ctrl: false,
        delete: false,
        escape: false,
        hyper: false,
        meta: false,
        numLock: false,
        return: false,
        shift: false,
        super: false,
        tab: false
    } as const;

export const Key = (Self: Partial<Ink.Key>): Ink.Key =>
{
    return Struct.assign(EmptyKey, Self) as Ink.Key;
};
