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

import { Struct } from "effect";
import * as Ink from "ink";

export const EmptyKey: Ink.Key =
    {
        upArrow: false,
        downArrow: false,
        leftArrow: false,
        rightArrow: false,
        pageDown: false,
        pageUp: false,
        home: false,
        end: false,
        return: false,
        escape: false,
        ctrl: false,
        shift: false,
        tab: false,
        backspace: false,
        delete: false,
        meta: false,
        super: false,
        hyper: false,
        capsLock: false,
        numLock: false
    } as const;

export const Key = (Self: Partial<Ink.Key>): Ink.Key =>
{
    return Struct.assign(EmptyKey, Self) as Ink.Key;
};
