/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @stylistic/max-len */

/**
 * @module Scoped
 * This export exports everything exported by the main export, as well as
 * everything that is generic and accepts a `PackageKey` type parameter.
 * Everything that is exported here that is not exported by the main export has
 * a "scoped" counterpart defined by the
 * {@link https://electron-reactive-event.sorrell.sh/1.0.0/cli/command-reference#generate | `generate` CLI command}.
 */

export * from "./Channel";
export * from "./Decl";
export * from "./Listener/Listener.Types";
export * from "./Listener/Listener.Unscoped.Types";
export * from "./Main/Main";
export * from "./Main/Main.Types";
export * from "./Renderer";
