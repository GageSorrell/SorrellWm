/* File:      Provider.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type Context, createContext } from "react";
import type { ReactiveEventContext } from "./Hook.Internal.Types";
import type { PackageKeys } from "../Internal";

const EmptyReactiveEventInternalContext: ReactiveEventContext =
    {
        PackageKey: "" as PackageKeys
    };

export const ReactiveEventInternalContext: Context<ReactiveEventContext> =
    createContext<ReactiveEventContext>(EmptyReactiveEventInternalContext);
