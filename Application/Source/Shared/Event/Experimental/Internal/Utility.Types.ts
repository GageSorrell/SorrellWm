/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type TIsNever<Type> =
    [ Type ] extends [ never ]
        ? true
        : false;

export type TIsNotNever<Type> =
    TIsNever<Type> extends true
        ? false
        : true;

export type TIsValid<Type> = TIsNotNever<Type>;

export type TIsPropertyValid<Type, KeyType> =
    KeyType extends keyof Type
        ? TIsValid<Type>
        : never;
