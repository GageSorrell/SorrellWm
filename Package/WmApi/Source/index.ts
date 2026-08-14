/**
 * Public exports for `@sorrell/wm-api`: general-purpose, transport-agnostic types for
 * automating SorrellWm. Free of any MCP-specific knowledge — that lives in the `@sorrell/wm`
 * application itself.
 *
 * @module @sorrell/wm-api
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * as Mouse from "./Mouse.js";
export * as Tiling from "./Tiling.js";
export * as Window from "./Window.js";
