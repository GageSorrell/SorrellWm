/* File:      Action.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { ReactNode } from "react";
import type { TMaybeArray } from "./Utility";

export type PAction =
{
    children: TMaybeArray<ReactNode>;
};
