/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * Functions (hooks and factories) for sending and receiving
 * events in the `renderer`.
 *
 * Most of these functions are given by factories, to which
 * you pass your registrar types.  These registrar types are
 * passed to the returned functions, so that the registrar
 * types only need to be given once.
 *
 * @module
 */

export * as Hook from "./Hook/index.js";
export * as Preload from "./Preload/index.js";
export * as Provider from "./Provider/index.js";
export * as Utility from "./Utility.js";
