/**
 * @file      Listr.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    ListrDefaultRenderer,
    ListrTask as ListrTaskOriginal,
    ListrTaskObject as ListrTaskObjectOriginal,
    ListrTaskFn as ListrTaskFnOriginal,
    ListrTaskResult,
    ListrTaskWrapper as ListrTaskWrapperOriginal,
    ListrBaseClassOptions } from "listr2";

export type ListrTaskFn<ContextType> =
    ListrTaskFnOriginal<ContextType, ListrDefaultRenderer, ListrDefaultRenderer>;

export type ListrTaskNative<ContextType> =
    ListrTaskOriginal<
        ContextType,
        ListrDefaultRenderer,
        ListrDefaultRenderer
    >;

export type ListrOptions<ContextType> =
    ListrBaseClassOptions<
        ContextType,
        ListrDefaultRenderer,
        ListrDefaultRenderer
    >;

export type ListrTask<ContextType> =
    | ListrTaskNative<ContextType>
    | (
        ListrTaskNative<ContextType> &
        {
            tensed: false;
        })
    | ListrTaskTensed<ContextType>;

export type ListrTaskWrapper<ContextType> = ListrTaskWrapperOriginal<
    ContextType,
    ListrDefaultRenderer,
    ListrDefaultRenderer
>;

export type ListrConstructorTask<ContextType> =
    | ListrTaskNative<ContextType>
    | Array<ListrTaskNative<ContextType>>;

export type TensedTitle = `${ string }ing ${ string }.`;

export namespace ListrTaskTensedCallbackReturnType
{
    export type NewListr<ContextType> =
        {
            (Argument: NewListrFn<ContextType>): ListrTaskTensedResult<ContextType>;
        };

    export type FailureOptions =
        | { }
        | {
            Throw: false;
        }
        | {
            Throw: true;
            Error: Error;
            Message: string;
        }
        | {
            Throw: true;
            Message: string;
        }
        | {
            Throw: true;
            Error: Error;
        };

    export type Failure<ContextType> =
        {
            (Options: FailureOptions, Result?: ListrTaskResult<ContextType>): ListrTaskTensedResult<ContextType>;
        };

    export type Success<ContextType> =
        {
            (Result?: ListrTaskResult<ContextType>): ListrTaskTensedResult<ContextType>;
        };

    export type Exit<ContextType> =
        {
            (Title: string, Result?: ListrTaskResult<ContextType>): ListrTaskTensedResult<ContextType>;
        };
}

/**
 * The callbacks provided to a task wrapped by {@link ListrTaskTensed:function} to
 * describe the state of your task when it completes (returns).
 *
 * @property Exit - The callback that tells {@link ListrTaskTensed:function} that
 * your task completed in a state other than a simple success or failure, and carries
 * the result of your task (if one exists).
 *
 * @property Fail - The callback that tells {@link ListrTaskTensed:function} that
 * your task failed, and carries the result of your task (if one exists).
 *
 * @property Succeed - The callback that tells {@link ListrTaskTensed:function} that
 * your task succeeded, and carries the result of your task (if one exists).
 */
export type ListrTaskTensedCallbacks<ContextType> =
    {
        Exit: ListrTaskTensedCallbackReturnType.Exit<ContextType>;
        Fail: ListrTaskTensedCallbackReturnType.Failure<ContextType>;
        NewListr: ListrTaskTensedCallbackReturnType.NewListr<ContextType>;
        Succeed: ListrTaskTensedCallbackReturnType.Success<ContextType>;
    };

export type ListrTaskTensedFunction<ContextType> =
    {
        (
            Context: ContextType,
            Task: ListrTaskWrapper<ContextType>,
            Callbacks: ListrTaskTensedCallbacks<ContextType>
        ): Promise<ListrTaskTensedResult<ContextType>>;
    };

export type ListrTaskTensed<ContextType> =
    Omit<ListrTaskNative<ContextType>, "task" | "title"> &
    {
        task: ListrTaskTensedFunction<ContextType>;
        tensed: true;
        title: TensedTitle;
    };

export type ListrTaskTensedArgument<ContextType> =
    Omit<ListrTaskTensed<ContextType>, "tensed">;

export type ListrTaskObject<ContextType> =
    ListrTaskObjectOriginal<
        ContextType,
        ListrDefaultRenderer,
        ListrDefaultRenderer
    >;

export type NewListrFn<ContextType> =
    Extract<
        Parameters<ListrTaskWrapper<ContextType>["newListr"]>[0],
        Function
    >;

export type ListrTaskTensedResult<ContextType> =
    {
        Result:
            | ListrTaskResult<ContextType>
            | NewListrFn<ContextType>
            | undefined;
        Status: "Success" | "Failure" | "Exit" | "NewListr";
    };
