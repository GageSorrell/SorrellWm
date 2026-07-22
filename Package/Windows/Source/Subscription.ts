/**
 * Common types and utilities for events that are subscribed to from the Windows API.
 *
 * @module @sorrell/windows/Event
 *
 * @file      Event.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Brand } from "effect";

/** The callback used between the native and typed message layers. */
export type NativeCallback = (Arg: unknown) => void;

/* eslint-disable @typescript-eslint/naming-convention */

/** The identifier returned for a native message-loop subscription. */
export type Id = Brand.Branded<number, "SubscriptionId">;

/* eslint-enable @typescript-eslint/naming-convention */
