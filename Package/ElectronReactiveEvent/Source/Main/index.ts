/* File:      index.Documentation.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * @groupDescription Internal
 * Content used internally by the {@link Main} module.
 * This module (as well as the {@link Hook} module) defines its functions
 * internally, then exports them cast to types that omit the `PackageKey`
 * type parameter.  This way, you do not need to specify the name of your
 * package with every hook call.
 *
 * @module Main
 * The content provided by `electron-reactive-event` to use in `main`.
 *
 * The key entrypoints are {@link Main.getReactiveEventHooks | getReactiveEventHooks} and
 * {@link Main.getReactiveIpcMain | getReactiveIpcMain }.  The surface of the {@link Main}
 * module is much simpler than that of the Renderer module, whose contents are split across
 * the {@link Hook} and {@link Provider} modules.
 */

export * from "./Main";
export * from "./Main.Types";
export * from "./Main.Internal";
export * from "./Main.Internal.Types";
