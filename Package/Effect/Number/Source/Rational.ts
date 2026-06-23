/**
 * A data structure for modeling the rational numbers.
 *
 * @module @sorrell/effect-number/Rational
 */

/**
 * @file      Rational.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as BigInt from "effect/BigInt";
import * as Eq from "effect/Equivalence";
import * as Equal from "effect/Equal";
import * as Hash from "effect/Hash";
import * as Int from "./Int.ts";
import * as Number from  "effect/Number";
import * as Option from "effect/Option";
import * as Utility from "./Utility.ts";
import * as order from "effect/Order";
import { Array, BigDecimal, Function, Match, Ordering } from "effect";
import { dual, pipe } from "effect/Function";
import { NodeInspectSymbol } from "effect/Inspectable";
import { pipeArguments } from "effect/Pipeable";
import { hasProperty } from "effect/Predicate";
import type { Ratio } from "./Ratio.ts";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/Rational");
export type TypeId = typeof TypeId;

// @TODO Make Numerator and Denominator into `Int.Int`.

export interface Rational extends Ratio<number, Rational>
{
    readonly [ TypeId ]: typeof TypeId;
    readonly Numerator: number;
    readonly Denominator: number;

    // /**
    //  * The simplest form of this.
    //  *
    //  * @internal
    //  */
    // CanonicalForm: Rational | undefined;
}

/**
 * The types of values from which the numerator or denominator of a
 * {@link Rational | rational number} may be computed.
 */
export type PartLike =
    | number
    | string
    | bigint
    | BigDecimal.BigDecimal
    | Int.Int
    |
    | Rational;

export const ToNumber = (Value: Rational): number =>
{
    return Value.Numerator / Value.Denominator;
};

export const Normalize = (Value: Rational): Rational =>
{
    if (Value.Numerator > 0 && Value.Denominator < 0 || Value.Numerator < 0 && Value.Denominator < 0)
    {
        return Rational(-1 * Value.Numerator, -1 * Value.Denominator);
    }
    else
    {
        return { ...Value };
    }
};

/**
 * Convert a {@link Part:type} into a `number`, typically so that it can be used
 * with or within a {@link Rational:type | rational number}.
 *
 * @param Part - The {@link Part:type} to normalize into a `number`.
 * @returns {number} The `number` represented by the given {@link Part:param},
 * which can be used within a {@link Rational:type | rational number}.
 */
export const NormalizePart = (Part: PartLike): Option.Option<number> =>
{
    return pipe(
        Part,
        MatchPart({
            BigDecimal: (Value: BigDecimal.BigDecimal) =>
            {
                try
                {
                    return Option.some(BigDecimal.toNumberUnsafe(Value));
                }
                catch
                {
                    return Option.none();
                }
            },
            Rational: Function.flow(ToNumber, Option.some),
            bigint: BigInt.toNumber,
            number: Option.some,
            string: Number.parse
        }),
        Option.flatten
    );
};

/**
 * The `string` representations of the types that make up the {@link PartLike:type} union.
 *
 * @see {@link PartRecord} This type exists to define the {@link PartRecord} type.
 */
export type PartKey =
    | "number"
    | "string"
    | "bigint"
    | "BigDecimal"
    | "Rational";

// export type PartRecord<ValueType = unknown> = Record<PartKey, ValueType>;

export type PartRecord<ValueType = unknown> =
    {
        readonly number?: (Value: number) => ValueType;
        readonly string?: (Value: string) => ValueType;
        readonly bigint?: (Value: bigint) => ValueType;
        readonly BigDecimal?: (Value: BigDecimal.BigDecimal) => ValueType;
        readonly Rational?: (Value: Rational) => ValueType;
    };

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Transform a given {@link PartLike:param} based on its {@link PartLike:type | type}.
 */
export const MatchPart: {
    /**
     * Transform a given {@link Part:param} based on its {@link Part:type | type}.
     *
     * @template ConditionsType - The type of the {@link WhenRecord} argument.
     *
     * @template OutType - The type of the return value, consisting of the return types of the possible
     * functions defined in the given {@link WhenRecord}.
     *
     * @param WhenRecord - A {@link Record} that provides a transformation for each of
     * (some or all of) the {@link Part:type | Part types}.
     *
     * @param Part - The {@link Part:type} to match with one of the transformations in the given
     * {@link WhenRecord}.
     *
     * @returns {Option.Option<OutType>} If the given {@link WhenRecord} contains a transformation
     * corresponding to the given {@link Part:param}, then this is the ({@link Option!Option}) result
     * of calling that transformation with the given {@link Part:param} (otherwise {@link Option!None}).
     *
     * @see {@link MATCH_PART:CURRIED} There also exists a curried overload of this function.
     *
     * {@label MATCH_PART:NOT_CURRIED}
     */
    <const ValueType>(WhenRecord: PartRecord<ValueType>, Part: PartLike): Option.Option<ValueType>;

    /**
     * Create a mapping that matches a future {@link PartLike:type} based on its {@link PartLike:type | type}
     * within the {@link PartLike:type | Part type union}.
     *
     * @template ConditionsType - The type of the {@link WhenRecord} argument.
     *
     * @template OutType - The type of the return value, consisting of the return types of the possible
     * functions defined in the given {@link WhenRecord}.
     *
     * @param WhenRecord - A {@link Record} that provides a transformation for each of
     * (some or all of) the {@link PartLike:type | Part types}.
     *
     * @returns {(Part: PartLike) => Option.Option<OutType>} A function that transforms a given
     * {@link PartLike:type} via the function in the given {@link WhenRecord} corresponding to
     * the exact subtype of the given {@link PartLike:type}.
     *
     * @see {@link MATCH_PART:NOT_CURRIED} There also exists an overload of this function
     * that is *not* curried.
     *
     * {@label MATCH_PART:CURRIED}
     */
    <const ValueType>(WhenRecord: PartRecord<ValueType>):
    /**
     * Transform a given {@link Part:param} based on its {@link Part:type | type}.
     *
     * @see {@link MATCH_PART:CURRIED} This function is returned by the curried overload
     * of {@link MatchPart}.
     *
     * {@label MATCH_PART:CURRIED_RETVAL}
     */
    (Part: PartLike) => Option.Option<ValueType>;

} = dual(2,
    <const ValueType>(
        WhenRecord: PartRecord<ValueType>,
        Part: PartLike
    ): Option.Option<ValueType> =>
    {
        return pipe(
            Part,
            pipe(
                Part,
                Match.type<PartLike>,
                Match.when(Match.number, (Value: number) =>
                {
                    return "number" in WhenRecord
                        ? Option.some(WhenRecord.number(Value))
                        : Option.none();
                }),
                Match.when(Match.string, (Value: string) =>
                {
                    return "string" in WhenRecord
                        ? Option.some(WhenRecord.string(Value))
                        : Option.none();
                }),
                Match.when(Match.bigint, (Value: bigint) =>
                {
                    return "bigint" in WhenRecord
                        ? Option.some(WhenRecord.bigint(Value))
                        : Option.none();
                }),
                Match.when(BigDecimal.isBigDecimal, (Value: BigDecimal.BigDecimal) =>
                {
                    return "BigDecimal" in WhenRecord
                        ? Option.some(WhenRecord.BigDecimal(Value))
                        : Option.none();
                }),
                Match.when(IsRational, (Value: Rational) =>
                {
                    return "Rational" in WhenRecord
                        ? Option.some(WhenRecord.Rational(Value))
                        : Option.none();
                }),
                Match.option
            ),
            Option.flatten
        );
    });

/* eslint-enable @typescript-eslint/no-explicit-any */

const Prototype: Omit<Rational, "Denominator" | "Numerator"> =
    {
        [ TypeId ]: TypeId,

        [ Equal.symbol ](this: Rational, That: unknown): boolean
        {
            return IsRational(That) && Equals(this, That);
        },
        [ Hash.symbol ](this: Rational): number
        {
            return Hash.combine(Hash.number(this.Numerator), Hash.number(this.Denominator));
        },
        [ NodeInspectSymbol ](this: Rational)
        {
            return this.toJSON();
        },
        pipe()
        {
            /* eslint-disable-next-line prefer-rest-params */
            return pipeArguments(this, arguments);
        },
        toJSON(this: Rational)
        {
            return {
                _id: "Rational",

                Denominator: String(this.Denominator),
                Numerator: String(this.Numerator)
            };
        },
        toString(this: Rational)
        {
            return Format(this);
        }
    } as const;

export const Simplify = (Value: Rational): Rational =>
{
    if (Value.Numerator === 0)
    {
        return Zero;
    }
    else if (Value.Numerator === Value.Denominator)
    {
        return One;
    }
    else
    {
        return Math.gc
    }
};

export const Rational: {
    (Numerator: Int.Int, Denominator: Int.NonzeroInt): Rational;
    (Numerator: number, Denominator: number): Option.Option<Rational>;
    (Numerator: Int.Int, Denominator: number): Option.Option<Rational>;
} = (Numerator: number, Denominator: number): Option.Option<Rational> =>
{
    if (Denominator === 0)
    {
        return Option.none();
    }
    else if (Numerator === 0)
    {
        return Option.some(Zero);
    }
    else
    {
        const Normalized: readonly [ number, number ] =
            Denominator < 0
                ? [ -1 * Numerator, -1 * Denominator ] as const
                : [ Numerator, Denominator ] as const;

        return Object.assign(Prototype, {
            [ TypeId ]: TypeId,

            Denominator,
            Numerator
        });
    }

    // @TODO Normalize sign, check for nonzero denominator, return Option<Rational>
    // @TODO Make RationalUnsafe

    return pipe(
        [ Numerator, Denominator ],
        Utility.Branch(([ Numerator, Denominator ]: readonly [ number, number ]): boolean => Numerator *,
        {
            OnFalse: (Value: readonly [ number, number ]) =>
            {

            },
            OnTrue: (Value: readonly [ number, number ]) =>
            {

            }
        })
    );
};

export const RationalUnsafe = (Numerator: number, Denominator: number): Rational =>
{
    // @TODO Normalize sign, check for nonzero denominator, return Option<Rational>
    // @TODO Make RationalUnsafe

    return Object.assign(Prototype, {
        [ TypeId ]: TypeId,

        Denominator,
        Numerator
    });
};

export const IsRational = (Value: unknown): Value is Rational => hasProperty(Value, TypeId);

export const From = <
    NumeratorType extends PartLike,
    DenominatorType extends PartLike>(
    Numerator: NumeratorType,
    Denominator: DenominatorType
): Option.Option<Rational> =>
{
    return pipe(
        [ NormalizePart(Numerator), NormalizePart(Denominator) ],
        Function.tupled(Option.product),
        Option.map(([ NumeratorNum, DenominatorNum ]: [ number, number ]) =>
        {
            return Rational(NumeratorNum, DenominatorNum);
        })
    );
};

export const Format = (Rational: Rational): string =>
{
    return `${ Rational.Numerator } / ${ Rational.Denominator }`;
};

export const Equivalence: Eq.Equivalence<Rational> = Eq.make((Self: Rational, That: Rational): boolean =>
{
    return Self.Numerator * That.Denominator === Self.Denominator * Self.Numerator;
});

export const IsIdentical: {
    (That: Rational): (Self: Rational) => boolean;
    (Self: Rational, That: Rational): boolean;
} = dual(2, (Self: Rational, That: Rational): boolean =>
{
    return Self.Numerator === That.Numerator && Self.Denominator === That.Denominator;
});

/**
 * A convenience function for multiplying a {@link Rational} number by a `number`.
 */
export const GetMultiple: {
    (Scalar: number): (Self: Rational) => boolean;
    (Self: Rational, Scalar: number): boolean;
} = dual(2, (Self: Rational, Scalar: number): Rational =>
{
    return Rational(Scalar * Self.Numerator, Scalar * Self.Denominator);
});

export const Zero: Rational = RationalUnsafe(0, 1);

export const Identity: Rational = Zero;

export const One: Rational = RationalUnsafe(1, 1);

export const Unit: Rational = One;

export const Sign = (Rational: Rational): Ordering.Ordering =>
    Rational === Zero
        ? 0
        : Number.sign(Rational.Numerator) === Number.sign(Rational.Denominator)
            ? 1
            : -1;

export const Equals: {
    (That: Rational): (Self: Rational) => boolean;
    (Self: Rational, That: Rational): boolean;
} = dual(2, (Self: Rational, That: Rational): boolean => Equivalence(Self, That));

export const Order: order.Order<Rational> = order.make((Self: Rational, That: Rational): Ordering.Ordering =>
{
    return order.Number(Self.Numerator * That.Denominator, Self.Denominator * That.Numerator);
});

export const Abs = (Value: Rational): Rational =>
    RationalUnsafe(Math.abs(Value.Numerator), Math.abs(Value.Denominator));

export const Negate = (Value: Rational): Rational => RationalUnsafe(-1 * Value.Numerator, Value.Denominator);

export const IsZero = (Value: Rational): boolean => Value.Numerator === 0;

export const IsNonzero = (Value: Rational): boolean => Value.Numerator !== 0;

export type Transform = <A>(Value: Rational) => A;

export type IsomorphicTransform = (Value: Rational) => Rational;

export const MapNumerator: {
    (Self: Rational, Transform: (Value: number) => PartLike): Rational;

    (Transform: (Value: number) => PartLike): (Self: Rational) => Rational;
} = dual(2, (Self: Rational, Transform: (Value: number) => PartLike): Option.Option<Rational> =>
{
    return Rational(NormalizePart(Transform(Self.Numerator)), Self.Denominator);
});

export const Remainder: {
    (Self: Rational, Divisor: Rational): Option.Option<Rational>;

    (Divisor: Rational): (Self: Rational) => Option.Option<Rational>;
} = dual(2, (Self: Rational, Divisor: Rational): Option.Option<Rational> =>
{
    return Option.flatMap(
        Divide(Self, Divisor),
        Utility.Branch(
            IsLessThan(One),
            {
                OnFalse: Function.identity,
                OnTrue: (Value: Rational): Rational
            }
            (Value: Rational): boolean => Value.Numerator < Value.Denominator, )
    );

    if (Option.isSome(Quotient))
    {
        if (Quotient.value.Numerator < Quotient.value.Denominator)
        {
            return Option.some(Quotient.value);
        }
        else
        {
            return Option.some(Rational(
                Quotient.value.Numerator % Quotient.value.Denominator,
                Quotient.value.Denominator)
            );
        }
    }

    return Option.none();
});

export const MatchZero: {
    <OnZeroType, OnNonzeroType = OnZeroType>(Options: {
        readonly OnZero: Function.LazyArg<OnZeroType>;
        readonly OnNonzero: (Value: Rational) => OnNonzeroType;
    }): (Self: Rational) => OnZeroType | OnNonzeroType;

    <OnZeroType, OnNonzeroType = OnZeroType>(
        Self: Rational,
        Options: {
            readonly OnZero: Function.LazyArg<OnZeroType>;
            readonly OnNonzero: (Value: Rational) => OnNonzeroType;
    }): OnZeroType | OnNonzeroType;
} = dual(2, <OnZeroType, OnNonzeroType = OnZeroType>(
    Self: Rational,
    Options: {
        readonly OnZero: Function.LazyArg<OnZeroType>;
        readonly OnNonzero: (Value: Rational) => OnNonzeroType;
}): OnZeroType | OnNonzeroType =>
{
    return IsZero(Self)
        ? Options.OnZero()
        : Options.OnNonzero(Self);
});

export const NonzeroSome: {
    <A>(Value: Rational, Callback: (Value: Rational) => A): Option.Option<A>;

    <A>(Callback: (Value: Rational) => A): (Value: Rational) => Option.Option<A>;
} = dual(2, <A>(Value: Rational, Callback: (Value: Rational) => A): Option.Option<A> =>
{
    return MatchZero(Value, { OnNonzero: Function.flow(Callback, Option.some), OnZero: Option.none<A> });
});

export const ZeroSome: {
    <A>(Value: Rational, Callback: (Value: Rational) => A): Option.Option<A>;

    <A>(Callback: (Value: Rational) => A): (Value: Rational) => Option.Option<A>;
} = dual(2, <A>(Value: Rational, Callback: Function.LazyArg<A>): Option.Option<A> =>
{
    return MatchZero(Value, { OnNonzero: Option.none<A>, OnZero: Function.flow(Callback, Option.some) });
});

export const AreNonzero = (...Terms: ReadonlyArray<Rational>): boolean =>
{
    return Array.every(Terms, (A: Rational, _Index: number): boolean => IsNonzero(A));
};

export const Multiply: {
    (That: Rational): (Self: Rational) => Option.Option<Rational>
    (Self: Rational, That: Rational): Option.Option<Rational>
} = dual(2, (Self: Rational, That: Rational): Rational =>
{

    return Rational(Self.Numerator * That.Numerator, Self.Denominator * That.Denominator);
});

export const Reciprocal = (Value: Rational): Option.Option<Rational> =>
{
    return NonzeroSome(Value, (Value: Rational) => Rational(Value.Denominator, Value.Numerator));
};

export const Inverse = (Value: Rational): Rational =>
{
    return Ordering.match(Sign(Value), {
        onEqual: Zero,
        onGreaterThan: Value()
    });
};

export const Divide: {
    (Divisor: Rational): (Self: Rational) => Option.Option<Rational>
    (Self: Rational, Divisor: Rational): Option.Option<Rational>
} = dual(2, (Self: Rational, Divisor: Rational): Option.Option<Rational> =>
{
    if (IsZero(Divisor))
    {
        return Option.none();
    }
    else
    {
        return Option.some(Multiply(Self, Reciprocal(Divisor)));
    }
});

export const IsLessThan: {
    (That: Rational): (Self: Rational) => boolean
    (Self: Rational, That: Rational): boolean
} = order.isLessThan(Order);

export const IsGreaterThan: {
    (That: Rational): (Self: Rational) => boolean
    (Self: Rational, That: Rational): boolean
} = order.isGreaterThan(Order);

export const IsLessThanOrEqualTo: {
    (That: Rational): (Self: Rational) => boolean
    (Self: Rational, That: Rational): boolean
} = order.isLessThanOrEqualTo(Order);

export const IsGreaterThanOrEqualTo: {
    (That: Rational): (Self: Rational) => boolean
    (Self: Rational, That: Rational): boolean
} = order.isGreaterThanOrEqualTo(Order);

export const IsBetween: {
    (That: Rational): (Self: Rational) => boolean
    (Self: Rational, That: Rational): boolean
} = order.isBetween(Order);
