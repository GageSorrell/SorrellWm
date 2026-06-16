/**
 * Utilities for implementations in the {@link \@sorrell/effect-ink/Task} module.
 *
 * @module @sorrell/effect-ink/Task/Internal/Utility
 * @internal
 */

/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Array, Brand, String } from "effect";
import type { HandleArgument } from "../Utility.ts";

export type Handle<KeyType extends string> = Brand.Branded<symbol, KeyType>;

function MakeKeyUnique(Key?: string): string
{
    const GetRandomDigit = (): string => Math.trunc(Math.random() * 10).toString();

    const Tail: string =
        String.ReducerConcat.combineAll(Array.makeBy(5, GetRandomDigit));

    const Head: string = Key ?? "UnnamedHandle";

    return `${ Head }_${ Tail }`;
}

export interface HandleBase<BrandedType extends Brand.Branded<unknown, string>>
{
    readonly _tag: Brand.Brand.Keys<BrandedType>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function MakeHandleConstructor<
    const HandleType extends Handle<KeyType>,
    const KeyType extends string = Extract<Brand.Brand.Keys<HandleType>, string>
>(TypeId: string): (Key?: string) => HandleType
{
    return function (Key?: string): HandleType
    {
        const Body: string = TypeId + (Key ?? "");
        type Unbranded = Brand.Brand.Unbranded<HandleType>;
        const OutSymbol: Unbranded = Symbol.for(MakeKeyUnique(Body)) as Unbranded;

        return Brand.nominal<HandleType>()(OutSymbol);
    };
};

export function MakeHandleGuard<
    const HandleType extends Handle<KeyType>,
    const KeyType extends string = Extract<Brand.Brand.Keys<HandleType>, string>
>(TypeId: string): (Value: unknown) => Value is HandleType
{
    return function (Value: unknown): Value is HandleType
    {
        return (
            typeof Value === "symbol" &&
            (Symbol.keyFor(Value)?.startsWith(TypeId) ?? false)
        );
    };
}

export type HandleConstructor<HandleType extends Handle<any>> =
    (Key?: string) => HandleType;

export type HandleGuard<HandleType extends Handle<any>> = (Value: unknown) => Value is HandleType;

export interface Handled<BrandType extends Handle<any>>
{
    _tag: Extract<Brand.Brand.Keys<BrandType>, string>;
}

export const ArgumentHandleKey = <HandleType extends Handle<any>>(
    HandleArgument: HandleArgument<HandleType>
): string =>
{
    if (typeof HandleArgument === "string")
    {
        return HandleArgument;
    }
    else
    {
        return Symbol.keyFor(HandleArgument)!;
    }
};
