/**
 * @file      adapter.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type ListrRendererSubclass, PromptError } from "@interfaces/index.js";
import type { Task, TaskWrapper } from "@lib/index.js";
import { ListrTaskState } from "@constants/index.js";

export abstract class ListrPromptAdapter
{
    private state: ListrTaskState;

    constructor(
        protected task: Task<
            unknown,
            unknown,
            unknown,
            ListrRendererSubclass,
            ListrRendererSubclass
        >,
        protected wrapper: TaskWrapper<
            unknown,
            unknown,
            unknown,
            ListrRendererSubclass,
            ListrRendererSubclass
        >
    ) {}

    protected reportStarted(): void
    {
        this.state = this.task.State;

        if (this.task.Prompt)
        {
            throw new PromptError(
                "There is already an active prompt attached to this task " +
                "which may not be cleaned up properly."
            );
        }
        this.task.Prompt = this;

        this.task.state$ = ListrTaskState.PROMPT;
    }

    protected reportFailed(): void
    {
        this.task.state$ = ListrTaskState.PROMPT_FAILED;
        this.restoreState();
    }

    protected reportCompleted(): void
    {
        this.task.state$ = ListrTaskState.PROMPT_COMPLETED;
        this.restoreState();
    }

    protected restoreState(): void
    {
        this.task.Prompt = undefined;

        if (this.state)
        {
            // without pushing it through the subscriptions again, just set the state back to original
            this.task.State = this.state;
        }
    }

    public abstract run<T = unknown>(...args: Array<unknown>): T | Promise<T>;
}
