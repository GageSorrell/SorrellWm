/* File:      ReactiveIpc.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PackageKey } from "../Reactive.Generated";
import { getReactiveIpcFunctions } from "electron-reactive-event";

const {
    addListener: AddListener,
    handle: Handle,
    handleOnce: HandleOnce,
    off: Off,
    on: On,
    once: Once,
    removeAllListeners: RemoveAllListeners,
    removeHandler: RemoveHandler,
    removeListener: RemoveListener
} = getReactiveIpcFunctions<PackageKey>();

export const addListener: typeof AddListener = AddListener;
export const handle: typeof Handle = Handle;
export const handleOnce: typeof HandleOnce = HandleOnce;
export const off: typeof Off = Off;
export const on: typeof On = On;
export const once: typeof Once = Once;
export const removeAllListeners: typeof RemoveAllListeners = RemoveAllListeners;
export const removeHandler: typeof RemoveHandler = RemoveHandler;
export const removeListener: typeof RemoveListener = RemoveListener;
