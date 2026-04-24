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
    color } from "@utils/index.js";
import type { ListrRenderer, ListrTaskMessage } from "@interfaces/index.js";
import type {
    ListrSimpleRendererCache,
    ListrSimpleRendererOptions,
    ListrSimpleRendererTask,
    ListrSimpleRendererTaskOptions } from "./renderer.interface.js";
import { ListrTaskEventType, ListrTaskState } from "@constants/index.js";
import { PRESET_TIMER, type PresetTimer } from "@presets/index.js";

export class SimpleRenderer implements ListrRenderer
{
    public static NonTty: boolean = true;
    public static RendererOptions: ListrSimpleRendererOptions =
        {
            PausedTimer:
            {
                ...PRESET_TIMER,
                field: (time: number) => `${ ListrLogLevels.PAUSED }:${ time }`,
                format: () => color.yellowBright
            }
        };
    public static RendererTaskOptions: ListrSimpleRendererTaskOptions = { };

    private readonly logger: ListrLogger;
    private readonly cache: ListrSimpleRendererCache = {
        RendererOptions: new Map(),
        RendererTaskOptions: new Map()
    };

    constructor(
        private readonly tasks: Array<ListrSimpleRendererTask>,
        private options: ListrSimpleRendererOptions
    )
    {
        this.options = {
            ...SimpleRenderer.RendererOptions,
            ...options,
            color: {
                ...LISTR_LOGGER_STYLE.color,
                ...(options?.color ?? { })
            },
            icon: {
                ...LISTR_LOGGER_STYLE.icon,
                ...(options?.icon ?? { })
            }
        };

        this.logger =
            this.options.Logger ??
            new ListrLogger<ListrLogLevels>({
                toStderr: LISTR_LOGGER_STDERR_LEVELS,
                useIcons: true
            });

        this.logger.options.icon = this.options.icon;
        this.logger.options.color = this.options.color;

        if (this.options.timestamp)
        {
            this.logger.options.fields.prefix.unshift(this.options.timestamp);
        }
    }

    public End(): void { }

    public Render(): void
    {
        this.Renderer(this.tasks);
    }

    private Renderer(tasks: Array<ListrSimpleRendererTask>): void
    {
        tasks.forEach((task: ListrSimpleRendererTask) =>
        {
            this.calculate(task);

            task.once(ListrTaskEventType.CLOSED, () =>
            {
                this.reset(task);
            });

            const RendererOptions: ListrSimpleRendererOptions = this.cache.RendererOptions.get(task.Id);
            const RendererTaskOptions: ListrSimpleRendererTaskOptions =
                this.cache.RendererTaskOptions.get(task.Id);

            task.on(ListrTaskEventType.SUBTASK, (Subtasks: Array<unknown>) =>
            {
                this.Renderer(Subtasks as unknown as Array<ListrSimpleRendererTask>);
            });

            task.on(ListrTaskEventType.STATE, (State: ListrTaskState) =>
            {
                if (!task.HasTitle())
                {
                    return;
                }

                if (State === ListrTaskState.STARTED)
                {
                    this.logger.log(ListrLogLevels.STARTED, task.Title);
                }
                else if (State === ListrTaskState.COMPLETED)
                {
                    const timer: PresetTimer = RendererTaskOptions?.timer;

                    this.logger.log(
                        ListrLogLevels.COMPLETED,
                        task.Title,
                        timer && {
                            suffix: {
                                ...timer,
                                args: [ task.Message.Duration ],
                                condition: !!task.Message?.Duration && timer.condition
                            }
                        } as LoggerFieldOptions<false>
                    );
                }
                else if (State === ListrTaskState.PROMPT)
                {
                    this.logger.process.hijack();

                    task.on(ListrTaskEventType.PROMPT, (Prompt: string) =>
                    {
                        this.logger.process.toStderr(Prompt, false);
                    });
                }
                else if (State === ListrTaskState.PROMPT_COMPLETED)
                {
                    task.off(ListrTaskEventType.PROMPT);

                    this.logger.process.release();
                }
            });

            task.on(ListrTaskEventType.OUTPUT, (Output: string) =>
            {
                this.logger.log(ListrLogLevels.OUTPUT, Output);
            });

            task.on(ListrTaskEventType.MESSAGE, (Message: ListrTaskMessage) =>
            {
                if (Message.Error)
                {
                    // error message
                    this.logger.log(ListrLogLevels.FAILED, task.Title, {
                        suffix: {
                            field: `${ListrLogLevels.FAILED}: ${Message.Error}`,
                            format: () => color.red
                        }
                    });
                }
                else if (Message.Skip)
                {
                    this.logger.log(ListrLogLevels.SKIPPED, task.Title, {
                        suffix: {
                            field: `${ListrLogLevels.SKIPPED}: ${Message.Skip}`,
                            format: () => color.yellow
                        }
                    });
                }
                else if (Message.Rollback)
                {
                    this.logger.log(ListrLogLevels.ROLLBACK, task.Title, {
                        suffix: {
                            field: `${ListrLogLevels.ROLLBACK}: ${Message.Rollback}`,
                            format: () => color.red
                        }
                    });
                }
                else if (Message.Retry)
                {
                    this.logger.log(ListrLogLevels.RETRY, task.Title, {
                        suffix: {
                            field: `${ListrLogLevels.RETRY}:${Message.Retry.Count}`,
                            format: () => color.red
                        }
                    });
                }
                else if (Message.Paused)
                {
                    const timer: PresetTimer = RendererOptions?.PausedTimer;

                    this.logger.log(
                        ListrLogLevels.PAUSED,
                        task.Title,
                        timer && {
                            suffix:
                            {
                                ...timer,
                                args: [ Message.Paused - Date.now() ],
                                condition: !!Message?.Paused && timer.condition
                            }
                        } as LoggerFieldOptions<false>
                    );
                }
            });
        });
    }

    private calculate(task: ListrSimpleRendererTask): void
    {
        if (this.cache.RendererOptions.has(task.Id) && this.cache.RendererTaskOptions.has(task.Id))
        {
            return;
        }

        const rendererOptions: ListrSimpleRendererOptions = this.options;;

        this.cache.RendererOptions.set(task.Id, rendererOptions);

        this.cache.RendererTaskOptions.set(task.Id, {
            ...SimpleRenderer.RendererTaskOptions,
            timer: rendererOptions.timer
        });
    }

    private reset(task: ListrSimpleRendererTask): void
    {
        this.cache.RendererOptions.delete(task.Id);
        this.cache.RendererTaskOptions.delete(task.Id);
    }
}
