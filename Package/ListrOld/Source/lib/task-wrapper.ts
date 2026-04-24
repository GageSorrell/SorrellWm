/**
 * @file      task-wrapper.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

import type {
    ListrRendererSubclass,
    ListrSubClassOptions,
    ListrTask } from "@interfaces/index.js";
import { ListrTaskEventType, ListrTaskState } from "@constants/index.js";
import { createWritable, splat } from "@utils/index.js";
import { Listr } from "@root/index.js";
import { ListrError } from "@interfaces/index.js";
import type { ListrErrorTypes } from "@constants/index.js";
import type { ListrPromptAdapter } from "@utils/index.js";
import type { SubtasksFactoryFn } from "@interfaces/TaskResult.js";
import type { TMaybeArray } from "@sorrell/utilities/misc";
import type { Task } from "@lib/index.js";
import type { Writable } from "stream";

/**
 * The original Task that is defined by the user is wrapped with
 * the TaskWrapper to provide additional functionality.
 *
 * @see {@link https://listr2.kilic.dev/task/task.html}
 */
export class TaskWrapper<
    ContextType,
    SubtaskContextType,
    ParentContextType,
    RendererType extends ListrRendererSubclass,
    FallbackRendererType extends ListrRendererSubclass
>
{
    constructor(public Task: Task<
        ContextType,
        SubtaskContextType,
        ParentContextType,
        RendererType,
        FallbackRendererType
    >) { }

    get title(): string
    {
        return this.Task.Title;
    }

    /**
     * Title of the current task.
     *
     * @see {@link https://listr2.kilic.dev/task/title.html}
     */
    set title(title: string | Array<string>)
    {
        title = Array.isArray(title) ? title : [ title ];

        this.Task.title$ = splat(title.shift(), ...title);
    }

    get output(): string
    {
        return this.Task.Output;
    }

    /**
     * Send output from the current task to the renderer.
     *
     * @see {@link https://listr2.kilic.dev/task/output.html}
     */
    set output(output: TMaybeArray<string>)
    {
        output = Array.isArray(output) ? output : [ output ];

        this.Task.output$ = splat(output.shift(), ...output);
    }

    /** Send an output to the output channel as prompt. */
    private set promptOutput(output: string)
    {
        this.Task.promptOutput$ = output;
    }

    /**
     * Creates a new set of Listr subtasks.
     *
     * @see {@link https://listr2.kilic.dev/task/subtasks.html}
     */
    public NewListr(
        Task:
            | TMaybeArray<ListrTask<
                SubtaskContextType,
                unknown,
                ContextType,
                RendererType,
                FallbackRendererType
            >>
            | SubtasksFactoryFn<
                ContextType,
                SubtaskContextType,
                ParentContextType,
                RendererType,
                FallbackRendererType
            >,
        Options?: ListrSubClassOptions<SubtaskContextType, RendererType, FallbackRendererType>
    ): Listr<SubtaskContextType, unknown, ContextType, RendererType, FallbackRendererType>
    {
        let tasks: TMaybeArray<ListrTask<
            SubtaskContextType,
            unknown,
            ContextType,
            RendererType,
            FallbackRendererType
        >>;

        if (typeof Task === "function")
        {
            tasks = Task(this);
        }
        else
        {
            tasks = Task;
        }

        return new Listr<
            SubtaskContextType,
            unknown,
            ContextType,
            RendererType,
            FallbackRendererType
        >(tasks, Options, this.Task);
    }

    /**
     * Report an error that has to be collected and handled.
     *
     * @see {@link https://listr2.kilic.dev/task/error-handling.html}
     * @example
     */
    public Report(error: unknown, type: ListrErrorTypes): void
    {
        if (this.Task.Options.collectErrors !== false)
        {
            this.Task.Listr.Errors.push(
                new ListrError<ContextType, SubtaskContextType, ParentContextType>(error, type, this.Task)
            );
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof error.message === "string"
        )
        {
            this.Task.message$ = { Error: error.message ?? this.Task?.Title };
        }
    }

    /**
     * Skip the current task.
     *
     * @see {@link https://listr2.kilic.dev/task/skip.html}
     * @example
     */
    public Skip(message?: string, ...metadata: Array<unknown>): void
    {
        this.Task.state$ = ListrTaskState.SKIPPED;

        if (message)
        {
            this.Task.message$ = { Skip: message ? splat(message, ...metadata) : this.Task?.Title };
        }
    }

    /**
     * Check whether this task is currently in a retry state.
     *
     * @see {@link https://listr2.kilic.dev/task/retry.html}
     */
    public IsRetrying(): Task<ContextType, SubtaskContextType, ParentContextType>["Retry"]
    {
        return this.Task.IsRetrying()
            ? this.Task.Retry
            : { Count: 0 };
    }

    /**
     * Create a new prompt for getting user input through the prompt adapter.
     * This will create a new prompt through the adapter if the task is not currently rendering a prompt or will return the active instance.
     *
     * This part of the application requires optional peer dependencies, please refer to documentation.
     *
     * @see {@link https://listr2.kilic.dev/task/prompt.html}
     * @example
     */
    public Prompt<T extends ListrPromptAdapter = ListrPromptAdapter>(
        adapter: new (
            task: Task<
                ContextType,
                SubtaskContextType,
                ParentContextType,
                RendererType,
                FallbackRendererType
            >,
            wrapper: TaskWrapper<
                ContextType,
                SubtaskContextType,
                ParentContextType,
                RendererType,
                FallbackRendererType
            >
        ) => T
    ): T
    {
        if (this.Task.Prompt)
        {
            return this.Task.Prompt as T;
        }

        return new adapter(this.Task, this);
    }

    /**
     * Generates a fake stdout for your use case, where it will be tunnelled through Listr to handle the rendering process.
     *
     * @see {@link https://listr2.kilic.dev/renderer/process-output.html}
     * @example
     */
    public Stdout(type?: ListrTaskEventType.OUTPUT | ListrTaskEventType.PROMPT): Writable
    {
        return createWritable((chunk: string): void =>
        {
            switch (type)
            {
                case ListrTaskEventType.PROMPT:
                    this.promptOutput = chunk;

                    break;

                default:
                    this.output = chunk;
            }
        });
    }

    /** Run this task. */
    public Run(Context: ContextType): Promise<void>
    {
        return this.Task.Run(Context, this);
    }
}
