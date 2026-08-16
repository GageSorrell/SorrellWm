/**
 * Extended forms of exports from effect's `Predicate` module.
 *
 * @module @sorrell/effect/Predicate
 *
 * @file      Predicate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Predicate } from "effect";

export * from "effect/Predicate";

export/**
       * Run a parameter-less function, discarding the return value.
       *
       * @category Predicate
       * @since 1.4.0
       */
const HasPropertyValue: {
    <S extends object, const K extends keyof S, A>(PropertyKey: K, Value: A):
    (Self: S) => Self is S & { readonly [ Key in K ]: A; };

    <const K extends string, A>(Self: unknown, PropertyKey: K, Value: A):
    Self is { readonly [ Key in K ]: A; };
} = (<const K extends PropertyKey, A>(
    SelfOrPropertyKey: unknown,
    PropertyKeyOrValue: unknown,
    ValueOrUndefined: unknown
) =>
{
    if (Predicate.isObjectKeyword(SelfOrPropertyKey))
    {
        const Self: object = SelfOrPropertyKey;
        const PropertyKey: K = PropertyKeyOrValue as K;
        const Value: A = ValueOrUndefined as A;

        return Predicate.hasProperty(Self, PropertyKey) && Self[PropertyKey] === Value;
    }
    else
    {
        return (Self: unknown) =>
        {
            const PropertyKey: K = SelfOrPropertyKey as K;
            const Value: A = PropertyKeyOrValue as A;

            return Predicate.hasProperty(Self, PropertyKey) && Self[PropertyKey] === Value;
        };
    }
}) as any;
