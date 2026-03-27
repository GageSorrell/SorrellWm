/* File:      Promise.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type TTrySource<DataType> =
    | Promise<DataType>
    | (() => DataType)
    | (() => Promise<DataType>);
