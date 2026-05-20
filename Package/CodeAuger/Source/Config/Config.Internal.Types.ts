/**
 * @file      Config.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A {@link Record} whose keys are `string`s, and properties are `unknown`. */
export type RecordUnknown = Record<string, unknown>;

/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * Equip a {@link BaseOptionsType} with {@link CustomOptionsType | custom options} via
 * a `"Custom"` property, such that this `"Custom"` property exists precisely when a
 * {@link CustomOptionsType} is specified.
 *
 * @template BaseOptionsType - The base type for this options type.
 * @template CustomOptionsType - The custom type for this options type, if any.
 * If this is *not* `never`, then this will be the type of a property `Custom`,
 * which exists precisely when {@link CustomOptionsType} is *not* `never`.
 */
export type WithCustomOptions<
    BaseOptionsType extends RecordUnknown,
    CustomOptionsType extends RecordUnknown = never
> =
    [ CustomOptionsType ] extends [ never ]
        ? Readonly<BaseOptionsType>
        : Readonly<
            BaseOptionsType &
            {
                Custom?: CustomOptionsType;
            }
        >;

/* eslint-enable @typescript-eslint/no-empty-object-type */
