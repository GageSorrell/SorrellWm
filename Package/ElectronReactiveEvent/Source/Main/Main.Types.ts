/* File:      Main.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Handle, HandleOnce, Off, On, Once, RemoveHandler } from "./Main.Internal.Types";
import type { PackageKeys } from "../Internal";

export type ReactiveEventFunctions<PackageKey extends PackageKeys> =
    Readonly<{
        handle: Handle<PackageKey>,
        handleOnce: HandleOnce<PackageKey>,
        off: Off<PackageKey>,
        on: On<PackageKey>,
        once: Once<PackageKey>,
        removeHandler: RemoveHandler<PackageKey>
    }>;
