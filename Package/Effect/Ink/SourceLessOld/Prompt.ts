/**
 * Create and manage prompt state.
 *
 * @module @sorrell/effect-ink/Prompt
 */

/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Cli from "effect/unstable/cli/Prompt";
import { type Effect, Predicate } from "effect";
import type { Covariant } from "effect/Types";
import type { Renderer } from "./Renderer.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Prompt";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

/**
 * A `Prompt` is an {@link Effect!Effect | effect} that, when executed, conveys information
 * to the user via the terminal, usually for the purpose of gathering data from the user, or
 * displaying information leading to or resulting from data that was gathered from the user.
 *
 * The `Prompt`s that gather data from the user are {@link \@sorrell/effect-ink/Field | Fields} (the
 * prototypal *prompts*); there also exist {@link \@sorrell/effect-ink/Prose | Prose} prompts which only
 * display information to the user (such as headings and extended descriptions), and
 * {@link \@sorrell/effect-ink/Task | Tasks}, which convey the progress of work that is done by
 * the application in response to receiving input from the user.
 *
 * @template A - The success type of this `Prompt`.
 * @template E - The error type of this `Prompt`.
 * @template R - The requirements type of this `Prompt`.
 *
 * @category models
 * @since 1.0.0
 */
export interface Prompt<A, E = never, R = never> extends Effect.Effect<A, E | PromptError, R | Environment>
{
    readonly [ TypeId ]:
    {
        readonly _A: Covariant<A>;
        readonly _E: Covariant<E>;
        readonly _R: Covariant<R>;
    };
}

/**
 * Returns `true` if the provided value is a `Prompt`.
 *
 * @category guards
 * @since 1.0.0
 */
export const isPrompt = (u: unknown): u is Prompt<unknown> => Predicate.hasProperty(u, TypeId);

export type Environment =
    | Cli.Environment
    | Renderer;

export const Run = (_: unknown) => _ as Effect.Effect<any>;

/**
 * @todo This should be the union of errors from the {@link Environment}.
 */
export type PromptError = never;
