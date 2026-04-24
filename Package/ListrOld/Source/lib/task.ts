/**
 * @file      task.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// @TODO TEMPORARY
/* eslint-disable jsdoc/require-returns */

import { ExitSymbol, FailureSymbol, SubtasksSymbol, SuccessSymbol } from "@interfaces/TaskResult.Internal.js";
import { type Listr, SilentRenderer } from "@root/index.js";
import type {
    ListrDefaultRenderer,
    ListrGetRendererOptions,
    ListrGetRendererTaskOptions,
    ListrOptions,
    ListrRendererSubclass,
    ListrTask,
    ListrTaskFn,
    ListrTaskMessage,
    ListrTaskPrompt,
    ListrTaskResult,
    ListrTaskRetry
} from "@interfaces/index.js";
import { ListrErrorTypes, ListrEventType, ListrTaskEventType, ListrTaskState } from "@constants/index.js";
import type { Tag, TaskResult } from "@interfaces/TaskResult.js";
import {
    assertFunctionOrSelf,
    cleanseAnsi,
    delay,
    splat } from "@utils/index.js";
import { Inflectors } from "en-inflectors";
import { ListrTaskEventManager } from "./listr-task-event-manager.js";
import { PromptError } from "@interfaces/index.js";
import type { TaskWrapper } from "./task-wrapper.js";
import type { TensedTitle } from "./Tensed.Types.js";
import { randomUUID } from "crypto";

/**
 * Creates and handles a runnable instance of the Task.
 */
export class Task<
    ContextType,
    SubtaskContextType,
    ParentContextType,
    Renderer extends ListrRendererSubclass = ListrDefaultRenderer,
    FallbackRenderer extends ListrRendererSubclass = ListrDefaultRenderer
> extends ListrTaskEventManager
{
    /** Unique id per task, can be used for identifying a Task. */
    public Id: string = randomUUID();
    /** The current state of the task. */
    public State: ListrTaskState = ListrTaskState.WAITING;
    /** Subtasks of the current task. */
    public Subtasks: Array<Task<SubtaskContextType, unknown, ContextType, Renderer, FallbackRenderer>>;

    /** The title of this task. */
    public Title?: string;

    /** Initial/Untouched version of the title for using whenever task has a reset. */
    public readonly InitialTitle?: string;

    /** Output channel for the task. */
    public Output?: string;

    /** Current state of the retry process whenever the task is retrying. */
    public Retry?: ListrTaskRetry;

    /**
     * A channel for messages.
     *
     * This requires a separate channel for messages like error, skip or runtime messages
     * to further utilize in the renderers.
     */
    public Message: ListrTaskMessage = { };
    /** Current prompt instance or prompt error whenever the task is prompting. */
    public Prompt: ListrTaskPrompt;
    /** Parent task of the current task. */
    public Parent?: Task<ParentContextType, ContextType, unknown, Renderer, FallbackRenderer>;

    /** Enable flag of this task. */
    private Enabled: boolean;
    /** User provided Task callback function to run. */
    private TaskFn: ListrTaskFn<
        ContextType,
        SubtaskContextType,
        ParentContextType,
        Renderer,
        FallbackRenderer
    >;

    /**
     * Marks the task as closed. This is different from finalized since this is not
     * really related to task itself.
     */
    private closed: boolean;

    constructor(
        public Listr: Listr<
            ContextType,
            SubtaskContextType,
            ParentContextType,
            Renderer,
            FallbackRenderer
        >,
        public Task: ListrTask<
            ContextType,
            SubtaskContextType,
            ParentContextType,
            Renderer,
            FallbackRenderer
        >,
        public Options: ListrOptions<ContextType>,
        public RendererOptions:
            | ListrGetRendererOptions<Renderer>
            | ListrGetRendererOptions<FallbackRenderer>,
        // /** Per-task options for the current renderer of the task. */
        public RendererTaskOptions:
            | ListrGetRendererTaskOptions<Renderer>
            | ListrGetRendererTaskOptions<FallbackRenderer>
    )
    {
        super();

        if (Task.Title)
        {
            const Title: Array<string> = Array.isArray(Task?.Title)
                ? Task.Title
                : [ Task.Title ];

            this.Title = splat(Title.shift(), ...Title);
            this.InitialTitle = this.Title;
        }

        this.TaskFn = Task.Task;
        this.Parent = Listr.ParentTask;
    }

    /**
     * Update the current state of the Task and emit the necessary events.
     */
    set state$(InState: ListrTaskState)
    {
        this.State = InState;

        this.emit(ListrTaskEventType.STATE, InState);

        // cancel the subtasks if this has already failed
        if (this.HasSubtasks() && this.HasFailed())
        {
            type Subtask = Task<unknown, unknown, unknown, Renderer, FallbackRenderer>;
            for (const subtask of this.Subtasks as Array<Subtask>)
            {
                if (subtask.State === ListrTaskState.STARTED)
                {
                    subtask.state$ = ListrTaskState.FAILED;
                }
            }
        }

        this.Listr.Events.emit(ListrEventType.SHOULD_REFRESH_RENDER);
    }

    /**
     * Update the current output of the Task and emit the necessary events.
     */
    set output$(data: string)
    {
        this.Output = data;

        this.emit(ListrTaskEventType.OUTPUT, data);
        this.Listr.Events.emit(ListrEventType.SHOULD_REFRESH_RENDER);
    }

    /**
     * Update the current prompt output of the Task and emit the necessary events.
     */
    set promptOutput$(data: string)
    {
        this.emit(ListrTaskEventType.PROMPT, data);

        // this acts weird without cleansing the output!, have no idea why
        // it produces double output when a prompt is canceled
        if (cleanseAnsi(data))
        {
            this.Listr.Events.emit(ListrEventType.SHOULD_REFRESH_RENDER);
        }
    }

    /**
     * Update or extend the current message of the Task and emit the necessary events.
     */
    set message$(Data: Task<ContextType, SubtaskContextType, ParentContextType>["Message"])
    {
        this.Message = { ...this.Message, ...Data };

        this.emit(ListrTaskEventType.MESSAGE, Data);
        this.Listr.Events.emit(ListrEventType.SHOULD_REFRESH_RENDER);
    }

    /**
     * Update the current title of the Task and emit the necessary events.
     */
    set title$(title: string)
    {
        this.Title = title;

        this.emit(ListrTaskEventType.TITLE, title);
        this.Listr.Events.emit(ListrEventType.SHOULD_REFRESH_RENDER);
    }

    /**
     * Current task path in the hierarchy.
     */
    get Path(): Array<string>
    {
        return [ ...this.Listr.Path, this.InitialTitle ];
    }

    /**
     * Checks whether the current task with the given context should be set as enabled.
     * @example
     */
    public async check(Context: ContextType): Promise<boolean>
    {
        // Check if a task is enabled or disabled
        if (this.State === ListrTaskState.WAITING)
        {
            this.Enabled = await assertFunctionOrSelf(this.Task?.Enabled ?? true, Context) as boolean;

            this.emit(ListrTaskEventType.ENABLED, this.Enabled);
            this.Listr.Events.emit(ListrEventType.SHOULD_REFRESH_RENDER);
        }

        return this.Enabled;
    }

    /** Returns whether this task has subtasks. */
    public HasSubtasks(): boolean
    {
        return this.Subtasks?.length > 0;
    }

    /** Returns whether this task is finalized in some form. */
    public HasFinalized(): boolean
    {
        return this.IsCompleted() || this.HasFailed() || this.IsSkipped() || this.HasRolledBack();
    }

    /** Returns whether this task is in progress. */
    public IsPending(): boolean
    {
        return this.IsStarted() || this.IsPrompt() || this.HasReset();
    }

    /** Returns whether this task has started. */
    public IsStarted(): boolean
    {
        return this.State === ListrTaskState.STARTED;
    }

    /** Returns whether this task is skipped. */
    public IsSkipped(): boolean
    {
        return this.State === ListrTaskState.SKIPPED;
    }

    /** Returns whether this task has been completed. */
    public IsCompleted(): boolean
    {
        return this.State === ListrTaskState.COMPLETED;
    }

    /** Returns whether this task has been failed. */
    public HasFailed(): boolean
    {
        return this.State === ListrTaskState.FAILED;
    }

    /** Returns whether this task has an active rollback task going on. */
    public IsRollingBack(): boolean
    {
        return this.State === ListrTaskState.ROLLING_BACK;
    }

    /** Returns whether the rollback action was successful. */
    public HasRolledBack(): boolean
    {
        return this.State === ListrTaskState.ROLLED_BACK;
    }

    /** Returns whether this task has an actively retrying task going on. */
    public IsRetrying(): boolean
    {
        return this.State === ListrTaskState.RETRY;
    }

    /** Returns whether this task has some kind of reset like retry and rollback going on. */
    public HasReset(): boolean
    {
        return this.State === ListrTaskState.RETRY || this.State === ListrTaskState.ROLLING_BACK;
    }

    /** Returns whether enabled function resolves to true. */
    public IsEnabled(): boolean
    {
        return this.Enabled;
    }

    /** Returns whether this task actually has a title. */
    public HasTitle(): boolean
    {
        return typeof this?.Title === "string";
    }

    /** Returns whether this task has a prompt inside. */
    public IsPrompt(): boolean
    {
        return this.State === ListrTaskState.PROMPT;
    }

    /** Returns whether this task is currently paused. */
    public IsPaused(): boolean
    {
        return this.State === ListrTaskState.PAUSED;
    }

    /** Returns whether this task is closed. */
    public IsClosed(): boolean
    {
        return this.closed;
    }

    /** Pause the given task for certain time. */
    public async pause(time: number): Promise<void>
    {
        const state: ListrTaskState = this.State;

        this.state$ = ListrTaskState.PAUSED;
        this.message$ = {
            Paused: Date.now() + time
        };
        await delay(time);
        this.state$ = state;
        this.message$ = {
            Paused: null
        };
    }

    /** Run the current task. */
    public async Run(
        Context: ContextType,
        Wrapper: TaskWrapper<
            ContextType,
            SubtaskContextType,
            ParentContextType,
            Renderer,
            FallbackRenderer
        >
    ): Promise<void>
    {
        const HandleResult = async (
            Result: ListrTaskResult<
                ContextType,
                SubtaskContextType,
                ParentContextType,
                Renderer,
                FallbackRenderer>
        ): Promise<void> =>
        {
            const HandleSuccess = async (): Promise<void> =>
            {
                const Title: string | undefined = ((): string =>
                {
                    /**
                     * `this.Title.split(" ").length > 0` is guaranteed by
                     * the {@link TensedTitle} type.
                     */
                    const Words: Array<string> = this.Title.split(" ");
                    const [ TitlePresentParticiple, ...TitleTail ] = Words;

                    if (TitlePresentParticiple === undefined)
                    {
                        return undefined;
                    }

                    const TitleVerb: string = new Inflectors(TitlePresentParticiple).toPast();

                    return [ TitleVerb, TitleTail ].join(" ");
                })();

                if (Title !== undefined)
                {
                    this.Title = Title;
                }
            };

            const HandleFailure = async (): Promise<void> =>
            {
                const { Tag: _, ...Death } = (Result as TaskResult.Return.Failure);

                if ("Die" in Death && Death.Die === true)
                {
                    // @TODO Check for new title, set if specified.
                    //       Then, cause root task to exit.
                    //       Then display the `Death.Message`, if there is one
                    //       (prepended with static property `DeathMessagePrefix`).
                }

                const Title: string | undefined = ((): string =>
                {
                    /**
                     * `this.Title.split(" ").length > 0` is guaranteed by
                     * the {@link TensedTitle} type.
                     */
                    const Words: Array<string> = this.Title.split(" ");
                    const [ TitlePresentParticiple, ...TitleTail ] = Words;

                    if (TitlePresentParticiple === undefined)
                    {
                        return undefined;
                    }

                    const TitleVerb: string = new Inflectors(TitlePresentParticiple).toPresent();
                    const TitleVerbUncapitalized: string = TitleVerb[0]?.toLowerCase() + TitleVerb.slice(1);

                    return [ "Failed to", TitleVerbUncapitalized, TitleTail ].join(" ");
                })();

                if (Title !== undefined)
                {
                    this.Title = Title;
                }
            };

            const HandleExit = async (): Promise<void> =>
            {
                const ExitResult: TaskResult.Return.Exit =
                    Result as TaskResult.Return.Exit;

                if (ExitResult.Title !== undefined)
                {
                    this.Title = ExitResult.Title;
                }
            };

            const HandleSubtasks = async (): Promise<void> =>
            {
                type SubtasksResult = TaskResult.Return.Subtasks<
                    ContextType,
                    SubtaskContextType,
                    ParentContextType,
                    Renderer,
                    FallbackRenderer
                >;

                const SubtasksResult: SubtasksResult =
                    Result as SubtasksResult;

                const SpawnedSubtasks: Listr<
                    SubtaskContextType,
                    unknown,
                    ContextType,
                    Renderer,
                    FallbackRenderer
                > =
                    Wrapper.NewListr(SubtasksResult.Subtasks);

                const { Context: _, ...InheritableOptions } = this.Options;

                SpawnedSubtasks.Options =
                    {
                        ...InheritableOptions,
                        ...SpawnedSubtasks.Options
                    };

                SpawnedSubtasks.RendererClass = SilentRenderer;
                //     // switch to silent renderer since already rendering
                //     Result.rendererClass = getRendererClass("silent");

                //     // assign subtasks
                //     this.Subtasks = Result.tasks;

                //     Result.errors = this.Listr.errors;

                //     this.emit(ListrTaskEventType.SUBTASK, this.Subtasks);

                //     Result = Result.run(Context);
            };

            const Handlers: Record<Tag, (() => Promise<void>)> =
                {
                    [ ExitSymbol ]: HandleExit,
                    [ FailureSymbol ]: HandleFailure,
                    [ SubtasksSymbol ]: HandleSubtasks,
                    [ SuccessSymbol ]: HandleSuccess
                };

            await Handlers[Result.Tag]();

            // if (Result instanceof Listr)
            // {
            //     // Detect the subtask
            //     // assign options
            //     Result.options = { ...this.Options, ...Result.options };

            //     // switch to silent renderer since already rendering
            //     Result.rendererClass = getRendererClass("silent");

            //     // assign subtasks
            //     this.Subtasks = Result.tasks;

            //     Result.errors = this.Listr.errors;

            //     this.emit(ListrTaskEventType.SUBTASK, this.Subtasks);

            //     Result = Result.run(Context);
            // }
            // else if (Result instanceof Promise)
            // {
            //     // Detect promise
            //     Result = Result.then(HandleResult);
            // }
            // else if (isReadable(Result))
            // {
            //     // Detect stream
            //     Result = new Promise((resolve, reject) =>
            //     {
            //         Result.on("data", (data: Buffer) =>
            //         {
            //             this.output$ = data.toString();
            //         });
            //         Result.on("error", (error: Error) => reject(error));
            //         Result.on("end", () => resolve(null));
            //     });
            // }
            // else if (isObservable(Result))
            // {
            //     // Detect Observable
            //     Result = new Promise((
            //         Resolve: TThenFn<void>,
            //         Reject: ((Reason?: unknown) => void)
            //     ): void =>
            //     {
            //         Result.subscribe({
            //             next: (data: string) =>
            //             {
            //                 this.output$ = data;
            //             },
            //             error: Reject,
            //             complete: Resolve
            //         });
            //     });
            // }

            // return Result;
        };

        const StartTime: number = Date.now();

        // finish the task first
        this.state$ = ListrTaskState.STARTED;

        // check if this function wants to be skipped
        const IsSkipped: string | boolean =
            (await assertFunctionOrSelf(this.Task?.Skip ?? false, Context)) as string | boolean;

        if (IsSkipped)
        {
            if (typeof IsSkipped === "string")
            {
                this.message$ = { Skip: IsSkipped };
            }
            else if (this.HasTitle())
            {
                this.message$ = { Skip: this.Title };
            }
            else
            {
                this.message$ = { Skip: "Skipped task without a title." };
            }

            this.state$ = ListrTaskState.SKIPPED;

            return;
        }

        try
        {
            /* Retry functionality */
            const RetryCount: number =
                typeof this.Task?.Retry === "number" && this.Task.Retry > 0
                    ? this.Task.Retry + 1
                    : typeof this.Task?.Retry === "object" && this.Task.Retry.tries > 0
                        ? this.Task.Retry.tries + 1
                        : 1;
            const retryDelay: number = typeof this.Task.Retry === "object" && this.Task.Retry.delay;

            for (let Retries: number = 1; Retries <= RetryCount; Retries++)
            {
                try
                {
                    /* Handle the results. */
                    await HandleResult(await this.TaskFn(Context, Wrapper));
                    break;
                }
                catch(err: unknown)
                {
                    if (Retries !== RetryCount)
                    {
                        this.Retry = { Count: Retries, Error: err };
                        this.message$ = { Retry: this.Retry };
                        this.title$ = this.InitialTitle;
                        this.Output = undefined;

                        Wrapper.Report(err, ListrErrorTypes.WILL_RETRY);

                        this.state$ = ListrTaskState.RETRY;

                        if (retryDelay)
                        {
                            await this.pause(retryDelay);
                        }
                    }
                    else
                    {
                        throw err;
                    }
                }
            }

            if (this.IsStarted() || this.IsRetrying())
            {
                this.message$ = { Duration: Date.now() - StartTime };
                this.state$ = ListrTaskState.COMPLETED;
            }
        }
        catch(error: unknown)
        {
            // catch prompt error, this was the best i could do without going crazy
            if (this.Prompt instanceof PromptError)
            {
                // eslint-disable-next-line no-ex-assign
                error = this.Prompt;
            }

            // execute the task on error function
            if (this.Task?.Rollback)
            {
                Wrapper.Report(error, ListrErrorTypes.WILL_ROLLBACK);

                try
                {
                    this.state$ = ListrTaskState.ROLLING_BACK;

                    await this.Task.Rollback(Context, Wrapper);

                    this.message$ = { Rollback: this.Title };

                    this.state$ = ListrTaskState.ROLLED_BACK;
                }
                catch(err: unknown)
                {
                    this.state$ = ListrTaskState.FAILED;

                    Wrapper.Report(err, ListrErrorTypes.HAS_FAILED_TO_ROLLBACK);

                    this.close();
                    throw err;
                }

                if (this.Listr.Options?.exitAfterRollback !== false)
                {
                    // Do not exit when explicitly set to `false`
                    this.close();
                    throw error;
                }
            }
            else
            {
                // mark task as failed
                this.state$ = ListrTaskState.FAILED;

                const Exits: boolean = (
                    this.Listr.Options.exitOnError !== false &&
                    (await assertFunctionOrSelf(this.Task?.ExitOnError, Context)) !== false
                );

                if (Exits)
                {
                    // Do not exit when explicitly set to `false`
                    // report error
                    Wrapper.Report(error, ListrErrorTypes.HAS_FAILED);

                    this.close();
                    throw error;
                }
                else if (!this.HasSubtasks())
                {
                    // subtasks will handle and report their own errors
                    Wrapper.Report(error, ListrErrorTypes.HAS_FAILED_WITHOUT_ERROR);
                }
            }
        }
        finally
        {
            this.close();
        }
    }

    private close(): void
    {
        this.emit(ListrTaskEventType.CLOSED);
        this.Listr.Events.emit(ListrEventType.SHOULD_REFRESH_RENDER);
        this.complete();
    }
}
