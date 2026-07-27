/**
 * Query features that the current terminal provides, and
 * define behavior to handle different sets of terminal capabilities.
 * Detectable features include identity, feature, cell-size, mouse,
 * graphics, and font detection.
 *
 * @module @sorrell/ink-ui/Support
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 *
 * @module @sorrell/ink-ui/Support
 */

export * from "./Detect.js";
export * from "./Font.js";
export * from "./Hook.js";
export * from "./Query.js";
export * from "./Types.js";
