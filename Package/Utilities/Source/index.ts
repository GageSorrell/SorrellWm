/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * @module
 * General-purpose utility types and functions.
 * This module barrel-exports each scoped export of this package.
 * Use the scoped exports of this package to access only specific
 * utilities (*e.g.*, `async`, `npm`, *etc.*).
 */

export * as Array from "./Array/index.ts";
export * as Async from "./Async/index.ts";
export * as FileSystem from "./FileSystem/index.ts";
export * as Functional from "./Functional/index.ts";
export * as Npm from "./Npm/index.ts";
export * as Number from "./Number/index.ts";
export * as NumberExperimental from "./Number/Index.Experimental.ts";
export * as String from "./String/index.ts";
export * as Miscellaneous from "./Miscellaneous/index.ts";
