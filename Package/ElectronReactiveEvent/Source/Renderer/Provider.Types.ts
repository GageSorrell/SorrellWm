/* File:      Provider.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Keyed } from "./Hook.Types.js";
import type { PackageKeys } from "../Internal";

/**
 * Currently, the context is used only for the keyed hooks.
 */
export type ReactiveEventContext<PackageKey extends PackageKeys> =
    Keyed.Hooks<PackageKeys>;
