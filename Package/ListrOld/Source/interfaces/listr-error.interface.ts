/**
 * @file      listr-error.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrContext } from "./listr.interface.js";
import type { ListrErrorTypes } from "@constants/index.js";
import type { Task } from "@lib/index.js";
import { cloneObject } from "@utils/index.js";

/**
 * Internal error handling mechanism for Listr collects the errors and details for a failed task.
 *
 * @see {@link https://listr2.kilic.dev/task/error-handling.html}
 */
export class ListrError<
    ContextType = ListrContext,
    SubtasksContextType = ListrContext,
    ParentContextType = ListrContext
> extends Error
{
    public Path: Array<string>;
    public Context: ContextType;

    private static IsError(In: unknown): In is Error
    {
        return (
            typeof In === "object" &&
            In !== null &&
            "message" in In &&
            typeof In.message === "string"
        );
    }

    constructor(
        public Error: unknown,
        public Type: ListrErrorTypes,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        public Task: Task<ContextType, SubtasksContextType, ParentContextType, any, any>
    )
    {
        if (ListrError.IsError(Error))
        {
            super(Error.message);
        }
        else
        {
            super();
        }

        this.name = "ListrError";
        this.Path = Task.Path;

        /* Memory-intensive error collection for circular objects on demand. */
        if (Task?.Options.collectErrors === "full")
        {
            type FRecord = Record<PropertyKey, unknown>;
            const TaskCast: FRecord = Task as unknown as FRecord;
            this.Task = cloneObject(TaskCast) as unknown as typeof this.Task;
            const ContextCast: FRecord = Task.Listr.Context as unknown as FRecord;
            this.Context = cloneObject(ContextCast) as unknown as typeof this.Context;
        }

        if (ListrError.IsError(Error))
        {
            this.stack = Error.stack;
        }
    }
}
