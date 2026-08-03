/**
 * Function utilities for traced Effect operations.
 *
 * @module @sorrell/wm/Main/Utility/Function
 *
 * @file      Function.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Array, Effect, pipe } from "effect";

export/**
       * Wraps `Effect.fn` and applies the given `TypeId` *et al.* as a prefix
       * to the tracer label.
       *
       * @category Utility
       * @since 0.1.0
       */
const MakeFnTracer = (TypeId: string) =>
    (...Labels: ReadonlyArray<string>) => Effect.fn(pipe(Labels, Array.prepend(TypeId), Array.join("!")));
