/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * Functions for sending and receiving events in `main`.
 *
 * Most of these functions are given by factories, to which
 * you pass your registrar types.  These registrar types are
 * passed to the returned functions, so that the registrar
 * types only need to be given once.
 *
 * @module
 */

export * from "./Main.js";
export * from "./Main.Types.js";
