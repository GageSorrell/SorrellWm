/**
 *
 *
 * @module @sorrell/log/React/useLogLifecycle
 *
 * @file      useLogLifecycle.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useEffect } from "react";
import { useLogger } from "./useLogger.js";

/** Explicitly log one component's mount and unmount lifecycle at Debug. */
export function useLogLifecycle(Name: string): void
{
    const Logger = useLogger(Name);

    useEffect(() =>
    {
        Logger.Debug("Mounted");
        return (): void =>
        {
            Logger.Debug("Unmounted");
        };
    }, [ Logger ]);
}
