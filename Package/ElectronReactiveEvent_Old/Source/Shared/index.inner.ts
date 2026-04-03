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

/** Types for callbacks, used internally and in the exported API. */
export type * as Callback from "./Callback.Types.js";

/** Types of functions, their arguments, and return values. */
export type * as Function from "./Function.Types.js";

/** Types used for working with registrar interfaces. */
export type * as Registrar from "./Registrar.Types.js";
