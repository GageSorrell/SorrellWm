/* File:      LoggerSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FLogSettings } from "./Log.Types";

export const LogSettings: FLogSettings =
{
    Colors: true,
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
        Enabled: false,
        MaxLength: 256
    },
    LogDisabledCategoryAttempts: true,
    MaxTerminalWidth: 60,
    TabWidth: 4
} as const;
