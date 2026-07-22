/**
 *
 *
 * @module @sorrell/wm/Main/Utility/Function
 *
 * @file      Function.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Array, Effect, pipe } from "effect";

export const MakeFnTracer = (TypeId: string) =>
    (...Labels: ReadonlyArray<string>) => Effect.fn(pipe(Labels, Array.prepend(TypeId), Array.join("!")));
