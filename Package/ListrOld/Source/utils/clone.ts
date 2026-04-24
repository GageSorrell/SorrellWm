/**
 * @file      clone.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import rfdc from "rfdc";

const clone: ReturnType<typeof rfdc> = rfdc({ circles: true });

/**
 * Deep clones a object in the easiest manner.
 * @todo Swap this with structured clone whenever we migrate to node 18.
 */
export function cloneObject<T extends Record<PropertyKey, unknown>>(obj: T): T
{
    return clone(obj);
}
