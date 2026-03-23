/* File:      Validation.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

export type IsNever<Type> =
    [ Type ] extends [ never ]
        ? true
        : false;

export type IsNotNever<Type> =
    IsNever<Type> extends true
        ? false
        : true;

export type IsValid<Type> = IsNotNever<Type>;

export type IsPropertyValid<Type, KeyType> =
    KeyType extends keyof Type
        ? IsValid<Type>
        : never;
