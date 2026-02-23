/* File:      LoggerSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FLogSettings } from "./Log.Types";

export const LogSettings: FLogSettings =
{
    Category:
    {
        DisabledCategories:
        {
            "*": [ ],
            Backend: [ ],
            Frontend:
            [
                "Event"
            ],
            Native: [ ]
        },
        LogDisabledCategoryAttempts: true
    },
    Format:
    {
        Colors: true,
        DigitSeparator: "Space",
        QuoteStyle: "Double"
    },
    Size:
    {
        LimitStatementLength:
        {
            Enabled: false,
            MaxLength: 256
        },
        MaxTerminalWidth: 60,
        TabWidth: 4
    }
} as const;
