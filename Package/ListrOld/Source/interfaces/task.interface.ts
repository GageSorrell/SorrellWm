/**
 * @file      task.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    ListrDefaultRenderer,
    ListrPrimaryRendererTaskOptions,
    ListrRendererSubclass,
    ListrSecondaryRendererTaskOptions } from "./renderer.interface.js";
import type { Task, TaskWrapper } from "@lib/index.js";
import type { ListrContext } from "./listr.interface.js";
import type { ListrPromptAdapter } from "@utils/index.js";
import type { TMaybeArray } from "@sorrell/utilities/misc";
import type { TaskResult } from "./TaskResult.js";

/**
 * Defines the task, conditions and options to run a specific task in the Listr.
 * This defines the external API for the task where {@link TaskWrapper} is used internally.
 * @see {@link https://listr2.kilic.dev/task/task.html}
 */
export interface ListrTask<
    ContextType = ListrContext,
    SubtaskContextType = ListrContext,
    ParentContextType = ListrContext,
    Renderer extends ListrRendererSubclass = ListrDefaultRenderer,
    FallbackRenderer extends ListrRendererSubclass = ListrDefaultRenderer
> extends
    ListrPrimaryRendererTaskOptions<Renderer>,
    ListrSecondaryRendererTaskOptions<FallbackRenderer>
{
    /**
     * Title of the task.
     *
     * Give this task a title to enhance it on the preferred renderer.
     *
     * - Tasks without a title will be hidden from view in renderers and will act as a background task.
     * @see {@link https://listr2.kilic.dev/task/title.html}
     *
     *
     */
    Title?: TMaybeArray<string>;

    /**
     * The task itself in the form of a \`Function\`, \`Promise\`, \`Listr\`, \`Observable\` or \`Stream`.
     *
     * - Task will be executed, whenever the provided criterion is met with the current state and
     * whenever the time for that specific task has come.
     * @see {@link https://listr2.kilic.dev/task/task.html}
     *
     *
     */
    Task: ListrTaskFn<ContextType, SubtaskContextType, ParentContextType, Renderer, FallbackRenderer>;

    /**
     * Enable a task depending on the context.
     *
     * - The callback function will be evaluated before all the tasks start to
     * check which tasks has been enabled.
     * - The callback function will be evaluated again before the task starts.
     * @see {@link https://listr2.kilic.dev/task/enable.html}
     *
     *
     */
    Enabled?: boolean | ((Context: ContextType) => boolean | Promise<boolean>)

    /**
     * Skip this task depending on the context.
     *
     * - The callback function will be evaluated once before the task starts.
     * @see {@link https://listr2.kilic.dev/task/skip.html}
     *
     *
     */
    Skip?: boolean | string | ((Context: ContextType) => boolean | string | Promise<boolean | string>)

    /**
     * Retries a task with the given amounts whenever a task fails.
     * @see {@link https://listr2.kilic.dev/task/retry.html}
     *
     *
     */
    Retry?: number | { tries: number; delay?: number }

    /**
     * The callback function that you provide will run whenever the attached task fails and
     * give you the ability to revert your changes, before failing.
     * @see {@link https://listr2.kilic.dev/task/rollback.html}
     *
     *
     */
    Rollback?: ListrTaskFn<ContextType, SubtaskContextType, ParentContextType, Renderer, FallbackRenderer>;

    /**
     * Determine the default behavior of exiting on errors for this attached task.
     */
    ExitOnError?: boolean | ((Context: ContextType) => boolean | Promise<boolean>)
}

/**
 * Result of the processed task can be any of the supported types.
 */
export type ListrTaskResult<
    ContextType,
    SubtaskContextType,
    ParentContextType,
    RendererType extends ListrRendererSubclass,
    FallbackRendererType extends ListrRendererSubclass
> =
    | TaskResult.Return.Exit
    | TaskResult.Return.Failure
    | TaskResult.Return.Subtasks<
        ContextType,
        SubtaskContextType,
        ParentContextType,
        RendererType,
        FallbackRendererType
    >
    | TaskResult.Return.Success;

// export type ListrTaskResult<ContextType> =
//     | string
//     | Promise<any>
//     | Listr<ContextType, ListrRendererValue, ListrRendererValue>
//     | ReadableLike
//     | ObservableLike<any>

/**
 * The callback function from the user that defines the task.
 */
export type ListrTaskFn<
    ContextType,
    SubtaskContextType,
    ParentContextType,
    Renderer extends ListrRendererSubclass = ListrDefaultRenderer,
    FallbackRenderer extends ListrRendererSubclass = ListrDefaultRenderer
> =
    {
        (
            Context: ContextType,
            Task: TaskWrapper<ContextType, SubtaskContextType, ParentContextType, Renderer, FallbackRenderer>
        ): Promise<ListrTaskResult<
            ContextType,
            SubtaskContextType,
            ParentContextType,
            Renderer,
            FallbackRenderer
        >>;
    };

/**
 * Tasks can have attached prompts to them.
 */
export type ListrTaskPrompt = ListrPromptAdapter;

/**
 * Tasks can retry themselves when defined.
 *
 * - This holds the value of the current error and the current retry attempt.
 */
export interface ListrTaskRetry
{
    Count: number
    Error?: unknown
}

/**
 * Task can provide additional information depending on the current state of the Task.
 *
 * TaskMessage is used to propagate these messages to the renderers for displaying them to the end-user.
 */
export interface ListrTaskMessage
{
    /** Elapsed time of the current task, whenever the Task completes. */
    Duration?: number

    /** Error message from the current task, whenever the Task fails. */
    Error?: string

    /** Skip message from the current task, whenever the Task skips. */
    Skip?: string

    /** Rollback message from the current task, whenever the Task finishes rollback. */
    Rollback?: string

    /** Retry message from the current task, whenever the Task tries to retry. */
    Retry?: ListrTaskRetry

    /** Holds the time as epoch time of when will this task continue to execute. */
    Paused?: number
}

/**
 * Listr Task after the renderer has been selected and renderer related options removed.
 */
export type ListrRendererTask<SelectedRenderer extends ListrRendererSubclass = ListrRendererSubclass> =
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Task<any, any, any, SelectedRenderer, SelectedRenderer>;
