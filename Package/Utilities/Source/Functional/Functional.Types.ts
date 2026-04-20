/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type TExtractFunction<Type> =
    Type extends { (...Arguments: infer ArgumentVectorType): infer ReturnType }
        ? (...Arguments: ArgumentVectorType) => ReturnType
        : never;
