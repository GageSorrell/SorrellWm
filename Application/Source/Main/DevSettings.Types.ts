/* File:      DevSettings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FBox } from "Windows";

export type FDevSettings = Readonly<{
    StaticMode:
    {
        Enabled: boolean;
        WindowShape: FBox;
    };
}>;
