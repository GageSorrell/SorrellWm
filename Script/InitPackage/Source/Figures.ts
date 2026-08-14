/**
 * Console-glyph overrides for effect's CLI prompts.
 *
 * On Windows, `effect/unstable/cli` renders every answered prompt's leading
 * symbol with a hardcoded "√" (U+221A, square root) rather than the bold
 * ballot checkmark "✔" (U+2714) it uses everywhere else, and it exposes no
 * public option to change that. Its figure set is a single, stable object
 * resolved from the internal `platformFigures` effect and shared by reference
 * across every prompt render, so mutating that object's `tick` once — before
 * any prompt runs — surgically swaps only the checkmark, leaving the other
 * Windows-specific glyphs (pointer, checkbox, and so on) untouched.
 *
 * @module @sorrell/wm-init-package/Figures
 * @internal
 *
 * @file      Figures.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { Prompt } from "effect/unstable/cli";

/**
 * The subset of effect's internal prompt figure set that we override.
 */
interface MutablePromptFigures
{
    tick: string;
}

/**
 * `Prompt.platformFigures` is marked `@internal` and stripped from effect's
 * public type declarations, so reach it through a narrow structural cast
 * rather than the (untyped) namespace member.
 */
const PlatformFigures: Effect.Effect<MutablePromptFigures> =
    (Prompt as unknown as { platformFigures: Effect.Effect<MutablePromptFigures> }).platformFigures;

/**
 * Force effect's CLI prompts to use the bold ballot checkmark "✔" in place of
 * the Windows square-root fallback "√". Idempotent, and a no-op on platforms
 * whose figure set already uses "✔".
 *
 * @returns {void}
 */
export function ForceBoldTickInPrompts(): void
{
    Effect.runSync(PlatformFigures).tick = "✔";
}
