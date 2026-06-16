/**
 * Errors with which effects in the {@link \@sorrell/effect-ink/Task} module can fail.
 *
 * @module @sorrell/effect-ink/Task/TaskError
 */

/**
 * @file      TaskError.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Output from "./Output.js";
import type * as Task from "./Task.js";
import type * as TaskState from "./TaskState.js";
import { Data, type Record } from "effect";
import type { Untagged } from "../Utility.js";

/**
 * The error that occurs when a task emits a {@link TaskOutput}, but the group to which the task belongs
 * does not have a task log to display emissions.
 *
 * @see {@link EmitSafe} To attempt emissions without failure, even if there is no log to receive
 * the {@link TaskOutput}.
 */
export class TaskLogNotFound extends Data.TaggedError("TaskLogNotFound")<
    Untagged<Output.Output> &
    { readonly Owner: Task.Handle; }
> { }

/**
 * For a given *invalid* {@link RecordLike | configuration object}, this is a {@link Record!ReadonlyRecord}
 * that assigns each invalid property in the configuration object with a short description of the respective
 * property's issue.
 *
 * @template RecordLike - The type of the configuration object whose state is invalid.
 */
export type OffendingKeys<RecordLike extends object> =
    Partial<Record.ReadonlyRecord<Extract<keyof RecordLike, string | symbol>, string>>;

/**
 * An error that occurs when {@link SetState} is called with an invalid {@link TaskState.TaskState}.
 *
 * @property {Partial<Record.ReadonlyRecord<keyof TaskOptions, string>>} If specified, the
 * keys of the properties that are invalid, equipped with a brief description of why that
 * value is invalid.
 *
 * @property {TaskState.TaskStateView} CurrentState - The {@link TaskState.TaskStateView} of the task whose
 * state was attempted to be updated (with invalid state).
 *
 * @property {TaskState.TaskState} NewState - The {@link TaskState.TaskState} argument that is invalid.
 */
export class InvalidNewTaskState extends Data.TaggedError("InvalidNewTaskState")<{
    OffendingKeys?: OffendingKeys<TaskState.TaskState>;
    CurrentState: TaskState.TaskStateView;
    NewState: TaskState.TaskState;
}> { };

/**
 * An error that occurs when a function accepting {@link TaskOptions} is given an options
 * object with invalid value(s).
 *
 * @property {Partial<Record.ReadonlyRecord<keyof TaskOptions, string>>} If specified, the
 * keys of the properties that are invalid, equipped with a brief description of why that
 * value is invalid.
 *
 * @property {TaskOptions} Options - The {@link TaskOptions} that is invalid.
 */
export class InvalidTaskOptions extends Data.TaggedError("InvalidTaskOptions")<{
    OffendingKeys?: OffendingKeys<Task.Options>;
    Options: Task.Options;
}> { };

/**
 * An error that occurs when {@link PatchState} is called with an invalid {@link Patch}.
 *
 * @property {Partial<Record.ReadonlyRecord<keyof TaskOptions, string>>} If specified, the
 * keys of the properties that are invalid, equipped with a brief description of why that
 * value is invalid.
 *
 * @property {TaskState.TaskStateView} CurrentState - The {@link TaskState.TaskStateView} of the task whose
 * state was attempted to be patched (with invalid state).
 *
 * @property {Partial<TaskState.TaskState>} Patch - The invalid patch that caused this error.
 */
export class InvalidTaskStatePatch extends Data.TaggedError("InvalidTaskState.TaskStatePatch")<{
    OffendingKeys?: OffendingKeys<Task.Options>;
    CurrentState: TaskState.TaskStateView;
    Patch: Partial<TaskState.TaskState>;
}> { };

/**
 * An error that occurs when {@link Make} is given {@link TaskOptions} with a
 * specified {@link TaskOptions!Key}, and a task having that key already exists.
 *
 * @see {@link MakeSafe} To create a task such that if a key is specified in its {@link TaskOptions},
 * and a task having this key already exists, then a new task will *not* be created, and an error
 * of this type will not be created.
 */
export class TaskCollision extends Data.TaggedError("TaskCollision")<{ Key: string; }> { };
export class GroupCollision extends Data.TaggedError("GroupCollision")<{ Key: string; }> { };

export type TaskCreationError =
    | InvalidTaskOptions
    | GroupNotFound
    | TaskCollision;

/**
 * An error that occurs when a function belonging to the {@link TaskService} is called with
 * a {@link Handle} that does not identify an existing task.
 *
 * @property {string} Key - The `string` returned by calling {@link Symbol!keyFor} on
 * the given {@link Handle!Identifier}.
 */
export class TaskNotFound extends Data.TaggedError("TaskNotFound")<{
    Key: string;
}> { };

export class GroupNotFound extends Data.TaggedError("GroupNotFound")<{
    Key: string;
}> { };

/**
 * The errors with which all functions belonging to the {@link TaskService} can fail.
 *
 * @template E - An ergonomic helper type parameter for defining the error type of
 * an {@link Effect!Effect | effect}.
 */
export type TaskServiceError<E = never> =
    | E
    | TaskNotFound;
