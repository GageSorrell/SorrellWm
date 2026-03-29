/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * The exports of the package.
 * Most of your time reading the documentation will likely be spent here.
 *
 * @module API
 */

export * as Callback from "./Callback/index.js";
export * as Channel from "./Channel.Types.js";
export * as Event from "./Event.Types.js";
export * as Main from "./Main/index.js";
export * as Renderer from "./Renderer/index.js";
export * as Utility from "./Utility.js";

/** Since these will be imported most frequently, they are not wrapped with a named export. */
export type { EmptyEventParameter, EventDecl } from "./Decl.Types.js";
