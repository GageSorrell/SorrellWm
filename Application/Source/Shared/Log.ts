/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FGetTimeToken } from "./Log.Types";

export const GetTimeToken: FGetTimeToken = "__GetTime__" as const;
