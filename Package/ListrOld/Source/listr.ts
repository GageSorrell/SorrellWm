/**
 * @file      listr.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Concurrency, getRenderer } from "@utils/index.js";
import { DefaultRenderer, SimpleRenderer, type SilentRenderer } from "@renderer/index.js";
import type {
    ListrBaseClassOptions,
    ListrContext,
    ListrDefaultRenderer,
    ListrError,
    ListrGetRendererOptions,
    ListrGetRendererTaskOptions,
    ListrRendererSubclass,
    ListrSilentRenderer,
    ListrSimpleRenderer,
    ListrTask,
    SupportedRenderer
} from "@interfaces/index.js";
import { ListrEnvironmentVariables, ListrTaskState } from "@constants/index.js";
import { ListrEventManager, Task, TaskWrapper } from "@lib/index.js";
import { Async } from "@sorrell/utilities";
import type { ListrRenderer } from "@interfaces/index.js";
import { ListrRendererSelection} from "@constants/index.js";
import type { TMaybeArray } from "@sorrell/utilities/misc";

export type ListrErrorArray<ErasedContextType = unknown, OtherErasedType = unknown> =
    Array<ListrError<ErasedContextType, OtherErasedType>>;

/**
 * Create a new task list with Listr.
 * @see {@link https://listr2.kilic.dev/listr/listr.html}
 */
export class Listr<
    ContextType = ListrContext,
    SubtasksContextType = ListrContext,
    ParentContextType = ListrContext,
    RendererType extends ListrRendererSubclass = ListrDefaultRenderer,
    FallbackRenderer extends ListrRendererSubclass = ListrSimpleRenderer
>
{
    public Tasks: Array<Task<
        ContextType,
        SubtasksContextType,
        ParentContextType,
        RendererType,
        FallbackRenderer
    >> = [ ];
    public Errors: Array<ListrError<ContextType, SubtasksContextType, ParentContextType>> = [ ];
    public Context: ContextType;
    public Events: ListrEventManager;
    public Path: Array<string> = [ ];
    // public RendererClass: ListrRendererSubclass;
    public RendererClass:
        | RendererType
        | ListrSilentRenderer
        | FallbackRenderer;
    public RendererClassOptions:
        | ListrGetRendererOptions<RendererType>
        | ListrGetRendererOptions<FallbackRenderer>;
    public RendererSelection: ListrRendererSelection;
    public BoundSignalHandler: () => void;

    private Concurrency: Concurrency;
    private Renderer: ListrRenderer;

    constructor(
        public Task: TMaybeArray<ListrTask<
            ContextType,
            SubtasksContextType,
            ParentContextType,
            RendererType,
            FallbackRenderer>
        >,
        public Options?: ListrBaseClassOptions<ContextType, RendererType, FallbackRenderer>,
        public ParentTask?: Task<ParentContextType, ContextType, unknown, RendererType, FallbackRenderer>
    )
    {
        // assign over default options
        this.Options =
            {
                FallbackRenderer: SimpleRenderer,
                Renderer: DefaultRenderer,
                collectErrors: false,
                concurrent: false,
                exitAfterRollback: true,
                exitOnError: true,
                registerSignalListeners: true,
                ...(this.ParentTask?.Options ?? { }),
                ...Options
            } as ListrBaseClassOptions<ContextType, RendererType, FallbackRenderer>;

        // define parallel options
        if (this.Options.concurrent === true)
        {
            this.Options.concurrent = Infinity;
        }
        else if (typeof this.Options.concurrent !== "number")
        {
            this.Options.concurrent = 1;
        }

        this.Concurrency = new Concurrency({ concurrency: this.Options.concurrent as number });

        // Update currentPath
        if (ParentTask)
        {
            this.Path = [ ...ParentTask.Listr.Path, ParentTask.Title ];
            this.Errors = ParentTask.Listr.Errors as unknown as this["Errors"];
        }

        if (this.ParentTask?.Listr.Events instanceof ListrEventManager)
        {
            this.Events = this.ParentTask.Listr.Events;
        }
        else
        {
            this.Events = new ListrEventManager();
        }

        if (this.Options?.ForceTty || process.env[ListrEnvironmentVariables.FORCE_TTY])
        {
            process.stdout.isTTY = true;
            process.stderr.isTTY = true;
        }

        if (this.Options?.ForceUnicode)
        {
            process.env[ListrEnvironmentVariables.FORCE_UNICODE] = "1";
        }

        /* Get the renderer class. */
        const renderer:
            | SupportedRenderer<RendererType>
            | SupportedRenderer<FallbackRenderer>
            | SupportedRenderer<ListrSilentRenderer> = getRenderer<RendererType, FallbackRenderer>({
                FallbackRenderer: this.Options.FallbackRenderer,
                FallbackRendererCondition: this.Options?.FallbackRendererCondition,
                FallbackRendererOptions: this.Options.FallbackRendererOptions,
                Renderer: this.Options.Renderer,
                RendererOptions: this.Options.RendererOptions,
                SilentRendererCondition: this.Options?.SilentRendererCondition
            });

        this.RendererClass = renderer.Renderer;
        this.RendererClassOptions = renderer.Options as
            | ListrGetRendererOptions<RendererType>
            | ListrGetRendererOptions<FallbackRenderer>;
        this.RendererSelection = renderer.Selection;

        // parse and add tasks
        this.add(Task ?? [ ]);

        // Graceful interrupt for render cleanup
        if (this.Options.registerSignalListeners)
        {
            this.BoundSignalHandler = this.signalHandler.bind(this);
            process.once("SIGINT", this.BoundSignalHandler).setMaxListeners(0);
        }
    }

    /**
     * Description.
     * @returns {boolean} Whether this is the root task.
     */
    public isRoot(): boolean
    {
        return !this.ParentTask;
    }

    /**
     * Whether this is a subtask of another task list.
     * @returns {boolean} Foo.
     */
    public isSubtask(): boolean
    {
        return !!this.ParentTask;
    }

    /**
     * Add tasks to current task list.
     * @param tasks - Foo.
     *
     * @see {@link https://listr2.kilic.dev/task/task.html}
     *
     * @example Description (@TODO).
     */
    public add(tasks: TMaybeArray<ListrTask<
        ContextType,
        SubtasksContextType,
        ParentContextType,
        RendererType,
        FallbackRenderer>>
    ): void
    {
        this.Tasks.push(...this.generate(tasks));
    }

    /* eslint-disable-next-line jsdoc/require-example, jsdoc/lines-before-block,
                                jsdoc/require-rejects, jsdoc/require-returns */
    /**
     * Run the task list.
     * @param context - The given context.
     * @see {@link https://listr2.kilic.dev/listr/listr.html#run-the-generated-task-list}
     */
    public async run(context?: ContextType): Promise<ContextType>
    {
        // start the renderer
        if (!this.Renderer)
        {
            this.Renderer = new this.RendererClass(
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                this.Tasks as Array<Task<any, any, any, any, any>>,
                this.Options.RendererOptions,
                this.Events
            );
        }

        await this.Renderer.Render();

        // create a new context
        this.Context = this.Options?.Context ?? context ?? ({} as ContextType);

        try
        {
            // check if the items are enabled
            const CheckTask = (
                task: Task<
                    ContextType,
                    SubtasksContextType,
                    ParentContextType,
                    RendererType,
                    FallbackRenderer
                >
            ): Promise<boolean> => task.check(this.Context);

            const RunTask = (
                task: Task<
                    ContextType,
                    SubtasksContextType,
                    ParentContextType,
                    RendererType,
                    FallbackRenderer
                >
            ): Promise<void> =>
            {
                return this.Concurrency.add(() => this.runTask(task));
            };

            if (Array.isArray(this.Tasks))
            {
                await Async.Map(this.Tasks, CheckTask);
                await Async.Map(this.Tasks, RunTask);
            }
            else
            {
                await CheckTask(this.Tasks);
                await RunTask(this.Tasks);
            }

            this.Renderer.End();

            this.removeSignalHandler();
        }
        catch(err: unknown)
        {
            if (this.Options.exitOnError !== false)
            {
                this.Renderer.End(err);

                this.removeSignalHandler();

                // Do not exit when explicitly set to `false`
                throw err;
            }
        }

        return this.Context;
    }

    private generate(
        tasks: TMaybeArray<ListrTask<
            ContextType,
            SubtasksContextType,
            ParentContextType,
            RendererType,
            FallbackRenderer>>
    ): Array<Task<
        ContextType,
        SubtasksContextType,
        ParentContextType,
        RendererType,
        FallbackRenderer
    >>
    {
        tasks = Array.isArray(tasks) ? tasks : [ tasks ];

        return tasks.map((task: ListrTask<
            ContextType,
            SubtasksContextType,
            ParentContextType,
            RendererType,
            FallbackRenderer>) =>
        {
            let RendererTaskOptions:
                | ListrGetRendererTaskOptions<RendererType>
                | ListrGetRendererTaskOptions<FallbackRenderer>;

            if (this.RendererSelection === ListrRendererSelection.PRIMARY)
            {
                RendererTaskOptions = task.RendererOptions;
            }
            else if (this.RendererSelection === ListrRendererSelection.SECONDARY)
            {
                RendererTaskOptions = task.FallbackRendererOptions;
            }

            return new Task<
                ContextType,
                SubtasksContextType,
                ParentContextType,
                RendererType,
                FallbackRenderer
            >(
                this,
                task,
                this.Options,
                this.RendererClassOptions,
                RendererTaskOptions
            );
        });
    }

    private async runTask(task: Task<
        ContextType,
        SubtasksContextType,
        ParentContextType,
        RendererType,
        FallbackRenderer
    >): Promise<void>
    {
        if (!(await task.check(this.Context)))
        {
            return;
        }

        return new TaskWrapper(task).Run(this.Context);
    }

    private signalHandler(): void
    {
        this.Tasks?.forEach(async(task: Task<
            ContextType,
            SubtasksContextType,
            ParentContextType,
            RendererType,
            FallbackRenderer
        >) =>
        {
            if (task.IsPending())
            {
                task.state$ = ListrTaskState.FAILED;
            }
        });

        // only the parent task shall exit
        if (this.isRoot())
        {
            this.Renderer?.End(new Error("Interrupted."));

            process.exit(127);
        }
    }

    private removeSignalHandler(): void
    {
        if (this.BoundSignalHandler)
        {
            process.removeListener("SIGINT", this.BoundSignalHandler);
        }
    }
}
