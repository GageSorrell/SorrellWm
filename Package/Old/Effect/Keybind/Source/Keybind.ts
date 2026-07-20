/**
 * The main implementation of this package.
 *
 * @module @sorrell/effect-keybind/Keybind
 */

/**
 * @file      Keybind.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Queue } from "effect";

const TypeIdKey: string = "~sorrell/effect-keybind";
const TypeId: unique symbol = Symbol.for(TypeIdKey);
type TypeId = typeof TypeId;

export interface Keybind
{

}

export interface Impl
{
    readonly Subscribe: (Listener: (Key: ) => void) => void;
}

export const Make = <KeyEventType>(InQueue: Queue.Dequeue<KeyEventType>): Impl =>
{

};
