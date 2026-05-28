/**
 * @file      Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Path as EffectPath, FileSystem } from "@effect/platform";
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

/* eslint-disable @stylistic/max-len */

/**
 * Types having to do with
 * {@link https://effect.website/docs/getting-started/the-effect-type/#type-parameters:~:text=type%20never.-,Requirements,the%20effect%20has%20no%20requirements%20and%20the%20Context%20collection%20is%20empty.,-Type%20Parameter%20Abbreviations | requirements}
 * in {@link Effect.Effect | effects}.
 */
export namespace Requirements
{
    /* eslint-enable @stylistic/max-len */

    /**
     * The {@link FileSystem} and {@link EffectPath | Path} requirement types.
     *
     * This is motivated by the observation that these are typically used together,
     * and by the inconvenience of otherwise having to import {@link EffectPath | Path} as
     * `EffectPath` to conform to the
     * {@link https://github.com/GageSorrell/SorrellWm/tree/Master/Package/EsLintConfigSorrell#ReadMe |
     * Sorrell style guide}.
     */
    export type FsPath =
        | FileSystem.FileSystem
        | EffectPath.Path;
}

/**
 * Given a {@link BaseEffectType}, define a new {@link Effect.Effect | effect} type
 * whose type parameters are the respective unions formed by appending {@link A}, {@link E},
 * and {@link R} to their respective type parameters in the base effect type.
 *
 * @template BaseEffectType - The {@link Effect.Effect | effect} type whose type parameters are
 * appended with the other type parameters in this type.
 *
 * @template A - The `A` type to append to the `A` type of the given {@link BaseEffectType}.
 * @template E - The `E` type to append to the `E` type of the given {@link BaseEffectType}.
 * @template R - The `R` type to append to the `R` type of the given {@link BaseEffectType}.
 */
export type Append<BaseEffectType extends Any, A = never, E = never, R = never> =
    BaseEffectType extends Effect.Effect<infer InA, infer InE, infer InR>
        ? Effect.Effect<
            InA | A,
            InE | E,
            InR | R
        >
        : never;

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
