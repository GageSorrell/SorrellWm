/* File:      DevSettings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FBox } from "@sorrellwm/windows";
import type { FLogSettings } from "../Shared/Log.Types";

export type FDevSettings = Readonly<{
    Log: FLogSettings;
    StaticMode:
    {
        Enabled: boolean;
        WindowShape: FBox;
    };
}>;
