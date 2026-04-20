/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FGetTimeToken } from "./Log.Types";

export const GetTimeToken: FGetTimeToken = "__GetTime__" as const;
