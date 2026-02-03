/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// import type { HMonitor, HWindow } from "@sorrellwm/windows";

type HMonitor = {
    Handle: number;
};

type HWindow = {
    Handle: string;
};

export const GetEmptyMonitor = (): HMonitor =>
{
    return {
        Handle: -1
    };
};

export const GetEmptyWindow = (): HWindow =>
{
    return {
        Handle: ""
    };
};
