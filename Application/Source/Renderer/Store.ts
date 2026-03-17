/* File:      Store.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FStore } from "../Shared/Store.Types";
import { UseSendIpcEvent } from "./Event";

export const UseMainStore = (): Readonly<[ FStore | undefined ]> =>
{
    const { Data } = UseSendIpcEvent("GetStore", undefined);
    return [ Data ] as const;
};
