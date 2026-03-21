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

type TIsEqual<LeftType, RightType> =
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

type TIncludes<TupleType extends ReadonlyArray<unknown>, ItemType> =
    TupleType extends readonly [infer HeadType, ...infer TailType]
        ? TIsEqual<HeadType, ItemType> extends true
            ? true
            : TIncludes<TailType, ItemType>
        : false;

type TMaxDepth = 20;

type TSerializableMemberFlag<
    Type,
    SeenType extends ReadonlyArray<unknown> = readonly [],
    DepthType extends ReadonlyArray<unknown> = readonly []
> =
    DepthType["length"] extends TMaxDepth
        ? false
        : Type extends Function | symbol
            ? false
            : Type extends FSerializablePrimitive
                ? true
                : Type extends ReadonlyArray<infer ElementType>
                    ? TIncludes<SeenType, Type> extends true
                        ? false
                        : TIsSerializable<
                            ElementType,
                            [ ...SeenType, Type ],
                            [ ...DepthType, unknown ]
                        >
                    : Type extends object
                        ? TIsSerializableObject<
                            Type,
                            SeenType,
                            DepthType
                        >
                        : false;

type TIsSerializableObject<
    ObjectType extends object,
    SeenType extends ReadonlyArray<unknown> = readonly [],
    DepthType extends ReadonlyArray<unknown> = readonly []
> =
    [ Extract<keyof ObjectType, symbol> ] extends [ never ]
        ? TIncludes<SeenType, ObjectType> extends true
            ? false
            : Extract<
                {
                    [Key in keyof ObjectType]-?:
                    TIsSerializable<
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

export type TIsSerializable<
    Type,
    SeenType extends ReadonlyArray<unknown> = readonly [],
    DepthType extends ReadonlyArray<unknown> = readonly []
> =
    Extract<
        TSerializableMemberFlag<Type, SeenType, DepthType>,
        false
    > extends never
        ? true
        : false;

/** @Note There do exist edge-case types that are *not* serializable, yet are not detected by this type. */
export type TSerializable<Type> =
    TIsSerializable<Type> extends true
        ? Type
        : never;
