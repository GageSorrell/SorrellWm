/**
 * @file      Effect.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const EffectInternalDummy: string = "";

// import type {
//     StepFactory,
//     StepFromTag,
//     StepTag as StepTagType,
//     UntaggedFromTag
// } from "./Effect.Internal.Types.js";

// export const __DummyExport_Effect_Internal: "DummyExport" = "DummyExport" as const;

// export namespace StepTag
// {
//     export const Detached: unique symbol = Symbol("__Tag_Detached");
//     export const Map: unique symbol = Symbol("__Tag_Map");
//     export const Seed: unique symbol = Symbol("__Tag_Seed");
//     export const SideEffect: unique symbol = Symbol("__Tag_SideEffect");
// }

// export function MakeStep<Tag extends StepTagType>(
// ): StepFactory<Tag>
// {
//     return function(
//         Function: UntaggedFromTag<Tag, ParameterType, A, E, R>
//     ): StepFromTag<Tag, ParameterType, A, E, R>
//     {
//         return Function as StepFromTag<Tag, ParameterType, A, E, R>;
//     };
// }
