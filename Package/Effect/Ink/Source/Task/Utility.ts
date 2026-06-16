/**
 * Utilities for the {@link \@sorrell/effect-ink/Task} module.
 *
 * @module @sorrell/effect-ink/Task/Utility
 */

import type { Brand } from "effect";

/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type HandleArgument<HandleType extends Brand.Branded<symbol, string>> =
    | HandleType
    | string;
