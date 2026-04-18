/* File:      Listr.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    DefaultRenderer,
    ListrDefaultRenderer,
    ListrGetRendererClassFromValue,
    ListrTask,
    ListrTaskObject as ListrTaskObjectOriginal,
    ListrTaskResult,
    ListrTaskWrapper } from "listr2";

export type Wrapper<ContextType> = ListrTaskWrapper<
    ContextType,
    ListrDefaultRenderer,
    ListrDefaultRenderer
>;

export type ListrConstructorTask<ContextType> =
    | ListrTask<
        ContextType,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>>
    | Array<ListrTask<
        ContextType,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>>
    >;

export type TensedTitle = `${ string }ing ${ string }.`;

export type ListrTaskTensedCallback<ContextType> =
    {
        (Result?: ListrTaskResult<ContextType>): ListrTaskTensedReturnType<ContextType>;
    };

export type ListrTaskTensedCallbackExit<ContextType> =
    {
        (Title: string, Result?: ListrTaskResult<ContextType>): ListrTaskTensedReturnType<ContextType>;
    };

export type ListrTaskTensedReturnType<ContextType> =
    {
        Result: ListrTaskResult<ContextType> | undefined;
        Success: boolean;
    };

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
        Exit: ListrTaskTensedCallbackExit<ContextType>;
        Fail: ListrTaskTensedCallback<ContextType>;
        Succeed: ListrTaskTensedCallback<ContextType>;
    };

export type ListrTaskTensedFunction<ContextType> =
    {
        (
            Context: ContextType,
            Task: ListrTask<ContextType>,
            Callbacks: ListrTaskTensedCallbacks<ContextType>
        ): Promise<ListrTaskTensedReturnType<ContextType>>;
    };

export type ListrTaskTensed<ContextType> =
    Omit<ListrTask, "task" | "title"> &
    {
        task: ListrTaskTensedFunction<ContextType>;
        title: TensedTitle;
    };

export type ListrTaskObject<ContextType> =
    ListrTaskObjectOriginal<
        ContextType,
        typeof DefaultRenderer,
        typeof DefaultRenderer
    >;
