/**
 * @file      renderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { LISTR_DEFAULT_RENDERER_STYLE, ListrDefaultRendererLogLevels } from "./renderer.constants.js";
import type {
    ListrDefaultRendererCache,
    ListrDefaultRendererOptions,
    ListrDefaultRendererOutputBuffer,
    ListrDefaultRendererTask,
    ListrDefaultRendererTaskOptions
} from "./renderer.interface.js";
import type { ListrEventManager, Task } from "@lib/index.js";
import { ListrEventType, ListrTaskEventType, ListrTaskState } from "@constants/index.js";
import {
    ListrLogLevels,
    ListrLogger,
    type LoggerField,
    ProcessOutputBuffer,
    type ProcessOutputBufferEntry,
    Spinner,
    assertFunctionOrSelf,
    cleanseAnsi,
    color,
    indent } from "@utils/index.js";
import type { ListrRenderer, ListrTaskEventMap } from "@interfaces/index.js";
import { EOL } from "os";
import { ListrRendererError } from "@interfaces/index.js";
import { PRESET_TIMER } from "@presets/index.js";
import type { createLogUpdate } from "log-update";
import type truncate from "cli-truncate";
import type wrap from "wrap-ansi";

export class DefaultRenderer implements ListrRenderer
{
    public static NonTty: boolean = false;
    public static RendererOptions: ListrDefaultRendererOptions =
        {
            ClearOutput: false,
            CollapseErrors: true,
            CollapseSkips: true,
            CollapseSubtasks: true,
            FormatOutput: "wrap",
            Indentation: 2,
            Lazy: false,
            PausedTimer:
            {
                ...PRESET_TIMER,
                format: () => color.yellowBright
            },
            RemoveEmptyLines: true,
            ShowErrorMessage: true,
            ShowSkipMessage: true,
            ShowSubtasks: true,
            SuffixRetries: true,
            SuffixSkips: false
        };

    public static RendererTaskOptions: ListrDefaultRendererTaskOptions =
        {
            OutputBar: true
        };

    private Prompt: string;
    private ActivePrompt: string;
    private readonly Spinner: Spinner;
    private readonly Logger: ListrLogger<ListrDefaultRendererLogLevels>;
    private Updater: ReturnType<typeof createLogUpdate>;
    private Truncate: typeof truncate;
    private Wrap: typeof wrap;
    private readonly Buffer: ListrDefaultRendererOutputBuffer =
        {
            Bottom: new Map(),
            Output: new Map()
        };

    private readonly Cache: ListrDefaultRendererCache =
        {
            Render: new Map(),
            RendererOptions: new Map(),
            RendererTaskOptions: new Map()
        };

    constructor(
        private readonly Tasks: Array<ListrDefaultRendererTask>,
        private readonly Options: ListrDefaultRendererOptions,
        private readonly Events: ListrEventManager
    )
    {
        this.Options =
            {
                ...DefaultRenderer.RendererOptions,
                ...this.Options,
                color:
                {
                    ...LISTR_DEFAULT_RENDERER_STYLE.color,
                    ...(Options?.color ?? {})
                },
                icon:
                {
                    ...LISTR_DEFAULT_RENDERER_STYLE.icon,
                    ...(Options?.icon ?? {})
                }
            };

        this.Spinner = this.Options.Spinner ?? new Spinner();

        this.Logger = this.Options.Logger ?? new ListrLogger<ListrDefaultRendererLogLevels>({
            toStderr: [ ],
            useIcons: true
        });

        this.Logger.options.icon = this.Options.icon;
        this.Logger.options.color = this.Options.color;
    }

    public async Render(): Promise<void>
    {
        const { createLogUpdate } = await import("log-update");
        const { default: truncate } = await import("cli-truncate");
        const { default: wrap } = await import("wrap-ansi");

        this.Updater = createLogUpdate(this.Logger.process.stdout);
        this.Truncate = truncate;
        this.Wrap = wrap;

        this.Logger.process.hijack();

        if (!this.Options?.Lazy)
        {
            this.Spinner.start(() =>
            {
                this.update();
            });
        }

        this.Events.on(ListrEventType.SHOULD_REFRESH_RENDER, () =>
        {
            this.update();
        });
    }

    public update(): void
    {
        this.Updater(this.create());
    }

    public End(): void
    {
        this.Spinner.stop();

        // clear log updater
        this.Updater.clear();
        this.Updater.done();

        // directly write to process.stdout, since logupdate only can update the seen height of terminal
        if (!this.Options.ClearOutput)
        {
            this.Logger.process.toStdout(this.create({ prompt: false }));
        }

        this.Logger.process.release();
    }

    public create(options?: { tasks?: boolean; bottomBar?: boolean; prompt?: boolean }): string
    {
        options = {
            bottomBar: true,
            prompt: true,
            tasks: true,
            ...options
        };

        const render: Array<string> = [ ];

        const renderTasks: Array<string> = this.renderer(this.Tasks);
        const renderBottomBar: Array<string> = this.renderBottomBar();
        const renderPrompt: Array<string> = this.renderPrompt();

        if (options.tasks && renderTasks.length > 0)
        {
            render.push(...renderTasks);
        }

        if (options.bottomBar && renderBottomBar.length > 0)
        {
            if (render.length > 0)
            {
                render.push("");
            }

            render.push(...renderBottomBar);
        }

        if (options.prompt && renderPrompt.length > 0)
        {
            if (render.length > 0)
            {
                render.push("");
            }

            render.push(...renderPrompt);
        }

        return render.join(EOL);
    }

    protected style(
        task: ListrDefaultRendererTask,
        output: boolean = false
    ): string
    {
        const rendererOptions: ListrDefaultRendererOptions = this.Cache.RendererOptions.get(task.Id);

        if (task.IsSkipped())
        {
            if (output || rendererOptions.CollapseSkips)
            {
                return this.Logger.icon(ListrDefaultRendererLogLevels.SKIPPED_WITH_COLLAPSE);
            }
            else if (rendererOptions.CollapseSkips === false)
            {
                return this.Logger.icon(ListrDefaultRendererLogLevels.SKIPPED_WITHOUT_COLLAPSE);
            }
        }

        if (output)
        {
            if (this.shouldOutputToBottomBar(task))
            {
                return this.Logger.icon(ListrDefaultRendererLogLevels.OUTPUT_WITH_BOTTOMBAR);
            }

            return this.Logger.icon(ListrDefaultRendererLogLevels.OUTPUT);
        }

        if (task.HasSubtasks())
        {
            if (
                task.IsStarted() ||
                (
                    task.IsPrompt() &&
                    rendererOptions.ShowSubtasks !== false &&
                    !task.Subtasks.every(
                        (Subtask: Task<
                            unknown,
                            unknown,
                            unknown,
                            typeof DefaultRenderer,
                            typeof DefaultRenderer
                        >) => !Subtask.HasTitle())
                )
            )
            {
                return this.Logger.icon(ListrDefaultRendererLogLevels.PENDING);
            }
            else if (
                task.IsCompleted() &&
                task.Subtasks.some((Subtask: Task<
                    unknown,
                    unknown,
                    unknown,
                    typeof DefaultRenderer,
                    typeof DefaultRenderer>) => Subtask.HasFailed())
            )
            {
                return this.Logger.icon(ListrDefaultRendererLogLevels.COMPLETED_WITH_FAILED_SUBTASKS);
            }
            else if (task.HasFailed())
            {
                return this.Logger.icon(ListrDefaultRendererLogLevels.FAILED_WITH_FAILED_SUBTASKS);
            }
        }

        if (task.IsStarted() || task.IsPrompt())
        {
            return this.Logger.icon(
                ListrDefaultRendererLogLevels.PENDING,
                !this.Options?.Lazy && this.Spinner.fetch()
            );
        }
        else if (task.IsCompleted())
        {
            return this.Logger.icon(ListrDefaultRendererLogLevels.COMPLETED);
        }
        else if (task.IsRetrying())
        {
            return this.Logger.icon(
                ListrDefaultRendererLogLevels.RETRY,
                !this.Options?.Lazy && this.Spinner.fetch()
            );
        }
        else if (task.IsRollingBack())
        {
            return this.Logger.icon(
                ListrDefaultRendererLogLevels.ROLLING_BACK,
                !this.Options?.Lazy && this.Spinner.fetch()
            );
        }
        else if (task.HasRolledBack())
        {
            return this.Logger.icon(ListrDefaultRendererLogLevels.ROLLED_BACK);
        }
        else if (task.HasFailed())
        {
            return this.Logger.icon(ListrDefaultRendererLogLevels.FAILED);
        }
        else if (task.IsPaused())
        {
            return this.Logger.icon(ListrDefaultRendererLogLevels.PAUSED);
        }

        return this.Logger.icon(ListrDefaultRendererLogLevels.WAITING);
    }

    protected format(message: string, icon: string, level: number): Array<string>
    {
        // we dont like empty data around here
        if (message.trim() === "")
        {
            return [];
        }

        if (icon)
        {
            message = icon + " " + message;
        }

        let parsed: Array<string>;

        const columns: number = (process.stdout.columns ?? 80) - level * this.Options.Indentation - 2;

        switch (this.Options.FormatOutput)
        {
            case "truncate":
                parsed = message.split(EOL).map((s: string, i: number) =>
                {
                    return this.Truncate(this.indent(s, i), columns);
                });

                break;

            case "wrap":
                parsed = this.Wrap(message, columns, { hard: true, trim: false })
                    .split(EOL)
                    .map((s: string, i: number) => this.indent(s, i));

                break;

            default:
                throw new ListrRendererError("Format option for the renderer is wrong.");
        }

        // this removes the empty lines
        if (this.Options.RemoveEmptyLines)
        {
            parsed = parsed.filter(Boolean);
        }

        return parsed.map((str: string) => indent(str, level * this.Options.Indentation));
    }

    protected shouldOutputToOutputBar(task: ListrDefaultRendererTask): boolean
    {
        const OutputBar: number | boolean = this.Cache.RendererTaskOptions.get(task.Id).OutputBar;

        return (
            (
                typeof OutputBar === "number" &&
                OutputBar !== 0
            ) ||
            (
                typeof OutputBar === "boolean" &&
                OutputBar !== false
            )
        );
    }

    protected shouldOutputToBottomBar(task: ListrDefaultRendererTask): boolean
    {
        const BottomBar: number | boolean = this.Cache.RendererTaskOptions.get(task.Id).BottomBar;

        return (
            (
                typeof BottomBar === "number" &&
                BottomBar !== 0
            ) ||
            (
                typeof BottomBar === "boolean" &&
                BottomBar !== false
            ) ||
            !task.HasTitle()
        );
    }

    private renderer(tasks: Array<ListrDefaultRendererTask>, level: number = 0): Array<string>
    {
        return tasks.flatMap((Task: ListrDefaultRendererTask) =>
        {
            if (!Task.IsEnabled())
            {
                return [ ];
            }

            // if this is already cached return the cache
            if (this.Cache.Render.has(Task.Id))
            {
                return this.Cache.Render.get(Task.Id);
            }

            this.calculate(Task);
            this.setupBuffer(Task);

            const RendererOptions: ListrDefaultRendererOptions = this.Cache.RendererOptions.get(Task.Id);
            const RendererTaskOptions: ListrDefaultRendererTaskOptions =
                this.Cache.RendererTaskOptions.get(Task.Id);

            const Output: Array<string> = [ ];

            if (Task.IsPrompt())
            {
                if (this.ActivePrompt && this.ActivePrompt !== Task.Id)
                {
                    throw new ListrRendererError(
                        "Only one prompt can be active at the given time, please " +
                        "re-evaluate your task design."
                    );
                }
                else if (!this.ActivePrompt)
                {
                    Task.on(
                        ListrTaskEventType.PROMPT,
                        (prompt: ListrTaskEventMap[ListrTaskEventType.PROMPT]): void =>
                        {
                            const Cleansed: string = cleanseAnsi(prompt);

                            if (Cleansed)
                            {
                                this.Prompt = Cleansed;
                            }
                        });

                    Task.on(ListrTaskEventType.STATE, (state: ListrTaskState) =>
                    {
                        if (
                            state === ListrTaskState.PROMPT_COMPLETED ||
                            Task.HasFinalized() ||
                            Task.HasReset()
                        )
                        {
                            this.Prompt = null;
                            this.ActivePrompt = null;
                            Task.off(ListrTaskEventType.PROMPT);
                        }
                    });

                    this.ActivePrompt = Task.Id;
                }
            }

            // Current Task Title
            if (Task.HasTitle())
            {
                if (
                    !(tasks.some((Task: ListrDefaultRendererTask) => Task.HasFailed()) &&
                    !Task.HasFailed() &&
                    Task.Options.exitOnError !== false &&
                    !(Task.IsCompleted() || Task.IsSkipped()))
                )
                {
                    // if task is skipped
                    if (Task.HasFailed() && RendererOptions.CollapseErrors)
                    {
                        // current task title and skip change the title
                        Output.push(...this.format(
                            !Task.HasSubtasks() &&
                            Task.Message.Error &&
                            RendererOptions.ShowErrorMessage
                                ? Task.Message.Error
                                : Task.Title,
                            this.style(Task),
                            level
                        ));
                    }
                    else if (Task.IsSkipped() && RendererOptions.CollapseSkips)
                    {
                        // current task title and skip change the title
                        Output.push(
                            ...this.format(
                                this.Logger.suffix(
                                    Task.Message.Skip &&
                                    RendererOptions.ShowSkipMessage
                                        ? Task.Message.Skip
                                        : Task.Title,
                                    {
                                        condition: RendererOptions.SuffixSkips,
                                        field: ListrLogLevels.SKIPPED,
                                        format: () => color.dim
                                    }
                                ),
                                this.style(Task),
                                level
                            )
                        );
                    }
                    else if (Task.IsRetrying())
                    {
                        Output.push(
                            ...this.format(
                                this.Logger.suffix(Task.Title,
                                    {
                                        condition: RendererOptions.SuffixRetries,
                                        field: `${ ListrLogLevels.RETRY }:${ Task.Message.Retry.Count }`,
                                        format: () => color.yellow
                                    }
                                ),
                                this.style(Task),
                                level
                            )
                        );
                    }
                    else if (
                        Task.IsCompleted() &&
                        Task.HasTitle() &&
                        assertFunctionOrSelf(
                            RendererTaskOptions.timer?.condition,
                            Task.Message.Duration
                        )
                    )
                    {
                        // task with timer
                        Output.push(
                            ...this.format(
                                this.Logger.suffix(
                                    Task?.Title,
                                    {
                                        ...RendererTaskOptions.timer,
                                        args: [ Task.Message.Duration ]
                                    } as LoggerField
                                ),
                                this.style(Task),
                                level
                            )
                        );
                    }
                    else if (Task.IsPaused())
                    {
                        Output.push(
                            ...this.format(
                                this.Logger.suffix(
                                    Task.Title,
                                    {
                                        ...RendererOptions.PausedTimer,
                                        args: [ Task.Message.Paused - Date.now() ]
                                    } as LoggerField
                                ),
                                this.style(Task),
                                level
                            )
                        );
                    }
                    else
                    {
                        // normal state
                        Output.push(...this.format(Task.Title, this.style(Task), level));
                    }
                }
                else
                {
                    // some sibling task but self has failed and this has stopped
                    Output.push(
                        ...this.format(
                            Task.Title,
                            this.Logger.icon(
                                ListrDefaultRendererLogLevels.COMPLETED_WITH_FAILED_SISTER_TASKS
                            ),
                            level
                        )
                    );
                }
            }

            // task should not have subtasks since subtasks will handle the error already
            // maybe it is a better idea to show the error or skip messages when show subtasks is disabled.
            if (!Task.HasSubtasks() || !RendererOptions.ShowSubtasks)
            {
                // without the collapse option for skip and errors
                if (
                    Task.HasFailed() &&
                    RendererOptions.CollapseErrors === false &&
                    (RendererOptions.ShowErrorMessage || !RendererOptions.ShowSubtasks)
                )
                {
                    // show skip data if collapsing is not defined
                    Output.push(...this.dump(Task, level, ListrLogLevels.FAILED));
                }
                else if (
                    Task.IsSkipped() &&
                    RendererOptions.CollapseSkips === false &&
                    (RendererOptions.ShowSkipMessage || !RendererOptions.ShowSubtasks)
                )
                {
                    // show skip data if collapsing is not defined
                    Output.push(...this.dump(Task, level, ListrLogLevels.SKIPPED));
                }
            }

            if (Task.IsPending() || RendererTaskOptions.PersistentOutput)
            {
                Output.push(...this.renderOutputBar(Task, level));
            }

            // render subtasks, some complicated conditionals going on
            if (
            // check if renderer option is on first
                RendererOptions.ShowSubtasks !== false &&
        // if it doesn't have subtasks no need to check
        Task.HasSubtasks() &&
        (
            Task.IsPending() ||
            (Task.HasFinalized() && !Task.HasTitle()) ||
            // have to be completed and have subtasks
            (
                Task.IsCompleted() &&
                RendererOptions.CollapseSubtasks === false &&
                !Task.Subtasks.some(
                    (Subtask: Task<unknown, unknown, unknown>) =>
                        this.Cache.RendererOptions.get(Subtask.Id)?.CollapseSubtasks === true
                )
            ) ||
            // if any of the subtasks have the collapse option of
            Task.Subtasks.some(
                (Subtask: Task<unknown, unknown, unknown>) =>
                    this.Cache.RendererOptions.get(Subtask.Id)?.CollapseSubtasks === false
            ) ||
            // if any of the subtasks has failed
            Task.Subtasks.some((Subtask: Task<unknown, unknown, unknown>) => Subtask.HasFailed()) ||
            // if any of the subtasks rolled back
            Task.Subtasks.some((Subtask: Task<unknown, unknown, unknown>) => Subtask.HasRolledBack()))
            )
            {
                // set level
                const subtaskLevel: number = !Task.HasTitle() ? level : level + 1;

                // render the subtasks as in the same way
                const subtaskRender: Array<string> = this.renderer(Task.Subtasks, subtaskLevel);

                Output.push(...subtaskRender);
            }

            // after task is finished actions
            if (Task.HasFinalized())
            {
                // clean up the output buffer if not persistent
                if (!RendererTaskOptions.PersistentOutput)
                {
                    this.Buffer.Bottom.delete(Task.Id);
                    this.Buffer.Output.delete(Task.Id);
                }
            }

            if (Task.IsClosed())
            {
                this.Cache.Render.set(Task.Id, Output);
                this.reset(Task);
            }

            return Output;
        });
    }

    private renderOutputBar(task: ListrDefaultRendererTask, level: number): Array<string>
    {
        const Output: ProcessOutputBuffer = this.Buffer.Output.get(task.Id);

        if (!Output)
        {
            return [ ];
        }

        return Output.all.flatMap((Entry: ProcessOutputBufferEntry) =>
        {
            return this.dump(task, level, ListrLogLevels.OUTPUT, Entry.entry);
        });
    }

    private renderBottomBar(): Array<string>
    {
        // parse through all objects return only the last mentioned items
        if (this.Buffer.Bottom.size === 0)
        {
            return [ ];
        }

        return Array.from(this.Buffer.Bottom.values())
            .flatMap((Output: ProcessOutputBuffer) => Output.all)
            .sort((A: ProcessOutputBufferEntry, B: ProcessOutputBufferEntry) => A.time - B.time)
            .map((Output: ProcessOutputBufferEntry) => Output.entry);
    }

    private renderPrompt(): Array<string>
    {
        if (!this.Prompt)
        {
            return [];
        }

        return [ this.Prompt ];
    }

    private calculate(task: ListrDefaultRendererTask): void
    {
        if (this.Cache.RendererOptions.has(task.Id) && this.Cache.RendererTaskOptions.has(task.Id))
        {
            return;
        }

        const rendererOptions: ListrDefaultRendererOptions = this.Options;

        this.Cache.RendererOptions.set(task.Id, rendererOptions);

        this.Cache.RendererTaskOptions.set(task.Id, {
            ...DefaultRenderer.RendererTaskOptions,
            timer: rendererOptions.timer
        });
    }

    private setupBuffer(task: ListrDefaultRendererTask): void
    {
        if (this.Buffer.Bottom.has(task.Id) || this.Buffer.Output.has(task.Id))
        {
            return;
        }

        const RendererTaskOptions: ListrDefaultRendererTaskOptions =
            this.Cache.RendererTaskOptions.get(task.Id);

        // lazily create the process output buffer for the current task output
        if (this.shouldOutputToBottomBar(task) && !this.Buffer.Bottom.has(task.Id))
        {
            // create new if there is no persistent storage created for bottom bar
            this.Buffer.Bottom.set(
                task.Id,
                new ProcessOutputBuffer({
                    limit: typeof RendererTaskOptions.BottomBar === "number"
                        ? RendererTaskOptions.BottomBar
                        : 1
                })
            );

            task.on(ListrTaskEventType.OUTPUT, (Output: string) =>
            {
                const Data: Array<string> = this.dump(task, -1, ListrLogLevels.OUTPUT, Output);

                this.Buffer.Bottom.get(task.Id).write(Data.join(EOL));
            });

            task.on(ListrTaskEventType.STATE, (State: ListrTaskState) =>
            {
                switch (State)
                {
                    case ListrTaskState.RETRY || ListrTaskState.ROLLING_BACK:
                        this.Buffer.Bottom.delete(task.Id);

                        break;
                }
            });
        }
        else if (this.shouldOutputToOutputBar(task) && !this.Buffer.Output.has(task.Id))
        {
            this.Buffer.Output.set(
                task.Id,
                new ProcessOutputBuffer({
                    limit: typeof RendererTaskOptions.OutputBar === "number"
                        ? RendererTaskOptions.OutputBar
                        : 1
                })
            );

            task.on(ListrTaskEventType.OUTPUT, (Output: string) =>
            {
                this.Buffer.Output.get(task.Id).write(Output);
            });

            task.on(ListrTaskEventType.STATE, (State: ListrTaskState) =>
            {
                switch (State)
                {
                    case ListrTaskState.RETRY || ListrTaskState.ROLLING_BACK:
                        this.Buffer.Output.delete(task.Id);

                        break;
                }
            });
        }
    }

    private reset(task: ListrDefaultRendererTask): void
    {
        this.Cache.RendererOptions.delete(task.Id);
        this.Cache.RendererTaskOptions.delete(task.Id);

        // no need for this since this is now cached
        this.Buffer.Output.delete(task.Id);
    }

    private dump(
        task: ListrDefaultRendererTask,
        level: number,
        source:
            | ListrLogLevels.OUTPUT
            | ListrLogLevels.SKIPPED
            | ListrLogLevels.FAILED = ListrLogLevels.OUTPUT,
        data?: string | boolean
    ): Array<string>
    {
        if (!data)
        {
            switch (source)
            {
                case ListrLogLevels.OUTPUT:
                    data = task.Output;

                    break;

                case ListrLogLevels.SKIPPED:
                    data = task.Message.Skip;

                    break;

                case ListrLogLevels.FAILED:
                    data = task.Message.Error;

                    break;
            }
        }

        // dont return anything on some occasions
        if (
            (
                task.HasTitle() &&
                source === ListrLogLevels.FAILED &&
                data === task.Title
            ) ||
            typeof data !== "string"
        )
        {
            return [ ];
        }

        if (source === ListrLogLevels.OUTPUT)
        {
            data = cleanseAnsi(data);
        }

        return this.format(data, this.style(task, true), level + 1);
    }

    private indent(str: string, i: number): string
    {
        return i > 0 ? indent(str.trimEnd(), this.Options.Indentation) : str.trimEnd();
    }
}
