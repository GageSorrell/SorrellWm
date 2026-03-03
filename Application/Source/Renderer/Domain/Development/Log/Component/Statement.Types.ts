/* File:      Statement.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FLogLevel } from "@sorrellwm/windows";

export type PStatement =
{
    CategoryName: string;
    LogLevel: FLogLevel;
    Content: unknown;
    Timestamp: number;
    ModuleName: string;
};
