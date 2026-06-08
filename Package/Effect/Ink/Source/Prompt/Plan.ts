/**
 * @file      Plan.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as TheField from "./Field.ts";
import type { Any as AnyPrompt, Prompt } from "./Prompt.ts";
import type { Effect as TheEffect } from "effect";

export type Plan<A, E, R> =
    | Succeed<A>
    | Effect<A, E, R>
    | SuspendPlan<A, E, R>
    | SuspendEffect<A, E, R>
    | Field<A, E, R>
    | Struct<A, E, R>
    | Map<A, E, R>
    | FlatMap<A, E, R>
    | Tap<A, E, R>
    | ForEach<A, E, R>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Any = Plan<any, any, any>;

export interface Succeed<A>
{
    readonly _tag: "Succeed";
    readonly Value: A;
}

export interface Effect<A, E, R>
{
    readonly _tag: "Effect";
    readonly Effect: TheEffect.Effect<A, E, R>;
}

export interface SuspendPlan<A, E, R>
{
    readonly _tag: "Suspend";
    readonly Evaluate: () => Prompt<A, E, R>;
}

export interface SuspendEffect<A, E, R>
{
    readonly _tag: "SuspendEffect";
    readonly Evaluate: TheEffect.Effect<Prompt<A, E, R>, E, R>;
}

export interface Field<A, E, R>
{
    readonly _tag: "Field";
    readonly Field: TheField.Field<A, E, R>;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export interface Struct<A, _E, _R>
{
    readonly _tag: "Struct";
    readonly Fields: Readonly<Record<string, AnyPrompt>>;
    readonly Decode: (Values: Record<string, unknown>) => A;
}

export interface Map<A, E, R>
{
    readonly _tag: "Map";
    /* eslint-disable @typescript-eslint/no-explicit-any */
    readonly Source: Prompt<any, E, R>;
    readonly Map: (Value: any) => A;
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export interface FlatMap<A, E, R>
{
    readonly _tag: "FlatMap";
    readonly Source: AnyPrompt;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    readonly Continue: (Value: any) => Prompt<A, E, R>;
}

export interface Tap<A, E, R>
{
    readonly _tag: "Tap";
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    readonly Source: Prompt<A, any, any>;
    readonly Tap: (Value: A) => TheEffect.Effect<unknown, E, R>;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export interface ForEach<A, _E, _R>
{
    readonly _tag: "ForEach";
    readonly Items: ReadonlyArray<unknown>;
    readonly MakePrompt: (Item: unknown, Index: number) => AnyPrompt;
    readonly Decode: (Values: ReadonlyArray<unknown>) => A;
}
