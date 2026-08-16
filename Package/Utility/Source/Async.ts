/**
 *
 *
 * @module @sorrell/utility/Async
 *
 * @file      Async.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Thunk } from "@sorrell/effect/Function";

export/**
       * Return a promise that resolves to `void` after {@link Duration} milliseconds.
       *
       * @category Utility
       * @since 1.3.2
       */
const Sleep = (Duration: number) => new Promise<void>((Resolve: Thunk) => setTimeout(Resolve, Duration));
