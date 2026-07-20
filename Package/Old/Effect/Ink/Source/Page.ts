/**
 * Pages are the simplest abstraction provided over {@link \@sorrell/effect-ink/Prompt | Prompts}.
 * They provide a strategy to organize prompts into groups.
 *
 * The usual kind of *page* referred to herein is the aptly-named {@link Page:var}, but there also exists a
 * special kind of page: the {@link TaskPage} page, which displays the progress of long-running tasks
 * which are typically performed at the end of a user journey (that is, after they have provided the
 * application with most or all desired information).
 *
 * @see {@link \@sorrell/effect-ink/Wizard | Wizards} Pages are used by grouping them into `Wizards`.
 * @see {@link Prompt!All} To simply run multiple prompts in serial, use the `All` constructor function.
 *
 * @module @sorrell/effect-ink/Page
 *
 * @file      Page.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Prompt from "./Prompt.ts";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Effect, Record } from "effect";

export type Environment =
    // @TODO
    | never
    | Prompt.Environment;

export type Results<KeyType extends string, ValueType> = Record.ReadonlyRecord<KeyType, ValueType>;

export namespace Results
{
    export type Any = Results<string, unknown>;
}

export namespace Page
{
    export type Error = Prompt.PromptError;
}

export interface Page<A extends Results.Any> extends Effect.Effect<A, Page.Error, Environment>
{

}
