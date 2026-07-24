/**
 *
 *
 * @module @sorrell/log/React/useLogger
 *
 * @file      useLogger.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useContext, useMemo } from "react";
import type { CategoryInput } from "../Category.js";
import { type DirectLogger, MakeLogger } from "../Logger.js";
import { LogContext } from "./LogContext.js";

/** Return a stable direct logger inheriting the current React logging context. */
export function useLogger(Category?: CategoryInput): DirectLogger
{
    const Context = useContext(LogContext);

    if (Context === undefined)
    {
        throw new Error("useLogger must be used within a LogProvider.");
    }

    return useMemo(() =>
    {
        const Logger = MakeLogger(Context.Runtime, Context.Category, {
            Annotations: Context.Annotations,
            Source: "React"
        });

        return Category === undefined ? Logger : Logger.Child(Category);
    }, [ Category, Context.Annotations, Context.Category, Context.Runtime ]);
}
