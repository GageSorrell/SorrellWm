/* File:      Statement.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FLogCategory, FLogLevel } from "Windows";

export type PStatement =
{
    CategoryName: FLogCategory;
    LogLevel: FLogLevel;
    Content: unknown;
    Timestamp: number;
    ModuleName: string;
};
