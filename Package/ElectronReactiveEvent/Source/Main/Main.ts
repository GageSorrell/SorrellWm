/* File:      Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Handle, HandleOnce, Off, On, Once, RemoveHandler } from "./Main.Internal.Types";
import { handle, handleOnce, off, on, once, removeHandler } from "./Main.Internal";
import type { PackageKeys } from "../Internal";
import type { ReactiveEventFunctions } from "./Main.Types";

export function getReactiveEventFunctions<PackageKey extends PackageKeys>(
): ReactiveEventFunctions<PackageKey>
{
    return {
        handle: handle as Handle<PackageKey>,
        handleOnce: handleOnce as HandleOnce<PackageKey>,
        off: off as Off<PackageKey>,
        on: on as On<PackageKey>,
        once: once as Once<PackageKey>,
        removeHandler: removeHandler as RemoveHandler<PackageKey>
    };
}
