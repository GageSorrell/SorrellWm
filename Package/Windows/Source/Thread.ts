/**
 *
 *
 * @module @sorrell/windows/Thread
 *
 * @file      Thread.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Brand } from "effect";
import type { UInt } from "@sorrell/math";

/** A thread identifier. */
export type ThreadId = Brand.Branded<UInt.UInt, "ThreadId">;
