/**
 * Internal utilities for {@link \@sorrell/effect-number/Utility}.
 *
 * @module @sorrell/effect-number/Utility
 * @internal
 */

/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Int from "./Int.ts";
import type { Predicate } from "effect/Predicate";
import { dual } from "effect/Function";

export const Branch: {
    <ValueType, TrueType = ValueType, FalseType = TrueType>(
        Predicate: Predicate<ValueType>,
        Options: { OnFalse: (Value: ValueType) => FalseType; OnTrue: (Value: ValueType) => TrueType; },
        Value: ValueType
    ): TrueType | FalseType;

    <ValueType, TrueType = ValueType, FalseType = TrueType>(
        Predicate: Predicate<ValueType>,
        Options: { OnFalse: (Value: ValueType) => FalseType; OnTrue: (Value: ValueType) => TrueType; }
    ): (Value: ValueType) => TrueType | FalseType;
} = dual(3, <ValueType, TrueType = ValueType, FalseType = TrueType>(
    Predicate: Predicate<ValueType>,
    Options: { OnFalse: (Value: ValueType) => FalseType; OnTrue: (Value: ValueType) => TrueType; },
    Value: ValueType
): TrueType | FalseType =>
{
    return Predicate(Value)
        ? Options.OnTrue(Value)
        : Options.OnFalse(Value);
});

export const Gcd: {
    (Value: Int.Int): () => Option.Option<Int.Int>;
        ThatPredicate: Predicate<ValueType>,
        Options: { OnFalse: (Value: ValueType) => FalseType; OnTrue: (Value: ValueType) => TrueType; },
        Value: ValueType
    ): TrueType | FalseType;

    <ValueType, TrueType = ValueType, FalseType = TrueType>(
        Predicate: Predicate<ValueType>,
        Options: { OnFalse: (Value: ValueType) => FalseType; OnTrue: (Value: ValueType) => TrueType; }
    ): (Value: ValueType) => TrueType | FalseType;
} = dual(3, <ValueType, TrueType = ValueType, FalseType = TrueType>(
    Predicate: Predicate<ValueType>,
    Options: { OnFalse: (Value: ValueType) => FalseType; OnTrue: (Value: ValueType) => TrueType; },
    Value: ValueType
): TrueType | FalseType =>
{
    return Predicate(Value)
        ? Options.OnTrue(Value)
        : Options.OnFalse(Value);
});
