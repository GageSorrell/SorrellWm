/**
 * @file      Provider.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactiveEventContext } from "./Provider.Types";

/**
 * The context used by the hooks in this package.
 * It is currently just {@link ReactiveEventContext}, but it may
 * be expanded in the future.
 *
 * @group Internal
 */
export type ReactiveEventContextInternal = ReactiveEventContext;
