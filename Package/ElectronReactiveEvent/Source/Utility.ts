/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/** @Todo Allow for customization of return value by setting a value. */
export function GetResponseChannel(Channel: string): string
{
    return `${ Channel }__Response`;
}
