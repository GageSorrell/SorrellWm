/**
 * @file      Store.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FStore } from "../Shared/Store.Types";
import { UseSendIpcEvent } from "./Event.tsx.old";

export const UseMainStore = (): Readonly<[ FStore | undefined ]> =>
{
    const { Data } = UseSendIpcEvent("GetStore", undefined);
    return [ Data ] as const;
};
