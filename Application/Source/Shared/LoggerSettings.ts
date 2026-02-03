/* File:      LoggerSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FLogSettings } from "./Log.Types";

export const LogSettings: FLogSettings =
{
    DisabledCategories:
    {
        Backend: [ ],
        Frontend:
        [
            "Event"
        ],
        Native: [ ]
    },
    LimitStatementLength:
    {
        Enabled: true,
        MaxLength: 256
    },
    LogDisabledCategoryAttempts: true
} as const;
