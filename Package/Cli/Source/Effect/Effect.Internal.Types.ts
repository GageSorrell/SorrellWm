/**
 * @file      Effect.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type EffectInternalTypes = string;

// import type { StepTag } from "./Effect.Internal.js";
// import type {
//     DetachedSideEffectStep,
//     EffectFactory,
//     EffectStep,
//     MapStep,
//     SeedStep,
//     SideEffectStep
// } from "./Effect.Types.js";

// /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */

// export type EffectStepAny = EffectStep<any, any, any, any>;

// export type EffectSequenceBase = [ EffectStepAny, EffectStepAny, ...Array<EffectStepAny> ];

// type EffectSequenceTest<StepOne extends EffectStepAny, StepTwo extends EffectStepAny> =
//     StepOne extends SeedStep<infer OneA, any, any>
//         ? StepTwo extends MapStep<infer TwoParameterType, any, any, any>
//             ? OneA extends TwoParameterType
//                 ? true
//                 : false
//             : StepTwo extends SideEffectStep<infer TwoParameterType, any, any>
//                 ? OneA extends TwoParameterType
//                     ? true
//                     : false
//                 : false
//         : StepOne extends MapStep<any, infer OneA, any, any>
//             ? StepTwo extends MapStep<infer TwoParameterType, any, any, any>
//                 ? OneA extends TwoParameterType
//                     ? true
//                     : false
//                 : StepTwo extends SideEffectStep<infer TwoParameterType, any, any>
//                     ? OneA extends TwoParameterType
//                         ? true
//                         : false
//                     : false
//             : StepOne extends SideEffectStep<any, any, any>
//                 ? StepTwo extends DetachedSideEffectStep<any, any>
//                     ? true
//                     : StepTwo extends SeedStep<any, any, any>
//                         ? true
//                         : false
//                 : StepTwo extends SeedStep<any, any, any>
//                     ? true
//                     : false;

// export type EffectSequenceRecurrence<ArrayType extends Array<EffectStepAny>> =
//     ArrayType extends [ infer StepOne, infer StepTwo, ...Array<infer Tail> ]
//         ? StepOne extends EffectStepAny
//             ? StepTwo extends EffectStepAny
//                 ? EffectSequenceTest<StepOne, StepTwo> extends true
//                     ? Tail extends Array<EffectStepAny>
//                         ? EffectSequenceRecurrence<Tail>
//                         : true
//                     : false
//                 : never
//             : never
//         : never;

// export type EffectSequenceLastElement<ArrayType extends Array<EffectStepAny>> =
//     ArrayType extends [ infer StepOne, ...Array<infer Tail> ]
//         ? StepOne extends EffectStepAny
//             ? Tail extends Array<EffectStep>
//                 ? EffectSequenceLastElement<Tail>
//                 : Tail extends EffectStepAny
//                     ? Tail
//                     : never
//             : Tail extends EffectStepAny
//                 ? Tail
//                 : never
//         : never;

// export type ChainSequenceSuccess<ArrayType extends Array<EffectStepAny>> =
//     EffectSequenceLastElement<ArrayType> extends EffectStep<any, infer A, any, any>
//         ? A
//         : never;

// export type ChainSequenceUnion<ArrayType extends Array<EffectStepAny>> =
//     ArrayType extends Array<infer ElementType>
//         ? ElementType extends EffectStep<any, any, infer E, any>
//             ? E
//             : never
//         : never;

// export type UntaggedStep =
//     | Step.Untagged.Detached<any, any>
//     | Step.Untagged.Map<any, any, any, any>
//     | Step.Untagged.Seed<any, any, any>
//     | Step.Untagged.SideEffect<any, any, any>;

// export type TaggedStep<TagType, UntaggedType> =
//     UntaggedType &
//     {
//         __Tag: TagType;
//     };

// export type StepTag =
//     | typeof StepTag.Detached
//     | typeof StepTag.Map
//     | typeof StepTag.Seed
//     | typeof StepTag.SideEffect;

// export type UntaggedFromTag<Tag extends StepTag> =
//     {
//         [ StepTag.Detached ]: Step.Untagged.Detached;
//         [ StepTag.Map ]: Step.Untagged.Map;
//         [ StepTag.Seed ]: Step.Untagged.Seed;
//         [ StepTag.SideEffect ]: Step.Untagged.SideEffect;
//     }[Tag];

// export type StepFromTag<Tag extends StepTag, ParameterType, A, E, R> =
//     {
//         [ StepTag.Detached ]: Step.Tagged.Detached<E, R>;
//         [ StepTag.Map ]: Step.Tagged.Map<ParameterType, A, E, R>;
//         [ StepTag.Seed ]: Step.Tagged.Seed<A, E, R>;
//         [ StepTag.SideEffect ]: Step.Tagged.SideEffect<ParameterType, E, R>;
//     }[Tag];

// export namespace Step
// {
//     export namespace Tagged
//     {
//         export type Seed<A, E = never, R = never> =
//             TaggedStep<typeof StepTag.Seed, Untagged.Seed<A, E, R>>;

//         export type Map<
//             ParameterType,
//             A,
//             E = never,
//             R = never
//         > = TaggedStep<typeof StepTag.Map, Untagged.Map<ParameterType, A, E, R>>;

//         export type SideEffect<
//             ParameterType,
//             E = never,
//             R = never
//         > = TaggedStep<typeof StepTag.SideEffect, Untagged.SideEffect<ParameterType, E, R>>;

//         export type Detached<E = never, R = never> =
//             TaggedStep<typeof StepTag.Detached, Untagged.Detached<E, R>>;
//     }

//     export namespace Untagged
//     {
//         export type Seed<A, E = never, R = never> = EffectFactory<never, A, E, R>;

//         export type Map<
//             ParameterType,
//             A,
//             E = never,
//             R = never
//         > = EffectFactory<ParameterType, A, E, R>;

//         export type SideEffect<
//             ParameterType,
//             E = never,
//             R = never
//         > = EffectFactory<ParameterType, void, E, R>;

//         export type Detached<E = never, R = never> = EffectFactory<never, void, E, R>;
//     }
// }

// export type EffectStep<ParameterType = unknown, A = void, E = never, R = never> =
//     | SeedStep<A, E, R>
//     | MapStep<ParameterType, A, E, R>
//     | SideEffectStep<ParameterType, E, R>
//     | DetachedSideEffectStep<E, R>;

// export type StepFactory<Tag extends StepTag> =
//     {
//         (Function: UntaggedFromTag<Tag, ParameterType, A, E, R>):
//         StepFromTag<Tag, ParameterType, A, E, R>;
//     };
