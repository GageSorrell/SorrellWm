/**
 * @file      Complex.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FComplex } from "./Complex.ts";
import type { FVector2D } from "./Vector.ts";

type FFnRealArgument = (X: number) => number;
type FFnComplexArgument = (Z: FComplex) => number;

type FFnEitherArgument =
    | FFnComplexArgument
    | FFnRealArgument;

export type FMath = Readonly<{
    E: number;
    LN10: number;
    LN2: number;
    LOG2E: number;
    LOG10E: number;
    PI: number;
    SQRT1_2: number;
    SQRT2: number;

    abs: FFnEitherArgument;

    acos: FFnRealArgument;
    asin: FFnRealArgument;
    atan: FFnRealArgument;
    atan2: (Y: number, X: number) => number;
    cos: FFnRealArgument;
    sin: FFnRealArgument;
    tan: FFnRealArgument;

    ceil: (Z: FComplex) => FComplex;
    f16round: (Z: FComplex) => FComplex;
    floor: (Z: FComplex) => FComplex;
    fround: (Z: FComplex) => FComplex;
    max: (...Values: Array<FComplex>) => FComplex;
    min: (...Values: Array<FComplex>) => FComplex;
    round: (Z: FComplex) => FComplex;
    trunc: (Z: FComplex) => FComplex;

    cbrt: (Z: FComplex) => FComplex;
    expm1: FFnRealArgument;
    exp: (Z: FComplex) => FComplex;
    log: (Z: FComplex) => FComplex;
    log10: (Z: FComplex) => FComplex;
    log1p: (Z: FComplex) => FComplex;
    log2: (Z: FComplex) => FComplex;
    pow: (Base: number, Power: number) => number;
    sqrt: (Z: FComplex) => FComplex;

    random: () => FComplex;
    clz32: {
        (X: number): number;
        (Z: FComplex): FVector2D;
    };
    imul: (Z: FComplex, W: FComplex) => FComplex;
    sign: {
        (X: number): -1 | 0 | 1;
        (Z: FComplex): -1 | 0 | 1;
    };

    acosh: FFnRealArgument;
    asinh: FFnRealArgument;
    atanh: FFnRealArgument;
    cosh: FFnRealArgument;
    sinh: FFnRealArgument;
    tanh: FFnRealArgument;

    hypot: {
        (...Values: Array<number>): number;
        (...Values: Array<FComplex>): number;
        (...Values: Array<FComplex | number>): number;
    };
}>;
