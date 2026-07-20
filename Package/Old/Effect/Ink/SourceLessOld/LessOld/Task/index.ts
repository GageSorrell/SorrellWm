/**
 * Describe tasks that run in response to the user completing prompts.
 * Tasks are displayed in a list, which can be equipped with a "miniature terminal"
 * that displays scrolling output emitted by tasks.  Tasks can also be equipped with
 * progress, which can be represented as indeterminate, a percentage, or a proportion.
 *
 * This module is inspired by {@link https://www.npmjs.com/package/listr2 | listr2}.
 *
 * @module @sorrell/effect-ink/Task
 */

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * as Group from "./Group.ts";
export * as Output from "./Output.ts";
export * as Log from "./Log.ts";
export * as Task from "./Task.ts";
export * as TaskState from "./TaskState.ts";
