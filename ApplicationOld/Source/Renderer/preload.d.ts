/* File:      preload.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FElectronHandler } from "../Main/Core/Preload";

declare global
{
    /* eslint-disable-next-line no-unused-vars, @typescript-eslint/naming-convention */
    interface Window
    {
        electron: FElectronHandler;
    }
}

export { };
