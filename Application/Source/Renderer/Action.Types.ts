/**
 * @file      Action.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";
import type { TMaybeArray } from "@sorrell/utilities/array";

export type PAction =
    {
        children: TMaybeArray<ReactNode>;
    };
