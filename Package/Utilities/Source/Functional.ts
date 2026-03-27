/* File:      Functional.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export function Identity<Type>(...Arguments: Array<Type>)
{
    return Arguments;
}
