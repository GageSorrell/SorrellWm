/**
 * @file      Listr.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright 2026 Gage Sorrell
 * @license   MIT
 */

import {
    type ListrBaseClassOptions,
    type ListrDefaultRenderer,
    type ListrTask as ListrTaskOriginal,
    type ListrTaskResult,
    Listr as ListrOriginal } from "listr2";
import type {
    ListrConstructorTask,
    ListrOptions,
    ListrTask,
    ListrTaskNative,
    ListrTaskObject,
    ListrTaskTensed,
    ListrTaskTensedArgument,
    ListrTaskTensedCallbackReturnType,
    ListrTaskTensedResult,
    ListrTaskWrapper,
    NewListrFn } from "./Listr.Types.js";
import { Inflectors } from "en-inflectors";

class ListrTaskError extends Error
{
    public constructor({
        Message,
        OriginalError
    }: {
        Message?: string;
        OriginalError?: Error;
    })
    {
        super();
        this.OriginalError = OriginalError;
        this.Message = Message;
    }

    public OriginalError: Error | undefined;
    public Message: string | undefined;
};

class ListrInternal<ContextType>
    extends ListrOriginal<ContextType, ListrDefaultRenderer, ListrDefaultRenderer>
{
    public constructor(
        Task: ListrConstructorTask<ContextType>,
        Options?: ListrOptions<ContextType>,
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
 * @template ContextType - The type of the `listr2` context used by the {@link Task}.
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
    Tasks: Array<ListrTask<ContextType>>,
    Options?: ListrOptions<ContextType>,
    ParentTask?: ListrTaskObject<unknown>
): Promise<void>;
export async function RunListr<ContextType = unknown>(
    Tasks: Array<ListrTask<ContextType>>,
    InOptions?: ListrOptions<ContextType>,
    ParentTask?: ListrTaskObject<unknown>
): Promise<void>
{
    const DefaultOptions: ListrOptions<ContextType> =
        {
            exitOnError: true
        };

    const Options: ListrOptions<ContextType> =
        {
            ...DefaultOptions,
            ...(InOptions || { })
        };

    try
    {
        const HandledTasks: Array<ListrTaskNative<ContextType>> =
            Tasks.map(NewListrTask);

        await new ListrInternal(HandledTasks, Options, ParentTask).run();
    }
    catch (ListrError: unknown)
    {
        if (!Options.exitOnError)
        {
            return;
        }

        if (ListrError instanceof ListrTaskError)
        {
            const Message: string =
                `\n🚨 ${ ListrError.Message }` || `\n🚨 Exited due to an error.${ ListrError.OriginalError !== undefined ? "  The error is printed above." : ""}`;

            if (ListrError.OriginalError !== undefined)
            {
                console.dir(JSON.stringify(ListrError.OriginalError, null, 4));
            }

            console.error(Message);
        }
        else
        {
            console.dir(JSON.stringify(ListrError, null, 4));
            console.error(`\n🚨 Exited due to an error.  The error is printed above.`);
        }
    }
}

export function NewListrTask<ContextType = unknown>(
    Task: ListrTask<ContextType>
): ListrTaskOriginal<ContextType, ListrDefaultRenderer, ListrDefaultRenderer>
export function NewListrTask<ContextType = unknown>(
    InTask: ListrTask<ContextType>
): ListrTaskOriginal<ContextType, ListrDefaultRenderer, ListrDefaultRenderer>
{
    if ("tensed" in InTask)
    {
        if (InTask.tensed === false)
        {
            const { tensed, ...Task } = InTask;
            return Task;
        }
        else
        {
            return NewListrTaskTensed(InTask);
        }
    }
    else
    {
        return InTask;
    }
}

/**
 * @TODO Write this comment.
 *
 * @template ContextType -
 * @param Task -
 *
 * @returns
 */
export function NewListrTaskTensed<ContextType = unknown>(
    Task: ListrTaskTensedArgument<ContextType>
): ListrTaskNative<ContextType>;
export function NewListrTaskTensed<ContextType = unknown>(
    InTask: ListrTaskTensedArgument<ContextType>
): ListrTaskNative<ContextType>
{
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function GetResultTitle(Success: boolean): string
    {
        /** `{@link InTask.title}.split(" ").length > 0` is guaranteed by the {@link TensedTitle} type. */
        const Words: Array<string> = InTask.title.split(" ");
        const [ TitlePresentParticiple, ...TitleTail ] = Words;

        if (TitlePresentParticiple === undefined)
        {
            return "";
        }

        if (Success)
        {
            const TitleVerb: string = new Inflectors(TitlePresentParticiple).toPast();

            return [ TitleVerb, TitleTail ].join(" ");
        }
        else
        {
            const TitleVerb: string = new Inflectors(TitlePresentParticiple).toPresent();
            const TitleVerbUncapitalized: string = TitleVerb[0]?.toLowerCase() + TitleVerb.slice(1);

            return [ "Failed to", TitleVerbUncapitalized, TitleTail ].join(" ");
        }
    };

    const TaskWrapper = async (
        Context: ContextType,
        Task: ListrTaskWrapper<ContextType>,
    ): Promise<void | ListrTaskResult<ContextType>> =>
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
        function Fail(
            Options: ListrTaskTensedCallbackReturnType.FailureOptions,
            Result?: ListrTaskResult<ContextType>
        ): ListrTaskTensedResult<ContextType>
        {
            Task.title = GetResultTitle(false);

            if ("Throws" in Options && Options.Throws)
            {
                if ("Error" in Options)
                {
                    if ("Message" in Options)
                    {
                        throw new ListrTaskError({
                            OriginalError: Options.Error,
                            Message: Options.Message
                        });
                    }
                    else
                    {
                        throw new ListrTaskError({ OriginalError: Options.Error });
                    }
                }

                if ("Message" in Options)
                {
                    throw new ListrTaskError({ Message: Options.Message });
                }
            }

            return {
                Result,
                Status: "Failure"
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
        function Succeed(Result?: ListrTaskResult<ContextType>): ListrTaskTensedResult<ContextType>
        {
            Task.title = GetResultTitle(true);

            return {
                Result,
                Status: "Success"
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
        ): ListrTaskTensedResult<ContextType>
        {
            Task.title = ExitTitle;

            return {
                Result,
                Status: "Exit"
            };
        }

        function NewListr(
            Argument: NewListrFn<ContextType>
        ): ListrTaskTensedResult<ContextType>
        {
            return {
                Result: Argument,
                Status: "NewListr"
            };
        }

        const Result = await InTask.task(Context, Task, { Exit, Fail, NewListr, Succeed });
        if (Result.Status === "NewListr")
        {
            await Result.Result;
        }
        if (typeof Result === "object" && Result !== null && "Result" in Result && "Status" in Result)
        {
            return Result;
        }
        else
        {
        }
    };

    return {
        ...InTask,
        task: TaskWrapper
    };
}
