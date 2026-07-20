/**
 * @module @sorrell/effect-ink/Task/TaskState
 */

/**
 * @file      TaskState.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Task from "./Task.ts";
import { MakeTagged, Tagged, type Untagged } from "../Utility.ts";
import type { ReactNode } from "react";

/**
 * The state of a task.  This may be retrieved via {@link GetState}, and updated via
 * {@link SetState} or {@link PatchState}.
 */
export interface TaskState
{
    readonly _tag: "TaskState";

    readonly Body: ReactNode;
    readonly Label: string | undefined;

    readonly Status: Task.Status;
    readonly Suffixes: Task.Suffixes | undefined;
}

/**
 * The "full" state of a task.  This fully describes a task, whereas {@link TaskState}
 * omits the handle and other "meta" properties.
 */
export interface TaskStateView extends Untagged<TaskState>
{
    readonly _tag: "TaskStateView";
    Owner: Task.Handle;
}

export const TaskState: {
    (In: Untagged<TaskState>): TaskState;
} = MakeTagged("TaskState");

export const TaskStateView = (Handle: Task.Handle, State: TaskState): TaskStateView =>
{
    return Tagged({ ...State, Owner: Handle }, "TaskStateView");
};
