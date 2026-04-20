/**
 * @file      Reactive.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

const BrandSymbol: unique symbol = Symbol("Brand");

interface IBrand<Id extends string>
{
    readonly [ BrandSymbol ]:
    {
        readonly [ Key in Id ]: Id;
    };
};

/**
 * Copycat of {@link https://effect.website/docs/code-style/branded-types/ | effect-ts's Brand type}.
 *
 * @typeParam Id - The unique identifier of the resulting branded type.
 * @typeParam InnerType - The type branded by this.
 */
export type Brand<Id extends string, InnerType> =
    InnerType &
    IBrand<Id>;
