/* File:      Serializable.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

type FSerializablePrimitive =
    | string
    | number
    | boolean
    | null
    | undefined;

type TIsSerializableObject<ObjectType extends object> =
    Extract<keyof ObjectType, symbol> extends never
        ? Extract<
            {
                [Key in keyof ObjectType]-?: TIsSerializable<ObjectType[Key]>;
            }[keyof ObjectType],
            false
        > extends never
            ? true
            : false
        : false;

type TSerializableMemberFlag<Type> =
    Type extends Function | symbol
        ? false
        : Type extends FSerializablePrimitive
            ? true
            : Type extends ReadonlyArray<infer ElementType>
                ? TIsSerializable<ElementType>
                : Type extends object
                    ? TIsSerializableObject<Type>
                    : false;

export type TIsSerializable<Type> =
    Extract<TSerializableMemberFlag<Type>, false> extends never
        ? true
        : false;

/** @Note There do exist edge-case types that are *not* serializable, yet are not detected by this type. */
export type TSerializable<Type> =
    TIsSerializable<Type> extends true
        ? Type
        : never;
