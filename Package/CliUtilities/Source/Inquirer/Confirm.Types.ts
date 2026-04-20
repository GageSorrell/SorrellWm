/**
 * @file      Confirm.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PartialDeep } from "@inquirer/type";
import type { Theme } from "@inquirer/core";

/** The configuration object for {@link Confirm}. */
export type FConfirmConfig =
    {
        message: string;
        default?: boolean;
        theme?: PartialDeep<Theme>;
    };
