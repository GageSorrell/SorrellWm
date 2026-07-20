/**
 *
 *
 * @module @sorrell/effect-ink/Field/BigInt
 */

/**
 * @file      BigInt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../Internal/Number.ts";
import type * as _BigInt from "effect/BigInt";
import type { Prompt } from "../index.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Field/BigInt";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface BigInt extends Prompt.Prompt<bigint>
{

}

export interface Options extends Internal.OptionsBase<bigint> { }

export function BigInt(Options: Options): BigInt
{
    return
}
