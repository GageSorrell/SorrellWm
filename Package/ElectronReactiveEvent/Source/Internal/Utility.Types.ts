/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type Extends<
    RecordLike extends object,
    KeyType extends (keyof RecordLike) | PropertyKey,
    TestType,
    ReturnType extends "RealType" | "TestType" | "BooleanType" = "TestType"
> =
    KeyType extends keyof RecordLike
        ? RecordLike[KeyType] extends TestType
            ? ReturnType extends "RealType"
                ? RecordLike[KeyType]
                : ReturnType extends "TestType"
                    ? TestType
                    : true // ReturnType extends "BooleanType"
            : ReturnType extends "RealType"
                ? never
                : ReturnType extends "TestType"
                    ? never
                    : false // ReturnType extends "BooleanType"
        : ReturnType extends "RealType"
            ? never
            : ReturnType extends "TestType"
                ? never
                : false; // ReturnType extends "BooleanType"

export type Values<RecordLike> = RecordLike[keyof RecordLike];

export type ArrayNonempty<ElementType> =
    | [ ElementType ]
    | [ ElementType, ...Array<ElementType> ];

/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
export type Serializable<Type> = Type extends symbol | Function | Symbol
    ? never
    : Type;

export type SimpleCallback = () => void;
