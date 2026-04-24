/**
 * @file      renderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrRenderer, ListrTaskMessage } from "@interfaces/index.js";
import { ListrTaskEventType, ListrTaskState } from "@constants/index.js";
import type {
    ListrTestRendererOptions,
    ListrTestRendererTask,
    ListrTestRendererTaskOptions } from "./renderer.interface.js";
import { ListrLogger } from "@utils/index.js";
import type { TEntry } from "@sorrell/utilities/misc";
import type { Task } from "@lib/task.js";
import { TestRendererSerializer } from "./serializer.js";

export class TestRenderer implements ListrRenderer
{
    public static NonTty: boolean = true;
    public static RendererOptions: ListrTestRendererOptions =
        {
            Messages: [ "Skip", "Error", "Retry", "Rollback", "Paused" ],
            MessagesToStderr: [ "Error", "Rollback", "Retry" ],
            Output: true,
            Prompt: true,
            State: Object.values(ListrTaskState),
            Subtasks: true,
            Task:
            [
                "HasRolledBack",
                "IsRollingBack",
                "IsCompleted",
                "IsSkipped",
                "HasFinalized",
                "HasSubtasks",
                "Title",
                "HasReset",
                "HasTitle",
                "IsPrompt",
                "IsPaused",
                "IsPending",
                "IsSkipped",
                "IsStarted",
                "HasFailed",
                "IsEnabled",
                "IsRetrying",
                "Path"
            ],
            Title: true
        };
    public static RendererTaskOptions: ListrTestRendererTaskOptions;

    private readonly logger: ListrLogger;
    private serializer: TestRendererSerializer;

    constructor(
        private readonly tasks: Array<ListrTestRendererTask>,
        private readonly options: ListrTestRendererOptions
    )
    {
        this.options = { ...TestRenderer.RendererOptions, ...this.options };

        this.logger = this.options.Logger ?? new ListrLogger<never>({ useIcons: false });

        this.serializer = new TestRendererSerializer(this.options);
    }

    public Render(): void
    {
        this.Renderer(this.tasks);
    }

    public End(): void {}

    // verbose renderer multi-level
    private Renderer(tasks: Array<ListrTestRendererTask>): void
    {
        tasks.forEach((task: ListrTestRendererTask) =>
        {
            if (this.options.Subtasks)
            {
                task.on(ListrTaskEventType.SUBTASK, (
                    Subtasks: Array<Task<unknown, unknown, unknown>>
                ) =>
                {
                    this.Renderer(Subtasks as unknown as Array<ListrTestRendererTask>);
                });
            }

            if (this.options.State)
            {
                task.on(ListrTaskEventType.STATE, (State: ListrTaskState) =>
                {
                    this.logger.toStdout(this.serializer.serialize(ListrTaskEventType.STATE, State, task));
                });
            }

            if (this.options.Output)
            {
                task.on(ListrTaskEventType.OUTPUT, (Data: string) =>
                {
                    this.logger.toStdout(this.serializer.serialize(ListrTaskEventType.OUTPUT, Data, task));
                });
            }

            if (this.options.Prompt)
            {
                task.on(ListrTaskEventType.PROMPT, (Prompt: string) =>
                {
                    this.logger.toStdout(this.serializer.serialize(ListrTaskEventType.PROMPT, Prompt, task));
                });
            }

            if (this.options.Title)
            {
                task.on(ListrTaskEventType.TITLE, (Title: string) =>
                {
                    this.logger.toStdout(this.serializer.serialize(ListrTaskEventType.TITLE, Title, task));
                });
            }

            task.on(ListrTaskEventType.MESSAGE, (message: ListrTaskMessage) =>
            {
                const parsed: ListrTaskMessage = Object.fromEntries(
                    Object.entries(message)
                        .map(([ InKey, InValue ]: [ string, unknown ]) =>
                        {
                            const [ Key, Value ] = [ InKey, InValue ] as TEntry<typeof message>;
                            if (this.options.Messages.includes(Key as keyof ListrTaskMessage))
                            {
                                return [ Key, Value ];
                            }
                        })
                        .filter(Boolean)
                );

                if (Object.keys(parsed).length > 0)
                {
                    const Output: string = this.serializer.serialize(
                        ListrTaskEventType.MESSAGE,
                        parsed,
                        task
                    );

                    const HasState = (State: keyof ListrTaskMessage): boolean =>
                    {
                        return Object.keys(parsed).includes(State);
                    };

                    if (this.options.MessagesToStderr.some(HasState))
                    {
                        this.logger.toStderr(Output);
                    }
                    else
                    {
                        this.logger.toStdout(Output);
                    }
                }
            });
        });
    }
}
