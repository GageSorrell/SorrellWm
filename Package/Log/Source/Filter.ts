/**
 * Filter types and operations for structured logging.
 *
 * @module @sorrell/log/Filter
 *
 * @file      Filter.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { LogLevel } from "effect";
import * as Category from "./Category.js";
import type { CategoryInput } from "./Category.js";

/** Runtime-level filtering with longest-prefix category overrides. */
export interface FilterOptions
{
    readonly MinimumLevel?: LogLevel.LogLevel;
    readonly CategoryMinimumLevels?: Readonly<Record<string, LogLevel.LogLevel>>;
}

/** Resolve the effective threshold for a category. */
export function MinimumLevelFor(
    CategoryValue: CategoryInput,
    Options: FilterOptions
): LogLevel.LogLevel
{
    const Value = Category.Make(CategoryValue);
    let Minimum = Options.MinimumLevel ?? "All";
    let BestLength = -1;

    for (const [ PrefixInput, Threshold ] of Object.entries(
        Options.CategoryMinimumLevels ?? { }
    ))
    {
        const Prefix = Category.TryMake(PrefixInput);
        if (Prefix !== undefined
            && Prefix.length > BestLength
            && Category.IsWithin(Value, Prefix))
        {
            BestLength = Prefix.length;
            Minimum = Threshold;
        }
    }

    return Minimum;
}

/** Test an emitted severity against global and category-specific thresholds. */
export function Accepts(
    Level: LogLevel.Severity,
    CategoryValue: CategoryInput,
    Options: FilterOptions
): boolean
{
    return LogLevel.isGreaterThanOrEqualTo(
        Level,
        MinimumLevelFor(CategoryValue, Options)
    );
}
