/* File:      Provider.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PackageKeys } from "../Internal";
import type { PropsWithChildren } from "react";

export type ReactiveEventContext =
    {
        PackageKey: PackageKeys;
    };

export type ReactiveEventProviderProps = PropsWithChildren<{ value: ReactiveEventContext; }>;
