/* File:      Functional.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type TExtractFunction<Type> =
    Type extends { (...Arguments: infer ArgumentVectorType): infer ReturnType }
        ? (...Arguments: ArgumentVectorType) => ReturnType
        : never;
