/* File:      index.inner.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * This module barrel exports the contents of the `Shared` directory,
 * so that importing the `index.js` module gives a single object `Shared`.
 *
 * @module Shared
 */

export type * as Callback from "./Callback.Types.js";
export type * as Function from "./Function.Types.js";
export type * as Registrar from "./Registrar.Types.js";
