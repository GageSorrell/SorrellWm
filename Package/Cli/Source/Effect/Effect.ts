/**
 * @file      Effect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

import type { EffectSequenceArgument, SequenceEffect } from "./Effect.Types.js";
import type { Effect } from "effect";
import { StepTag, type EffectStepAny } from "./Effect.Internal.Types.js";
import { MakeStep } from "./Effect.Internal.js";

export namespace Step
{
    const Map = MakeStep<StepTag.Map ParameterType, A, E = never, R = never>(
        Step: Step.Map.Untagged<E, R>
    ): Step.Map.Tagged<E, R>
    {

    }

    function SideEffect<ParameterType, E = never, R = never>(
        Step: Step.SideEffect.Untagged<E, R>
    ): Step.SideEffect.Tagged<E, R>
    {

    }
    function Detached<E = never, R = never>(
        Step: Step.Detached.Untagged<E, R>
    ): Step.Detached.Tagged<E, R>
    {

    }
    function Seed<A, E = never, R = never>(
        Step: Step.Seed.Untagged<E, R>
    ): Step.Seed.Tagged<E, R>
    {

    }
}

export function RunMixedSteps<A, SequenceTail extends Array<EffectStepAny>>(
    EffectSequence: EffectSequenceArgument<A, SequenceTail>
): SequenceEffect<typeof EffectSequence>
{
    const [ Seed, ...Tail ] = EffectSequence;

    return Tail.reduce(
        (CurrentEffect, CurrentStep) =>
        {
            switch (CurrentStep.Type)
            {
                case "Map":
                {
                    return CurrentEffect.pipe(
                        Effect.flatMap(CurrentStep.Run)
                    );
                }

                case "SideEffect":
                {
                    return CurrentEffect.pipe(
                        Effect.tap(CurrentStep.Run)
                    );
                }

                case "DetachedSideEffect":
                {
                    return CurrentEffect.pipe(
                        Effect.tap(() => CurrentStep.Run())
                    );
                }

                default:
                {
                    return CurrentEffect;
                }
            }
        },
        First.Run()
    );
}
