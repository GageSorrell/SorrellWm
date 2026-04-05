/* File:      Provider.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type Context, createContext } from "react";
import type { PackageKeys } from "../Internal";
import type { ReactiveEventContext } from "./Provider.Types";

const EmptyReactiveEventInternalContext: ReactiveEventContext =
    {
        PackageKey: "" as PackageKeys
    };

export const ReactiveEventInternalContext: Context<ReactiveEventContext> =
    createContext<ReactiveEventContext>(EmptyReactiveEventInternalContext);
