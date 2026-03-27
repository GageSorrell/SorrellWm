/* File:      Confirm.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PartialDeep } from "@inquirer/type";
import type { Theme } from "@inquirer/core";

export type FConfirmConfig =
    {
        message: string;
        default?: boolean;
        theme?: PartialDeep<Theme>;
    };
