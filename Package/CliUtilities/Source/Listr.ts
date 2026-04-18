/* File:      Listr.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type DefaultRenderer,
    type ListrBaseClassOptions,
    type ListrTask,
    type ListrTaskResult,
    Listr as OriginalListr } from "listr2";
import type {
    ListrConstructorTask,
    ListrTaskObject,
    ListrTaskTensed,
    ListrTaskTensedReturnType } from "./Listr.Types.js";
import { Inflectors } from "en-inflectors";

/** A string-only {@link Error} used by {@link Listr} to show nicely-formatted errors. */
export class SimpleError extends Error
{
    public constructor(Message: string)
    {
        super();
        this.TheMessage = Message;
    }

    public TheMessage: string;
};

class Listr<ContextType>
    extends OriginalListr<ContextType, typeof DefaultRenderer, typeof DefaultRenderer>
{
    public constructor(
        Task: ListrConstructorTask<ContextType>,
        Options?: ListrBaseClassOptions<ContextType, typeof DefaultRenderer, typeof DefaultRenderer>,
        ParentTask?: ListrTaskObject<unknown>
    )
    {
        if (Options === undefined && ParentTask === undefined)
        {
            super(Task);
        }
        else if (Options !== undefined && ParentTask === undefined)
        {
            super(Task, Options);
        }
        else if (Options !== undefined && ParentTask !== undefined)
        {
            super(Task, Options, ParentTask);
        }
    }
};

/**
 * A wrapper for `new Listr` that handles errors nicely.
 *
 * @typeParam ContextType - The type of the `listr2` context used by the {@link Task}.
 *
 * @param Task - The task(s) to run.
 * @param GenericErrorMessage - The error message that is shown if the {@link Task | task(s)} throw(s)
 * something other than a {@link SimpleError}.
 * @param Options - *(Optional)* The {@link ListrBaseClassOptions} used to customize the
 * {@link Task | task(s)}.
 * @param ParentTask - *(Optional)* The {@link ListrTaskObject | parent task} of which the
 * {@link Task | task(s)} are (a) descendant(s).
 */
export async function RunListr<ContextType = unknown>(
    Task: ListrConstructorTask<ContextType>,
    GenericErrorMessage: string,
    Options?: ListrBaseClassOptions<ContextType, typeof DefaultRenderer, typeof DefaultRenderer>,
    ParentTask?: ListrTaskObject<unknown>
): Promise<void>
{
    try
    {
        await new Listr(Task, Options, ParentTask);
    }
    catch (ListrError: unknown)
    {
        if (ListrError instanceof SimpleError)
        {
            console.error(`🚨 ${ ListrError.TheMessage }`);
        }
        else
        {
            console.dir(ListrError);
            console.error(`\n🚨 ${ GenericErrorMessage }.  The error is printed above.`);
        }
    }
}

/**
 *
 * @typeParam ContextType -
 * @param Task -
 */
export function ListrTaskTensed<ContextType = unknown>(
    Task: ListrTaskTensed<ContextType>
): ListrTaskObject<ContextType>;
export function ListrTaskTensed<ContextType = unknown>(
    InTask: ListrTaskTensed<ContextType>
): ListrTaskObject<ContextType>
{
    function GetResultTitle(InflectorFunction: keyof Inflectors): string
    {
        /** `{@link InTask.title}.split(" ").length > 0` is guaranteed by the {@link TensedTitle} type. */
        const Words: Array<string> = InTask.title.split(" ");
        const [ TitlePresentParticiple, ...TitleTail ] = Words;

        const UncapitalizedTitlePresentParticiple: string =
            (TitlePresentParticiple as string)[0]?.toLowerCase() +
            (TitlePresentParticiple as string).slice(1);

        const TitleVerb: string = new Inflectors(UncapitalizedTitlePresentParticiple)[InflectorFunction]();

        return [ TitleVerb, ...TitleTail ].join(" ");
    };

    const TaskWrapper = (
        Context: ContextType,
        Task: ListrTask<ContextType>
    ): void | ListrTaskResult<ContextType> =>
    {
        /**
         * Return a call to this function from your {@link InTask | Task} to tell
         * {@link ListrTaskTensed:function} that your task *failed*.  The `title` of the task
         * returned by {@link ListrTaskTensed:function} will update to convey that your task failed.
         *
         * @param Result - The result of the function.  Omit for your task to not return anything.
         * This is returned by the task returned by {@link ListrTaskTensed:function}.
         *
         * @returns An object describing to {@link ListrTaskTensed:function} whether your task succeeded, and
         * what the result of your task was.
         */
        function Fail(Result?: ListrTaskResult<ContextType>): ListrTaskTensedReturnType<ContextType>
        {
            const FailureTitle: string = "Failed to " + ResultTitleBase;

            Task.title = FailureTitle;

            return {
                Result,
                Success: false
            };
        }

        /**
         * Return a call to this function from your {@link InTask | Task} to tell
         * {@link ListrTaskTensed:function} that your task *succeeded*.  The `title` of the task
         * returned by {@link ListrTaskTensed:function} will update to convey that your task succeeded.
         *
         * @param Result - The result of the function.  Omit for your task to not return anything.
         * This is returned by the task returned by {@link ListrTaskTensed:function}.
         *
         * @returns An object describing to {@link ListrTaskTensed:function} whether your task succeeded, and
         * what the result of your task was.
         */
        function Succeed(Result?: ListrTaskResult<ContextType>): ListrTaskTensedReturnType<ContextType>
        {
            const SuccessTitle: string = ResultTitleBase;

            const PastTense = new Inflectors("fly").toPast();

            Task.title = SuccessTitle;

            return {
                Result,
                Success: true
            };
        }

        /**
         * Return a call to this function from your {@link InTask | Task} to tell
         * {@link ListrTaskTensed:function} that your task completed, but in a state that is not a simple
         * success or failure.  The `title` of the task returned by {@link ListrTaskTensed:function}
         * will update to the given {@link ExitTitle}.
         *
         * @param ExitTitle - The title that the task returned by {@link ListrTaskTensed:function} will have
         * upon this function being returned by your task.  It should describe the nontrivial state of
         * your task (that is—this function should be used iff your task did not complete in either of the
         * expected success or failure).
         *
         * @param Result - The result of the function.  Omit for your task to not return anything.
         * This is returned by the task returned by {@link ListrTaskTensed:function}.
         *
         * @returns An object describing to {@link ListrTaskTensed:function} whether your task succeeded, and
         * what the result of your task was.
         */
        function Exit(
            ExitTitle: string,
            Result?: ListrTaskResult<ContextType>
        ): ListrTaskTensedReturnType<ContextType>
        {
            Task.title = ExitTitle;

            return {
                Result,
                Success: true
            };
        }

        InTask.task(Context, Task, { Exit, Fail, Succeed });
    };

    return {
        ...InTask,
        task: TaskWrapper
    };
}
