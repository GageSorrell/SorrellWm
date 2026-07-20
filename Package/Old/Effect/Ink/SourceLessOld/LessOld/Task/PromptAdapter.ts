/**
 * Scope task creation, handling, and lifetime to durations within prompts.
 *
 * @module @sorrell/effect-ink/Task/PromptAdapter
 */
/**
 * @file      PromptAdapter.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";
import type { Task as TaskModule } from "./index.ts";

export const Task = <PromptResults, E = never, R = never>(
    _Options: TaskModule.Options,
    _TaskFn: (Results: PromptResults) => Effect.Effect<void, E, R>
) =>
{

};

export const TaskGroup = () =>
{

};
