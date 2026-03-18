/* File:      WindowTracker.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { InitializeWindowTracker as InitializeWindowTrackerNative } from "@sorrellwm/windows";
import { RegisterInitializationFunction } from "./Initialize";

const InitializeWindowTracker = async (): Promise<void> =>
{
    InitializeWindowTrackerNative();
};

RegisterInitializationFunction("WindowTracker", InitializeWindowTracker, [ "NodeIpc" ]);
