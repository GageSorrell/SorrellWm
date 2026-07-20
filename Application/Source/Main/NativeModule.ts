/**
 *
 *
 * @module @sorrell/wm/Main/NativeModule
 *
 * @file      NativeModule.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { createRequire } from "node:module";

const requireFromApplication: NodeJS.Require = createRequire(import.meta.url);

/**
 * Loads a CommonJS or Node-API native addon from the packaged application.
 *
 * Native packages must be installed in `dependencies` so electron-builder can
 * collect and rebuild them for Electron's ABI.
 *
 * @param Specifier - The package name or path accepted by Node's `require`.
 * @returns {NativeModuleType} The loaded native module.
 */
export function loadNativeModule<NativeModuleType>(Specifier: string): NativeModuleType
{
    return requireFromApplication(Specifier) as NativeModuleType;
}
