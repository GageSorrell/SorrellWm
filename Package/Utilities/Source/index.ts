/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * @module
 * General-purpose utility types and functions.
 * This module barrel-exports each scoped export of this package.
 * Use the scoped exports of this package to access only specific
 * utilities (*e.g.*, `async`, `npm`, *etc.*).
 */

export * as Async from "./Async/index.js";
export * as FileSystem from "./FileSystem/index.js";
export * as Functional from "./Functional/index.js";
export * as Npm from "./Npm/index.js";
export * as String from "./String/index.js";
export * as Utility from "./Utility/index.js";
