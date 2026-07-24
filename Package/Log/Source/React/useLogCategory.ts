/**
 *
 *
 * @module @sorrell/log/React/useLogCategory
 *
 * @file      useLogCategory.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useContext } from "react";
import type { Category } from "../Category.js";
import { LogContext } from "./LogContext.js";

/** Return the fully composed current React log category. */
export function useLogCategory(): Category
{
    const Context = useContext(LogContext);
    if (Context === undefined)
    {
        throw new Error("useLogCategory must be used within a LogProvider.");
    }

    return Context.Category;
}
