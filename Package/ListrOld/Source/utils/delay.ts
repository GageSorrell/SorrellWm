/**
 * @file      delay.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TThenFn } from "@sorrell/utilities/async";

export function delay(time: number): Promise<void>
{
    return new Promise((resolve: TThenFn<void>) =>
    {
        setTimeout(resolve, time);
    });
}
