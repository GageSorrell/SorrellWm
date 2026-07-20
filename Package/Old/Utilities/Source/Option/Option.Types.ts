/**
 * @file      Option.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * For a given {@link ObjectType} containing some optional properties whose keys belong
 * to {@link KeyType}, transform the {@link ObjectType} such that *at least one* of the
 * properties whose keys belong to {@link KeyType} are made *not* optional.  That is,
 * this produces an `object` union of all possible forms where at least one of the
 * properties with key in {@link KeyType} is made not optional.
 *
 * @template ObjectType - The `object` type that is transformed such that at least one
 * of the properties whose respective keys belong to {@link KeyType} is required in this type.
 *
 * @template KeyType - The keys of {@link ObjectType} of which at least one of the
 * corresponding properties in {@link ObjectType} is required in this type.
 *
 * @note While it is not enforced in this type's definition, this type is a no-op on
 * the {@link ObjectType} if the properties in the {@link ObjectType} whose keys belong
 * to {@link KeyType} are *not* optional.  That is, you likely want *all* properties in
 * the {@link ObjectType} whose keys belong to {@link KeyType} to be optional.
 */
export type AtLeastOne<
    ObjectType,
    KeyType extends keyof ObjectType = keyof ObjectType
> =
    Omit<ObjectType, KeyType> &
    {
        [ Key in KeyType ]-?:
            Required<Pick<ObjectType, Key>> &
            Partial<Omit<Pick<ObjectType, KeyType>, Key>>;
    }[KeyType];
