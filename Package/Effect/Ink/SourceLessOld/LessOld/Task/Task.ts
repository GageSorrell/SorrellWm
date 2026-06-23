/**
 * The tasks that this package can display to users.
 *
 * @module @sorrell/effect-ink/Task/Task
 */

/**
 * @file      Task.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Group from "./Group.ts";
import * as Utility from "./Internal/Utility.ts";
import type { Natural, Percentage } from "../Utility.ts";
import { Data } from "effect";
import type { HandleArgument } from "./Utility.ts";
import type { ReactNode } from "react";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { TaskOutput as TaskOutputComponent } from "../ComponentOld/Task/TaskOutput.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Task";
export const TypeId: unique symbol = Symbol.for(TypeIdKey);

export type TypeId = typeof TypeId;

/* eslint-disable @typescript-eslint/no-empty-object-type */

export type TaskProgress = Data.TaggedEnum<{
    /** The quantity of work that the task performs is not set (or is unknown). */
    Indeterminate: { };

    /**
     * The quantity of work that the task has completed, represented as a percentage of
     * of the total quantity of work that the task performs.
     *
     * @property {Percentage} Value - The percentage of completed work.
     */
    Percentage:
    {
        readonly Value: Percentage;
    };

    /**
     * The quantity of work that the task has completed, represented as a ratio of "items"
     * that model the work that is performed by the task.
     *
     * @property {Natural} Completed - The quantity of completed items, of the items that represent
     * the work that the task performs.
     *
     * @property {Natural} Total - The total quantity of items that represent the work that
     * the task performs.
     */
    Discrete:
    {
        readonly Completed: Natural;
        readonly Total: Natural;
    };
}>;

type TaskStatusPrimitives = Data.TaggedEnum<{
    /** The task is complete and was *not* successful. */
    Failed:
    {
        Reason?: ReactNode;
    };

    /** The task is complete and was successful. */
    Succeeded: { };

    /** The task is in-progress and is running as expected. */
    Healthy: { };

    /**
     * The state of the task is unknown.
     *
     * An example of when this might occur is when a task is performed on
     * another machine, and that machine is not reporting its progress as expected.
     */
    Uncertain: { };

    /**
     * The task is complete and was successful and this success satisfies some criterion
     * that is optional but desired.
     */
    SucceededPlus: { };

    /**
     * The task is complete and was successful, but this success failed to satisfy
     * some criterion that is expected and desirable.
     */
    SucceededMinus: { };

    /**
     * The task will not be performed due to the result of an upstream task.
     * This should be used for tasks that were disabled, once it the program
     * has determined that this task does not need to be performed.
     */
    Skipped: { };

    /**
     * The task has not been started, typically because an upstream task must finish first.
     * This also describes tasks that have not yet been started *and* might not be performed,
     * depending upon the results of an upstream task.
     *
     * If it is determined that a disabled task will not be performed, it should be marked as `Skipped`.
     */
    Disabled: { };

    /**
     * The changes to the program's state by this task is or has been undone, typically due
     * to a downstream error that prevents the goal of the tasks from being achieved.
     *
     * @property {boolean} InProgress - Whether the rollback is currently being done.  Note that
     * the completion state of rollbacks is *not* differentiated as success, failure, *etc.* like
     * tasks are.
     */
    Rollback:
    {
        readonly InProgress: boolean;
    };
}>;

/* eslint-enable @typescript-eslint/no-empty-object-type */

/* eslint-disable @typescript-eslint/typedef */

/**
 * The status of a given task, which categorizes its current state *wrt* its completion.
 */
export const Status = Data.taggedEnum<TaskStatusPrimitives>();

/* eslint-enable @typescript-eslint/typedef */

/** {@inheritDoc TaskStatus:var} */
export type Status = typeof Status[keyof typeof Status];

/**
 * The collection of suffixes that `@sorrell/effect-ink` will append to the body of
 * a given task, if an object of this type is specified when the task is created.
 *
 * To use the default value for a given property, omit that property (or access the
 * default values via {@link Suffixes:var}).  To specify that a given status should *not*
 * have a suffix, use `undefined`.
 *
 * @property {string | undefined} Failed - The suffix applied to tasks whose status
 * is `Failed`.  The default is `"!"`.
 *
 * @property {string | undefined} Healthy - The suffix applied to tasks whose status
 * is `Healthy` (in progress and progressing as expected).  The default is `"..."`.
 *
 * @property {string | undefined} Succeeded - The suffix applied to tasks whose status
 * is `Succeeded`.  The default is `"!"`.
 *
 * @property {string | undefined} Other - The suffix applied to tasks of any one of
 * the statuses for which a property in this does not exist.  The default is `"."`.
 */
export interface Suffixes
{
    readonly _tag: "TaskSuffixes";

    readonly Failed?: string | undefined;
    readonly Healthy?: string | undefined;
    readonly Other?: string | undefined;
    readonly Succeeded?: string | undefined;
}

/** The default {@link Suffixes:type | task suffixes}. */
export const Suffixes: Suffixes =
    {
        _tag: "TaskSuffixes",

        Failed: "!",
        Healthy: "...",
        Other: ".",
        Succeeded: "!"
    } as const;

/**
 * The options that specify a task to create.
 *
 * @property {symbol} Key - If specified, then this is the unique identifier for the task created with this.
 * The collision of keys is handled by {@link Make}, and is *not* handled by {@link MakeSafe}.
 *
 * @property {ReactNode} InitialBody - The initial content of the task's representation in the terminal.
 *
 * @property {string} Label - If this task emits output, then the {@link TaskOutputComponent | TaskOutput}
 * that displays the output will prepend this to each output (unless configured otherwise).
 *
 * @property {TaskSuffixes | undefined} Suffixes - If specified and *not* `undefined`, then this is the
 * {@link Suffixes} to append to the task's body.  If specified and `undefined`, then *no* suffixes
 * will be applied.  The default suffixes are {@link Suffixes:var}.
 *
 * @property {TaskStatus} InitialStatus - If specified, then this is the initial
 * {@link Status | status of the task} that is created with these options.  The default
 * is `Healthy`.
 */
export interface Options
{
    readonly _tag: "TaskOptions";

    readonly Group?: HandleArgument<Group.Handle>;
    readonly Parent?: Handle;
    readonly Key?: Handle;
    readonly InitialBody?: ReactNode;
    readonly Label?: string;
    readonly Suffixes?: Suffixes | undefined;
    readonly InitialStatus?: Status;
}

/**
 * The handle to a given task.  This is used to interact with the {@link TaskService}.
 */
export type Handle = Utility.Handle<"Task">;

/** {@inheritDoc Handle:type} */
export const Handle: Utility.HandleConstructor<Handle> = Utility.MakeHandleConstructor(TypeIdKey);

/** {@inheritDoc Handle:type} */
export const IsTaskHandle: Utility.HandleGuard<Handle> = Utility.MakeHandleGuard<Handle>(TypeIdKey);
