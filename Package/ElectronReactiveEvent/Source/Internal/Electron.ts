/* File:      Electron.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ElectronModule, ElectronModuleCache } from "./Electron.Types";

const Cache: ElectronModuleCache = { };

export function GetElectron<SubmoduleType extends ElectronModule>(
    Submodule: SubmoduleType
): ElectronModuleCache[SubmoduleType] | undefined
{
    if (Cache[Submodule] === undefined)
    {
        try
        {
            /* eslint-disable-next-line @typescript-eslint/no-require-imports */
            Cache[Submodule] = require("electron")[Submodule];
        }
        catch
        {
            return undefined;
        }
    }

    return Cache[Submodule];
}
