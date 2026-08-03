/**
 * Windows API types and operations for time.
 *
 * @module @sorrell/windows/Time
 *
 * @file      Time.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Brand, DateTime } from "effect";
import type { UInt } from "@sorrell/math";
import { uptime } from "node:os";

/** A point in time, measured by the Windows API based upon the machine's uptime. */
export type Time = Brand.Branded<number, "Time">;

export/** {@inheritDoc Time:type} */
const Time = Brand.make(Number.isSafeInteger);

const TickPeriod = 2 ** 32;

export/**
       * Get a `DateTime.Utc` from a `Time` returned by the Windows API that represents
       * the time since the machine booted.
       */
const ToDateTime = (Time: UInt.UInt): DateTime.Utc =>
{
    const CurrentUptime = Math.round(uptime() * 1_000);
    const CurrentTick = CurrentUptime % TickPeriod;

    const EventAge =
        (CurrentTick - Time + TickPeriod) % TickPeriod;

    return DateTime.makeUnsafe(Date.now() - EventAge);
};
