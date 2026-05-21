/**
 * @file      Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";
import type { TFunction } from "../Functional/index.ts";

export namespace From
{
    /**
     * Define an {@link Effect.Effect | effect type} such that each type parameter
     * is the respective union, generated from a given {@link FunctionsType | union}
     * of types of functions that return {@link Effect.Effect | effects}.
     *
     * @template FunctionsType - The {@link Array} of functions of some argument vector type(s),
     * which return {@link Effect.Effect | effects}.
     */
    export type Functions<
        FunctionsType extends Array<TFunction<Array<unknown>, Any>>
    > = Effects<ReturnType<FunctionsType[number]>>;

    /**
     * Define an {@link Effect.Effect | effect type} such that each type parameter
     * is the respective union, generated from a given union of {@link Effect.Effect | effects}.
     *
     * @template EffectType - The union of {@link Effect.Effect | effect types} from which
     * this {@link Effect.Effect | effect type} is generated.
     */
    export type Effects<EffectType extends Any> =
        Effect.Effect<
            EffectType extends Effect.Effect<infer SuccessType, unknown, unknown>
                ? SuccessType
                : never,
            EffectType extends Effect.Effect<unknown, infer ErrorType, unknown>
                ? ErrorType
                : never,
            EffectType extends Effect.Effect<unknown, unknown, infer RequirementsType>
                ? RequirementsType
                : never
        >;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/** A type representing *any* {@link Effect.Effect | effect}. */
export type Any = Effect.Effect<any, any, any>;

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * A function that returns an {@link Effect.Effect | effect}.
 *
 * @template ArgumentVectorType - The tuple-type of this function's parameters.
 * @template EffectType - The type of the {@link Effect.Effect | effect} returned by this.
 */
export type Factory<
    ArgumentVectorType extends Array<unknown> = never,
    EffectType extends Any = Any
> =
    [ ArgumentVectorType ] extends [ never ]
        ? {
            (): EffectType;
        }
        : {
            (...ArgumentVector: ArgumentVectorType): EffectType;
        };
