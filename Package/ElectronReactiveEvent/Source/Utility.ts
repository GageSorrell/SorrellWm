/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export function GetResponseChannel(Channel: string): string
{
    return `${ Channel }__Response`;
}
