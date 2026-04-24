/**
 * @file      renderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    LISTR_LOGGER_STDERR_LEVELS,
    LISTR_LOGGER_STYLE,
    ListrLogLevels,
    ListrLogger,
    type LoggerFieldOptions,
    cleanseAnsi,
    color } from "@utils/index.js";
import type { ListrRenderer, ListrTaskMessage } from "@interfaces/index.js";
import { ListrTaskEventType, ListrTaskState } from "@constants/index.js";
import type {
    ListrVerboseRendererCache,
    ListrVerboseRendererOptions,
    ListrVerboseRendererTask,
    ListrVerboseRendererTaskOptions } from "./renderer.interface.js";
import { PRESET_TIMER, type PresetTimer } from "@presets/index.js";
import type { Task } from "@lib/task.js";

export class VerboseRenderer implements ListrRenderer
{
    public static NonTty: boolean = true;
    public static RendererOptions: ListrVerboseRendererOptions =
        {
            LogTitleChange: false,
            PausedTimer: {
                ...PRESET_TIMER,
                format: () => color.yellowBright
            }
        };
    public static RendererTaskOptions: ListrVerboseRendererTaskOptions;

    private Logger: ListrLogger;
    private readonly Cache: ListrVerboseRendererCache = {
        RendererOptions: new Map(),
        RendererTaskOptions: new Map()
    };

    constructor(
        private readonly tasks: Array<ListrVerboseRendererTask>,
        private readonly options: ListrVerboseRendererOptions
    )
    {
        this.options =
            {
                ...VerboseRenderer.RendererOptions,
                ...this.options,
                color:
                {
                    ...LISTR_LOGGER_STYLE.color,
                    ...(options?.color ?? {})
                },
                icon:
                {
                    ...LISTR_LOGGER_STYLE.icon,
                    ...(options?.icon ?? {})
                }
            };

        this.Logger = this.options.Logger ?? new ListrLogger<ListrLogLevels>({
            toStderr: LISTR_LOGGER_STDERR_LEVELS,
            useIcons: false
        });

        this.Logger.options.icon = this.options.icon;
        this.Logger.options.color = this.options.color;

        if (this.options.timestamp)
        {
            this.Logger.options.fields.prefix.unshift(this.options.timestamp);
        }
    }

    public Render(): void
    {
        this.Renderer(this.tasks);
    }

    public End(): void {}

    private Renderer(Tasks: Array<ListrVerboseRendererTask>): void
    {
        Tasks.forEach((Task: ListrVerboseRendererTask) =>
        {
            this.calculate(Task);

            Task.once(ListrTaskEventType.CLOSED, () =>
            {
                this.reset(Task);
            });

            const RendererOptions: ListrVerboseRendererOptions = this.Cache.RendererOptions.get(Task.Id);
            const RendererTaskOptions: ListrVerboseRendererTaskOptions =
                this.Cache.RendererTaskOptions.get(Task.Id);

            Task.on(ListrTaskEventType.SUBTASK, (Subtasks: Array<unknown>) =>
            {
                this.Renderer(Subtasks as Array<ListrVerboseRendererTask>);
            });

            Task.on(ListrTaskEventType.STATE, (State: ListrTaskState) =>
            {
                if (!Task.HasTitle())
                {
                    return;
                }

                if (State === ListrTaskState.STARTED)
                {
                    this.Logger.log(ListrLogLevels.STARTED, Task.Title);
                }
                else if (State === ListrTaskState.COMPLETED)
                {
                    const Timer: PresetTimer = RendererTaskOptions.timer;

                    this.Logger.log(
                        ListrLogLevels.COMPLETED,
                        Task.Title,
                        Timer && {
                            suffix: {
                                ...Timer,
                                args: [ Task.Message.Duration ],
                                condition: !!Task.Message?.Duration && Timer.condition
                            }
                        } as LoggerFieldOptions<false>
                    );
                }
            });

            Task.on(ListrTaskEventType.OUTPUT, (Data: string) =>
            {
                this.Logger.log(ListrLogLevels.OUTPUT, Data);
            });

            Task.on(ListrTaskEventType.PROMPT, (prompt: string) =>
            {
                const Cleansed: string = cleanseAnsi(prompt);

                if (Cleansed)
                {
                    this.Logger.log(ListrLogLevels.PROMPT, Cleansed);
                }
            });

            if (this.options?.LogTitleChange !== false)
            {
                Task.on(ListrTaskEventType.TITLE, (Title: string) =>
                {
                    this.Logger.log(ListrLogLevels.TITLE, Title);
                });
            }

            Task.on(ListrTaskEventType.MESSAGE, (message: ListrTaskMessage) =>
            {
                if (message?.Error)
                {
                    // error message
                    this.Logger.log(ListrLogLevels.FAILED, message.Error);
                }
                else if (message?.Skip)
                {
                    // skip message
                    this.Logger.log(ListrLogLevels.SKIPPED, message.Skip);
                }
                else if (message?.Rollback)
                {
                    // rollback message
                    this.Logger.log(ListrLogLevels.ROLLBACK, message.Rollback);
                }
                else if (message?.Retry)
                {
                    this.Logger.log(
                        ListrLogLevels.RETRY,
                        Task.Title,
                        {
                            suffix: message.Retry.Count.toString()
                        }
                    );
                }
                else if (message?.Paused)
                {
                    const timer: PresetTimer = RendererOptions?.PausedTimer;

                    this.Logger.log(
                        ListrLogLevels.PAUSED,
                        Task.Title,
                        timer && {
                            suffix: {
                                ...timer,
                                args: [ message.Paused - Date.now() ],
                                condition: !!message?.Paused && timer.condition
                            }
                        } as LoggerFieldOptions<false>
                    );
                }
            });
        });
    }

    private calculate(task: ListrVerboseRendererTask): void
    {
        if (this.Cache.RendererOptions.has(task.Id) && this.Cache.RendererTaskOptions.has(task.Id))
        {
            return;
        }

        const rendererOptions: ListrVerboseRendererOptions = this.options;

        this.Cache.RendererOptions.set(task.Id, rendererOptions);

        this.Cache.RendererTaskOptions.set(task.Id, {
            ...VerboseRenderer.RendererTaskOptions,
            timer: rendererOptions.timer
        });
    }

    private reset(task: ListrVerboseRendererTask): void
    {
        this.Cache.RendererOptions.delete(task.Id);
        this.Cache.RendererTaskOptions.delete(task.Id);
    }
}
