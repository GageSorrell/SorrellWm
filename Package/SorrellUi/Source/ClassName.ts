/**
 * A `clsx` + `tailwind-merge` helper for combining conditional class names without
 * conflicting Tailwind utilities silently overriding one another.
 *
 * @module @sorrell/ui/ClassName
 *
 * @file      ClassName.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines any number of class name values, then resolves conflicting Tailwind utility
 * classes (e.g. `"px-2 px-4"`) by keeping the last one.
 *
 * @category Utility
 * @since 1.0.0
 */
export const Cn = (...Inputs: Array<ClassValue>): string =>
{
    return twMerge(clsx(Inputs));
};
