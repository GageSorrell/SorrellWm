/**
 * Ink's `Text`, extended with web-style typography.
 *
 * Text that the terminal can represent natively remains ordinary Ink text.
 * A different font or pixel geometry is laid out as SVG and rendered through
 * Sixel at the required number of terminal cells.
 *
 * @module @sorrell/ink-ui/Text
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * from "./Layout.ts";
export * from "./Text.tsx";
