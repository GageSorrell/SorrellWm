/**
 *
 *
 * @module @sorrell/log/React/LogContext
 *
 * @file      LogContext.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { createContext } from "react";
import type * as Category from "../Category.js";
import type { UnsafePublisher } from "../Logger.js";

/** Inherited logging state shared through React providers. */
export interface LogContextValue
{
    readonly Runtime: UnsafePublisher;
    readonly Category: Category.Category;
    readonly Annotations: Readonly<Record<string, unknown>>;
}

/** Internal React context shared by the public provider and hooks. */
export const LogContext = createContext<LogContextValue | undefined>(undefined);
