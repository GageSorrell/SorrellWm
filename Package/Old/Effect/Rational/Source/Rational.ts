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
// import * as Number from  "effect/Number";
import * as Option from "effect/Option";
import * as order from "effect/Order";
import { BigDecimal, Function, type Ordering, Tuple } from "effect";
import { type Inspectable, NodeInspectSymbol } from "effect/Inspectable";
import { type Pipeable, pipeArguments } from "effect/Pipeable";
import { dual, pipe } from "effect/Function";
import { hasProperty } from "effect/Predicate";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/Rational");
export type TypeId = typeof TypeId;

// @TODO Make Numerator and Denominator into `Int.Int`.

export interface Rational extends Equal.Equal, Pipeable, Inspectable
{
    readonly [ TypeId ]: typeof TypeId;

    readonly numerator: bigint;
    readonly denominator: bigint;

    /** An alias for the {@link numerator}. */
    get p(): bigint;

    /** An alias for the {@link denominator}. */
    get q(): bigint;

    /** The form of this which has a positive {@link denominator}. */
    normalized?: Rational;
}

const RationalProto: Omit<Rational, "denominator" | "numerator"> =
    {
        [ TypeId ]: TypeId,

        [Hash.symbol](this: Rational): number
        {
            return Hash.combine(Hash.hash(this.numerator), Hash.hash(this.denominator));
        },
        [Equal.symbol](this: Rational, That: unknown): boolean
        {
            return isRational(That) && equals(this, That);
        },
        [ NodeInspectSymbol ](this: Rational)
        {
            return this.toJSON();
        },
        get p(): bigint
        {
            return (this as Rational).numerator;
        },
        pipe()
        {
            /* eslint-disable-next-line prefer-rest-params */
            return pipeArguments(this, arguments);
        },
        get q(): bigint
        {
            return (this as Rational).denominator;
        },
        toJSON(this: Rational)
        {
            return {
                _id: "Rational",
                denominator: String(this.denominator),
                numerator: String(this.numerator)
            };
        },
        toString(this: Rational)
        {
            return `BigDecimal(${ format(this) })`;
        }
    } as const;

export const isRational = (u: unknown): u is Rational => hasProperty(u, TypeId);

export const make = (p: bigint, q: bigint): Rational =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const out: any = Object.create(RationalProto);
    out.numerator = p;
    out.denominator = q;
    return out;
};

/**
 * Internal function used to create pre-normalized {@link Rational | Rationals}.
 *
 * @internal
 */
export const makeNormalizedUnsafe = (p: bigint, q: bigint): Rational =>
{
    if (q <= bigint0)
    {
        throw new RangeError("q must be positive.");
    }

    const out: Rational = make(p, q);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    out.normalized = out;
    return out;
};

const bigint0: bigint = 0n;
const bigint1: bigint = 1n;
const bigint_1: bigint = -1n;

const zero: Rational = makeNormalizedUnsafe(bigint0, bigint1);
const one: Rational = makeNormalizedUnsafe(bigint1, bigint1);

export const normalize = (self: Rational): Rational =>
{
    self.normalized ??= BigInt.isLessThan(self.q, 0n)
        ? make(BigInt.multiply(bigint_1, self.p), BigInt.multiply(bigint_1, self.q))
        : { ...self };

    return self.normalized;
};

export const simplify = (self: Rational): Rational =>
{
    if (self.p === 0n)
    {
        return zero;
    }
    else
    {
        const Gcd: bigint = BigInt.gcd(self.p, self.q);
        return make(self.p / Gcd, self.q / Gcd);
    }
};

export const sum: {
    (that: Rational): (self: Rational) => Rational
    (self: Rational, that: Rational): Rational
} = dual(2, (self: Rational, that: Rational): Rational =>
{
    if (BigInt.Equivalence(self.p, bigint0))
    {
        return self;
    }

    if (BigInt.Equivalence(self.p, bigint0))
    {
        return that;
    }

    if (BigInt.Equivalence(self.q, that.q))
    {
        return make(BigInt.sum(self.p, that.p), self.q);
    }
    else
    {
        const p: bigint = pipe(
            Tuple.make(
                BigInt.multiply(self.p, that.q),
                BigInt.multiply(self.q, that.p)
            ),
            Function.tupled(BigInt.sum)
        );

        const q: bigint = BigInt.multiply(self.q, that.q);

        return make(p, q);
    }
});

export const sumAll = (collection: Iterable<Rational>): Rational =>
{
    let out: Rational = zero;

    for (const n of collection)
    {
        out = sum(out, n);
    }

    return out;
};

export const multiply: {
    (that: Rational): (self: Rational) => Rational
    (self: Rational, that: Rational): Rational
} = dual(2, (self: Rational, that: Rational): Rational =>
{
    if (self.p === bigint0 || that.p === bigint0)
    {
        return zero;
    }

    return make(BigInt.multiply(self.p, that.p), BigInt.multiply(self.q, that.q));
});

export const multiplyAll = (collection: Iterable<Rational>): Rational =>
{
    let out: Rational = one;

    for (const a of collection)
    {
        if (a.p === bigint0)
        {
            return zero;
        }

        out = multiply(out, a);
    }

    return out;
};

export const subtract: {
    (that: Rational): (self: Rational) => Rational
    (self: Rational, that: Rational): Rational
} = dual(2, (self: Rational, that: Rational): Rational =>
{
    if (that.p === bigint0)
    {
        return self;
    }

    if (self.p === bigint0)
    {
        return make(bigint_1 * that.p, that.q);
    }

    const p: bigint = pipe(
        Tuple.make(
            BigInt.multiply(self.p, that.q),
            BigInt.multiply(bigint_1, BigInt.multiply(self.q, that.p))
        ),
        Function.tupled(BigInt.sum)
    );

    const q: bigint = BigInt.multiply(self.q, that.q);

    return make(p, q);
});

export const divide: {
    (that: Rational): (self: Rational) => Option.Option<Rational>
    (self: Rational, that: Rational): Option.Option<Rational>
} = dual(2, (self: Rational, that: Rational): Option.Option<Rational> =>
{
    if (that.p === bigint0)
    {
        return Option.none();
    }

    if (self.p === bigint0)
    {
        return Option.some(zero);
    }

    if (self.p === that.p && self.q === that.q)
    {
        return Option.some(one);
    }

    return Option.some(make(self.p * that.q, self.q * that.p));
});

export const divideUnsafe: {
    (that: Rational): (self: Rational) => Rational
    (self: Rational, that: Rational): Rational
} = dual(2, (self: Rational, that: Rational): Rational =>
{
    if (that.p === bigint0)
    {
        throw new RangeError("Division by zero");
    }

    if (self.p === bigint0)
    {
        return zero;
    }

    if (self.p === that.p && self.q === that.q)
    {
        return one;
    }

    return make(self.p * that.q, self.q * that.p);
});

export const Order: order.Order<Rational> = order.make((self: Rational, that: Rational) =>
{
    const scmp: Ordering.Ordering = order.Number(sign(self), sign(that));
    if (scmp !== 0)
    {
        return scmp;
    }

    try
    {
        return order.BigInt(BigInt.multiply(self.p, that.q), BigInt.multiply(self.q, that.p));
    }
    catch
    {
        const selfSimplified: Rational = simplify(self);
        const thatSimplified: Rational = simplify(that);

        return order.BigInt(
            BigInt.multiply(selfSimplified.p, thatSimplified.q),
            BigInt.multiply(selfSimplified.q, thatSimplified.p)
        );
    }
});

export const isLessThan: {
    (that: Rational): (self: Rational) => boolean;
    (self: Rational, that: Rational): boolean;
} = order.isLessThan(Order);

export const isLessThanOrEqualTo: {
    (that: Rational): (self: Rational) => boolean;
    (self: Rational, that: Rational): boolean;
} = order.isLessThanOrEqualTo(Order);

export const isGreaterThan: {
    (that: Rational): (self: Rational) => boolean;
    (self: Rational, that: Rational): boolean;
} = order.isGreaterThan(Order);

export const isGreaterThanOrEqualTo: {
    (that: Rational): (self: Rational) => boolean;
    (self: Rational, that: Rational): boolean;
} = order.isGreaterThanOrEqualTo(Order);

export const between: {
    (options: {
        minimum: Rational
        maximum: Rational
    }): (self: Rational) => boolean;

    (self: Rational, options: {
        minimum: Rational
        maximum: Rational
    }): boolean;
} = order.isBetween(Order);

export const clamp: {
    (options: {
        minimum: Rational;
        maximum: Rational;
    }): (self: Rational) => Rational;

    (self: Rational, options: {
        minimum: Rational;
        maximum: Rational;
    }): Rational;
} = order.clamp(Order);

export const min: {
    (that: Rational): (self: Rational) => Rational;
    (self: Rational, that: Rational): Rational;
} = order.min(Order);

export const max: {
    (that: Rational): (self: Rational) => Rational;
    (self: Rational, that: Rational): Rational;
} = order.max(Order);

export const sign = (a: Rational): Ordering.Ordering => a.p === bigint0 ? 0 : a.p < bigint0 ? -1 : 1;

export const abs = (a: Rational): Rational =>
{
    if (a.p === bigint0 || BigInt.sign(a.p) === BigInt.sign(a.q))
    {
        return a;
    }
    else
    {
        return make(BigInt.multiply(bigint_1, a.p), a.q);
    }
};

export const negate = (a: Rational): Rational => make(-a.p, a.q);

export const Equivalence: Eq.Equivalence<Rational> = Eq.make((self: Rational, that: Rational) =>
{
    const selfSimplified: Rational = simplify(self);
    const thatSimplified: Rational = simplify(that);

    return selfSimplified.p === thatSimplified.p && selfSimplified.q === thatSimplified.q;
});

export const equals: {
    (that: Rational): (self: Rational) => boolean
    (self: Rational, that: Rational): boolean
} = dual(2, (self: Rational, that: Rational): boolean => Equivalence(self, that));

export const fromBigInt = (p: bigint): Rational => make(p, bigint1);

export const fromNumberUnsafe = (n: number): Rational =>
{
    return Option.getOrThrowWith(fromNumber(n), () => new RangeError(`Number must be finite, got ${ n }`));
};

export const fromNumber = (n: number): Option.Option<Rational> =>
{
    return Option.map(BigDecimal.fromNumber(n), fromBigDecimal);
};

export const fromBigDecimal = (d: BigDecimal.BigDecimal): Rational =>
{
    return simplify(make(d.value, 10n ** BigInt.BigInt(-1 * d.scale)));
};

export const fromString = (s: string): Option.Option<Rational> =>
{
    return Option.map(BigDecimal.fromString(s), fromBigDecimal);
};

export const fromStringUnsafe = (s: string): Rational =>
{
    return Option.getOrThrowWith(fromString(s), () => new Error(`Invalid numerical string: ${ s }`));
};

export const format = (a: Rational): string =>
{
    const normalized: Rational = normalize(a);

    return `${ normalized.p }/${ normalized.q }`;
};

export const toNumberUnsafe = (a: Rational): number =>
{
    const aSimplified: Rational = simplify(a);

    return BigDecimal.toNumberUnsafe(
        BigDecimal.divideUnsafe(
            BigDecimal.fromBigInt(aSimplified.p),
            BigDecimal.fromBigInt(aSimplified.q)
        )
    );
};

export const isInteger = (self: Rational): boolean => simplify(self).q === bigint1;

export const isZero = (self: Rational): boolean => self.p === bigint0;

export const isNegative = (self: Rational): boolean => sign(self) === -1;

export const isPositive = (self: Rational): boolean => sign(self) === 1;

export const ceil = (self: Rational): Rational =>
{
    if (self.p === self.q)
    {
        return one;
    }

    const normalized: Rational = normalize(self);

    const quotient: bigint = BigInt.divideUnsafe(normalized.p, normalized.q);

    if (BigInt.isLessThan(normalized.p, bigint0))
    {
        if (BigInt.isLessThan(normalized.q, BigInt.abs(normalized.p)))
        {
            return fromBigInt(quotient + bigint_1);
        }
        else
        {
            return fromBigInt(quotient);
        }
    }
    else
    {
        if (BigInt.isLessThan(normalized.p, normalized.q))
        {
            return fromBigInt(quotient + bigint1);
        }
        else
        {
            return fromBigInt(quotient);
        }
    }
};

export const truncate = (self: Rational): Rational =>
{
    if (BigInt.isLessThan(BigInt.abs(self.p), self.q))
    {
        return zero;
    }
    else
    {
        return make(
            BigInt.multiply(BigInt.divideUnsafe(self.p, self.q), self.q),
            self.q
        );
    }
};

export const floor = (self: Rational): Rational =>
{
    const truncated: Rational = truncate(self);

    if (isNegative(self) && isGreaterThan(truncated, self))
    {
        return sum(truncated, make(bigint_1, bigint1));
    }

    return truncated;
};
