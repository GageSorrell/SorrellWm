/* File:      Initialize.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { app as App } from "electron";

/**
 * For side effects `import`ed via `SideEffects.ts` that require `app.whenReady()` to be fulfilled.
 */
export const RegisterInitializationFunction = async (Initializer: () => Promise<void>): Promise<void> =>
{
    await App.whenReady();
    await Initializer();
};
