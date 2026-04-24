/**
 * @file      splat.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { format } from "util";

export function splat(Message: string, ...Splat: Array<any>): string
{
    return format(String(Message), ...Splat);
}
