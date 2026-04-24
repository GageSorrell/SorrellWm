/**
 * @file      Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    ChainSequenceSuccess,
    EffectSequenceRecurrence,
    EffectStepAny
} from "./Effect.Internal.Types.js";
import type { Effect } from "effect";
import type { TMaybeArray } from "@sorrell/utilities/array";

/* eslint-disable @typescript-eslint/naming-convention */

export type EffectFactory<
    ParameterType extends TMaybeArray<unknown>,
    A = void,
    E = never,
    R = never
> =
    [ ParameterType ] extends [ never ]
        ? {
            (): Effect.Effect<A, E, R>;
        }
        : ParameterType extends Array<unknown>
            ? {
                (...ArgumentVector: ParameterType):Effect.Effect<A, E, R>;
            }
            : {
                (Argument: ParameterType): Effect.Effect<A, E, R>;
            };

/* eslint-disable @typescript-eslint/no-explicit-any */

// export type EffectSequence<ArrayType extends EffectSequenceBase> =
//     EffectSequenceRecurrence<ArrayType> extends true
//         ? ArrayType extends [ SeedStep<any, any, any>, infer StepTwo, ...Array<EffectStepAny> ]
//             ? StepTwo extends SeedStep<any, any, any>
//                 ? never
//                 : ArrayType
//             : never
//         : never;

export type EffectSequenceSafe<ArrayType extends Array<EffectStepAny>> =
    EffectSequenceRecurrence<ArrayType> extends true
        ? ArrayType
        : never;

export type EffectSequenceArgument<
    SeedA,
    Tail extends Array<EffectStepAny>
> =
    [
        SeedStep<SeedA, any, any>,
        (
            | MapStep<SeedA, any, any, any>
            | SideEffectStep<SeedA, any, any>
        ),
        ...EffectSequenceSafe<Tail>
    ];

export type SequenceEffect<ArrayType extends Array<EffectStepAny>> =
    ArrayType extends Array<infer ElementType>
        ? ElementType extends EffectStep<any, any, infer E, infer R>
            ? Effect.Effect<ChainSequenceSuccess<ArrayType>, E, R>
            : never
        : never;

/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/naming-convention */
