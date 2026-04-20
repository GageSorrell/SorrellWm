/**
 * @file      WindowTracker.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InitializeWindowTracker as InitializeWindowTrackerNative } from "@sorrellwm/windows";
import { RegisterInitializationFunction } from "./Initialize";

const InitializeWindowTracker = async (): Promise<void> =>
{
    InitializeWindowTrackerNative();
};

RegisterInitializationFunction("WindowTracker", InitializeWindowTracker, [ "NodeIpc" ]);
