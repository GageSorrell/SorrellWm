/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

export type Values<RecordLike> = RecordLike[keyof RecordLike];

export type ArrayNonempty<ElementType> =
    | [ ElementType ]
    | [ ElementType, ...Array<ElementType> ];

