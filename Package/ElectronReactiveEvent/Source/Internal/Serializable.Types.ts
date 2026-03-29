/* File:      Serializable.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-function-type */

type SerializablePrimitive =
    | string
    | number
    | boolean
    | null
    | undefined;

type IsEqual<LeftType, RightType> =
    (
        (<Type>() => Type extends LeftType ? 1 : 2) extends
        (<Type>() => Type extends RightType ? 1 : 2)
            ? (
                (<Type>() => Type extends RightType ? 1 : 2) extends
                (<Type>() => Type extends LeftType ? 1 : 2)
                    ? true
                    : false
            )
            : false
    );

type Includes<TupleType extends ReadonlyArray<unknown>, ItemType> =
    TupleType extends readonly [infer HeadType, ...infer TailType]
        ? IsEqual<HeadType, ItemType> extends true
            ? true
            : Includes<TailType, ItemType>
        : false;

type MaxDepth = 20;

type SerializableMemberFlag<
    Type,
    SeenType extends ReadonlyArray<unknown> = readonly [],
    DepthType extends ReadonlyArray<unknown> = readonly []
> =
    DepthType["length"] extends MaxDepth
        ? false
        :Type extends Function | symbol
            ? false
            :Type extends SerializablePrimitive
                ? true
                :Type extends ReadonlyArray<infer ElementType>
                    ? Includes<SeenType, Type> extends true
                        ? false
                        : IsSerializable<
                            ElementType,
                            [ ...SeenType, Type ],
                            [ ...DepthType, unknown ]
                        >
                    :Type extends object
                        ? IsSerializableObject<
                            Type,
                            SeenType,
                            DepthType
                        >
                        : false;

type IsSerializableObject<
    ObjectType extends object,
    SeenType extends ReadonlyArray<unknown> = readonly [],
    DepthType extends ReadonlyArray<unknown> = readonly []
> =
    [ Extract<keyof ObjectType, symbol> ] extends [ never ]
        ? Includes<SeenType, ObjectType> extends true
            ? false
            : Extract<
                {
                    [ Key in keyof ObjectType ]-?:
                    IsSerializable<
                        ObjectType[Key],
                        [ ...SeenType, ObjectType ],
                        [ ...DepthType, unknown ]
                    >
                }[keyof ObjectType],
                false
            > extends never
                ? true
                : false
        : false;

export type IsSerializable<
    Type,
    SeenType extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
    DepthType extends ReadonlyArray<unknown> = ReadonlyArray<unknown>
> =
    Extract<
        SerializableMemberFlag<Type, SeenType, DepthType>,
        false
    > extends never
        ? true
        : false;

/** @remarks There do exist edge-case types that are *not* serializable, yet are not detected by this type. */
export type Serializable<Type> =
    IsSerializable<Type> extends true
        ? Type
        : never;
