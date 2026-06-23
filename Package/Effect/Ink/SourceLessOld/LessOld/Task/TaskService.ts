/**
 * @file      TaskService.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Error from "./TaskError.ts";
import * as Group from "./Group.ts";
import * as Internal from "./Internal/TaskService.ts";
import type * as Output from "./Output.ts";
import * as Task from "./Task.ts";
import type * as TaskState from "./TaskState.ts";
import { Context, Effect, Layer, MutableHashMap, Option } from "effect";
import { dual, pipe } from "effect/Function";
import { MutableMultiMap } from "@sorrell/multimap";

const TypeIdKey: string = "@sorrell/effect-ink/Task/TaskService";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);

export type TypeId = typeof TypeId;

/** Update the state of a given task. */
export type SetState =
    {
        /**
         * Set the state of a given task.
         *
         * @param Handle - The {@link Handle} of the task whose state will be set by this.
         *
         * @param NewState - The new {@link TaskState.TaskState} to apply to the given task.
         *
         * @returns {TaskServiceEffect<void, InvalidNewTaskState.TaskState>} An
         * {@link Effect!Effect | effect} that sets the state of the given task to the given {@link NewState}.
         */
        (Handle: Task.Handle,
            NewState: TaskState.TaskState
        ): TaskServiceEffect<void, Error.InvalidNewTaskState>;

        /**
         * Set the state of a given task by specifying the task to update, then calling the function
         * returned by this with the new state.
         *
         * @param Handle - The {@link Handle} of the task whose state will be updated by the
         * function returned by this.
         *
         * @returns {(NewState: TaskState.TaskState) =>
         * TaskServiceEffect<void, InvalidNewTaskState.TaskState>} An
         * {@link Effect!Effect | effect} that updates the state of the given task with
         * the given {@link StateSet}.
         */
        (Handle: Task.Handle):
        {
            /**
             * Set the state of the task specified in the function that returned this.
             *
             * @see {@link SetState:type}
             *
             * @param NewState - The new state of the given task.
             *
             * @returns {TaskServiceEffect<void, InvalidNewTaskState.TaskState>} An
             * {@link Effect!Effect | effect} that sets the state of the given task
             * with the given {@link NewState}.
             */
            (NewState: TaskState.TaskState): TaskServiceEffect<void, Error.InvalidNewTaskState>;
        };
    };

/** Update the state of a given task by specifying only the properties to update. */
export type PatchState =
    {
        /**
         * Update the state of a given task by specifying only the properties to update.
         *
         * @param Handle - The {@link Handle} of the task whose state will be updated by this.
         *
         * @param StatePatch - The object containing the properties with which this will overwrite
         * the state of the given task.
         *
         * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An
         * {@link Effect!Effect | effect} that updates the state of the given task to the
         * given {@link StatePatch}.
         */
        (Handle: Task.Handle,
            StatePatch: Partial<TaskState.TaskState>
        ): TaskServiceEffect<void, Error.InvalidTaskStatePatch>;

        /**
         * Update the state of a given task by specifying the task to patch, then calling the function
         * returned by this with an object containing the properties with which the given task's state
         * will be updated.
         *
         * @param Handle - The {@link Handle} of the task whose state will be updated by the
         * function returned by this.
         *
         * @returns {(StatePatch: Partial<TaskState.TaskState>) =>
         * TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An {@link Effect!Effect | effect} that
         * updates the state of the given task with the given {@link StatePatch}.
         */
        (Handle: Task.Handle):
        {
            /**
             * Update the state of the task specified in the function that returned this, by
             * specifying a patch to overwrite the task's state.
             *
             * @see {@link PatchState:type}
             *
             * @param StatePatch - The object containing the properties with which this will overwrite the
             * state of the given task.
             *
             * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An
             * {@link Effect!Effect | effect} that updates the state of the given task with the
             * given {@link StatePatch | patch}.
             */
            (StatePatch: Partial<TaskState.TaskState>): TaskServiceEffect<void, Error.InvalidTaskStatePatch>;
        };
    };

/** A convenience function for updating the status of a given task. */
export type SetTaskStatus =
    {
        /**
         * Update the status of a given task.
         *
         * @param Handle - The {@link Handle} of the task whose status will be updated by this.
         *
         * @param NewStatus - The new {@link Status} value with which the task of the given
         * {@link Handle} will be updated.
         *
         * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An
         * {@link Effect!Effect | effect} that updates the status of the given task to the
         * given {@link NewStatus | status}.
         */
        (Handle: Task.Handle, NewStatus: Task.Status): TaskServiceEffect<void, Error.InvalidTaskStatePatch>;

        /**
         * Update the status of a given task by specifying the task whose status will be updated,
         * then calling the function returned by this with the desired new status.
         *
         * @param Handle - The {@link Handle} of the task whose status will be updated by this.
         *
         * @returns {(NewStatus: Status) => TaskServiceEffect<void, Error.InvalidTaskStatePatch>}
         * A function that updates the status of the task whose handle was specified when calling this.
         */
        (Handle: Task.Handle):
        {
            /**
             * Update the status of the task specified in the function that returned this.
             *
             * @see {@link SetTaskStatus:type}
             *
             * @param NewStatus - The new {@link Status} value with which the task of the given
             * {@link Handle} will be updated.
             *
             * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An
             * {@link Effect!Effect | effect} that updates the status of the given task to the
             * given {@link NewStatus | status}.
             */
            (NewStatus: Task.Status): TaskServiceEffect<void, Error.InvalidTaskStatePatch>;
        };
    };

/**
 * The errors with which mutator functions belonging to the {@link TaskContext} can fail.
 *
 * @template E - An ergonomic helper type parameter for defining the error type of
 * an {@link Effect!Effect | effect}.
 */
/** Emit a {@link TaskOutput} from a given {@link Handle | task}. */
export type Emit =
    {
        /**
         * Emit a {@link TaskOutput} from a given {@link Handle | task}.
         *
         * @param Handle - The handle of the task that is responsible for the
         * given {@link TaskOutput | emission}.
         *
         * @param Output - The {@link TaskOutput} to emit from the given task.
         *
         * @returns {WithTaskServiceEffect<void, TaskNotFound | TaskLogNotFound>} An
         * {@link Effect!Effect | effect} that emits the given {@link Output} from the
         * task given by the function that returned this.
         */
        (Handle: Task.Handle,
            Output: Output.Output
        ): WithTaskServiceEffect<void, Error.TaskNotFound | Error.TaskLogNotFound>;

        /**
         * Emit a {@link TaskOutput} from a given {@link Handle | task} by calling the function
         * returned by this.
         *
         * @param Handle - The handle of the task that is responsible for the given
         * {@link TaskOutput | emission}.
         *
         * @returns {(Output: Output.Output) => WithTaskServiceEffect<void, TaskNotFound | TaskLogNotFound>}
         * A function that emits a given {@link TaskOutput} from the given {@link Handle | task}.
         */
        (Handle: Task.Handle):
        {
            /**
             * Emit a {@link TaskOutput} from the task specified by the function that returned this.
             *
             * @param Output - The {@link TaskOutput} to emit from the given task.
             *
             * @returns {WithTaskServiceEffect<void, TaskNotFound | TaskLogNotFound>} An
             * {@link Effect!Effect | effect} that emits the given {@link Output} from the task given
             * by the function that returned this.
             */
            (Output: Output.Output): WithTaskServiceEffect<void, Error.TaskNotFound | Error.TaskLogNotFound>;
        };
    };

export interface TaskServiceImpl
{
    /**
     * Get the {@link TaskState.TaskState} of a given {@link Handle | task}.
     *
     * @param Handle - The handle to the given task.
     *
     * @returns {Option.Option<TaskState.TaskState>} An {@link Option!Option},
     * which {@link Option!isSome | is some} iff the task with the given {@link Handle} was found.
     */
    readonly GetState: (Handle: Task.Handle) => Option.Option<TaskState.TaskState>;

    /**
     * Get the {@link TaskState.TaskState} of a given {@link Handle | task}, failing with
     * {@link TaskNotFound} iff no task with the given {@link Handle} is found.
     *
     * @param Handle - The handle to the given task.
     *
     * @returns {TaskServiceEffect<TaskState.TaskState, TaskNotFound>} The state of the given task, or a
     * {@link TaskNotFound} failure.
     */
    readonly GetStateOrFail: (
        Handle: Task.Handle
    ) => TaskServiceEffect<TaskState.TaskState, Error.TaskNotFound>;

    /**
     * Get the {@link TaskState.TaskState} of a given {@link Handle | task}, without checking
     * that the desired task exists.
     *
     * @param Handle - The handle to the given task.
     *
     * @returns {TaskState.TaskState} The state of the given task, assumed to exist, but could be `undefined`.
     */
    readonly GetStateUnsafe: (Handle: Task.Handle) => TaskState.TaskState;

    /** {@inheritDoc SetState:type} */
    readonly SetState: SetState;

    /** {@inheritDoc PatchState:type} */
    readonly PatchState: PatchState;

    /** {@inheritDoc SetTaskStatus:type} */
    readonly SetTaskStatus: SetTaskStatus;

    /** {@inheritDoc Emit:type} */
    readonly Emit: Emit;

    /**
     * Determine whether a task exists that is identified by the given {@link Handle}.
     *
     * @param Handle - The handle of the given task.
     *
     * @returns {boolean} Whether a task exists that is identified by the given {@link Handle}.
     */
    readonly Exists: (Handle: Task.Handle) => boolean;

    /**
     * Determine whether a task exists that is identified by the given {@link Handle}, failing with
     * {@link TaskNotFound} iff the task does *not* exist, otherwise this succeeds with `true`.
     *
     * @param Handle - The handle of the given task.
     *
     * @returns {Effect.Effect<true, TaskNotFound>} Whether a task exists that is identified by the given
     * {@link Handle}: this {@link Effect!Effect | effect} succeeds with `true` iff the task exists, and
     * fails with {@link TaskNotFound} otherwise.
     */
    readonly ExistsOrFail: (Handle: Task.Handle) => TaskServiceEffect<true, Error.TaskNotFound>;

    readonly Make:
    {
        (Options: Task.Options): TaskServiceEffect<Task.Handle, Error.TaskCreationError>;
    };

    readonly MakeSafe:
    {
        (Options: Task.Options
        ): TaskServiceEffect<Task.Handle, Exclude<Error.TaskCreationError, Error.TaskCollision>>;
    };

    readonly MakeGroup:
    {
        (Options: Group.Options): TaskServiceEffect<Group.Handle, Error.GroupCollision>;
    };

    readonly MakeGroupSafe:
    {
        (Options: Group.Options): TaskServiceEffect<Group.Handle>;
    };

    readonly Remove:
    {
        (Handle: Task.Handle): TaskServiceEffect<void, Error.TaskNotFound>;
    };

    readonly RemoveSafe:
    {
        (Handle: Task.Handle): TaskServiceEffect<void>;
    };
}

export class TaskContext extends Context.Service<TaskContext, TaskServiceImpl>()(TypeIdKey)
{
    public static readonly Layer: Layer.Layer<TaskContext> = Layer.effect(TaskContext, Effect.gen(function* ()
    {
        const State: Internal.State = new Internal.State();

        const Emit: Emit = dual(2, (
            Handle: Task.Handle,
            Output: Output.Output
        ): TaskServiceEffect<void, Error.TaskNotFound | Error.TaskLogNotFound> => Effect.gen(function* ()
        {
            if (State.Has(Handle))
            {
                // @TODO Validate `Output`.
                if (true as boolean)
                {
                    const { _tag: _, ...Out  } = Output;
                    return yield* Effect.fail(new Error.TaskLogNotFound({
                        ...Out,
                        Owner: Handle
                        // @TODO
                        // SinkExists: false
                    }));
                }

                // InternalService.SetUnsafe(Handle, NewState);
            }
            else
            {
                return Effect.fail(new Error.TaskNotFound({ Key: State.GetKeyUnsafe(Handle) }));
            }
        }));

        const Exists = (Handle: Task.Handle): boolean =>
        {
            return MutableHashMap.has(State.Tasks, Handle);
        };

        const ExistsOrFail = (Handle: Task.Handle): TaskServiceEffect<true, Error.TaskNotFound> =>
        {
            return State.Has(Handle)
                ? Effect.succeed(true)
                : Effect.fail(new Error.TaskNotFound({ Key: State.GetKeyUnsafe(Handle) }));
        };

        const GetState = (Handle: Task.Handle): Option.Option<TaskState.TaskState> =>
        {
            return MutableHashMap.get(State.Tasks, Handle);
        };

        const GetStateOrFail = (
            Handle: Task.Handle
        ): TaskServiceEffect<TaskState.TaskState, Error.TaskNotFound> =>
        {
            const Out: Option.Option<TaskState.TaskState> = MutableHashMap.get(State.Tasks, Handle);
            if (Option.isSome(Out))
            {
                return Effect.succeed(Out.value);
            }
            else
            {
                return Effect.fail(new Error.TaskNotFound({ Key: Symbol.keyFor(Handle)! }));
            }
        };

        const GetStateUnsafe = (Handle: Task.Handle): TaskState.TaskState =>
        {
            return Option.getOrUndefined(MutableHashMap.get(State.Tasks, Handle))!;
        };

        const Make: TaskServiceImpl["Make"] = Internal.Fn("Make")(function* (Options: Task.Options)
        {
            const Step: (FunctionName: string) => Effect.fn.Traced = Internal.Step("Make");

            if (false as boolean)
            {
                return yield* Effect.fail(new Error.InvalidTaskOptions({ Options }));
            }

            return yield* pipe(
                Step("ValidateTaskOptions")(function* ()
                {

                })(),
                Effect.flatMap(Step("GetNewTaskHandle")(function* ()
                {
                    return yield* Effect.succeed(undefined as unknown as Task.Handle);
                }))
            );

            // // const Barr = Step<Internal.BaseCase<Task.Options>, void>("Barr")<
            // never, never>(function* (_Options: Task.Options)
            // // {
            // //     return yield* Effect.void;
            // // });

            // // const ValidateTaskOptions = Step<Internal.BaseCase<Task.Options>,
            // void>("ValidateTaskOptions")<Error.InvalidTaskOptions, never>(function* (Options: Task.Options)
            // // {
            // //     if (false as boolean)
            // //     {
            // //         return yield* Effect.fail(new Error.InvalidTaskOptions({ Options }));
            // //     }

            // //     return Effect.void;
            // // });

            // // type Foo = Internal.Accumulate<typeof ValidateTaskOptions, Task.Handle>;
            // // const GetNewTaskHandle = Step<Internal.Accumulate<typeof ValidateTaskOptions,
            // Task.Handle>, void>("GetNewTaskHandle")(function* (Options: Task.Options)
            // //     {
            // //         if (Options.Key !== undefined)
            // //         {
            // //             if (HashMap.has(State.Tasks, Options.Key))
            // //             {
            // //                 return yield* Effect.fail(
            // //                     new Error.TaskCollision({ Key: Symbol.keyFor(Options.Key!)! })
            // //                 );
            // //             }
            // //             else
            // //             {
            // //                 return [ Options, Options.Key! ];
            // //             }
            // //         }
            // //         else
            // //         {
            // //             return [ Options, Task.Handle() ] as const;
            // //         }
            // //     });

            // //     ([ Options, Handle ], TheExit: Exit.Exit<unknown, unknown>) => Effect.gen(function* ()
            // //     {

            // //     })
            // // );

            // /* eslint-disable-next-line @typescript-eslint/typedef */
            // const RegisterTaskHandle = Function.tupled((
            //     Options: Task.Options,
            //     Handle: Task.Handle
            // ): EffectWithTaskOptions<typeof GetNewTaskHandle> => Effect.acquireRelease(
            //     Effect.gen(function* ()
            //     {
            //         HashMap.set(State.Tasks, Handle);
            //         return [ Options, Handle ] as const;
            //     }),
            //     (
            //         [ _Options, Handle ]: readonly [ Task.Options, Task.Handle ],
            //         TheExit: Exit.Exit<unknown, unknown>
            //     ) => Effect.gen(function* ()
            //     {
            //         if (Exit.isFailure(TheExit))
            //         {
            //             HashMap.remove(State.Tasks, Handle);
            //             pipe(
            //                 State.GetGroupFromTask(Handle),
            //                 Option.match({
            //                     onNone: Function.constVoid,
            //                     onSome: ()
            //                 })
            //             );

            //             MultiMap.remove(State.Groups, State.GetGroupFromTask(Handle));
            //         }
            //     })
            // ));

            // const HandleTaskGroup = (
            //     Options: Task.Options,
            //     Handle: Task.Handle
            // ): Effect.Effect<WithTaskOptions<typeof GetNewTaskHandle, Group.Handle>> =>
            //     Effect.gen(function* ()
            //     {
            //         return [ Options, Handle, Group.Handle() ] as const;
            //     });

            // const HandleSubtasks = Effect.gen(function* ()
            // {

            // });

            // const MakeInitialState = Effect.gen(function* ()
            // {

            // });

            // // yield* pipe(
            // //     ValidateTaskOptions,
            // //     HandleTaskHandle,
            // //     HandleTaskGroup,
            // //     HandleSubtasks,
            // //     MakeInitialState
            // // );

            // const Out: TaskState.TaskState =
            //     {
            //         _tag: "TaskState",

            //         Body: Options.InitialBody,
            //         Label: Options.Label ??
            //             Math.floor(Math.random() * 10).toString() +
            //             Math.floor(Math.random() * 10).toString() +
            //             Math.floor(Math.random() * 10).toString() +
            //             Math.floor(Math.random() * 10).toString(),
            //         Status: Options.InitialStatus ?? Task.Status.Disabled,
            //         Suffixes: Options.Suffixes ?? Task.Suffixes
            //     };

            // if (false as boolean)
            // {
            //     return Effect.fail(new Error.InvalidTaskOptions({ Options }));
            // }

            // if (Options.Key !== undefined && HashMap.has(State.Tasks, Options.Key))
            // {
            //     return Effect.fail(new Error.TaskCollision({ Key: Symbol.keyFor(Options.Key)! }));
            // }
            // else if (Options.Key !== undefined)
            // {
            //     HashMap.set(State.Tasks, Options.Key, Out);

            //     if (Options.Group !== undefined)
            //     {
            //         const Group: Option.Option<HashSet.HashSet<Group.MemberHandle>> =
            //             MultiMap.get(State.Groups, Options.Group);

            //         if (Option.isNone(Group))
            //         {
            //             return Effect.fail(new Error.GroupNotFound({
            // Key: Utility.ArgumentHandleKey(Options.Group) }));
            //         }
            //         else
            //         {
            //             MultiMap.add(State.Groups, Options.Group, Out);
            //         }
            //     }

            //     const GroupHandle: Group.Handle = Options.Group ?? State.CurrentGroupHandle;
            //     MultiMap.add(State.Groups, GroupHandle, Options.Key);

            //     if (Options.Parent !== undefined)
            //     {
            //         MultiMap.add(State.SubTasks, Options.Parent, Options.Key);
            //     }

            //     return Effect.succeed(Options.Key);
            // }
            // else
            // {
            //     const Handle: Task.Handle = Task.Handle();
            //     HashMap.set(State.Tasks, Handle, Out);

            //     const GroupHandle: Group.Handle = Options.Group ?? Group.Anonymous;
            //     MultiMap.add(State.Groups, GroupHandle, Handle);

            //     if (Options.Parent !== undefined)
            //     {
            //         MultiMap.add(State.SubTasks, Options.Parent, Handle);
            //     }

            //     return Effect.succeed(Handle);
            // }
        });

        const MakeSafe = (Options: Task.Options): TaskServiceEffect<Task.Handle, Error.InvalidTaskOptions> =>
        {
            const Out: TaskState.TaskState =
                {
                    _tag: "TaskState",

                    Body: Options.InitialBody,
                    Label: Options.Label ??
                        Math.floor(Math.random() * 10).toString() +
                        Math.floor(Math.random() * 10).toString() +
                        Math.floor(Math.random() * 10).toString() +
                        Math.floor(Math.random() * 10).toString(),
                    Status: Options.InitialStatus ?? Task.Status.Disabled,
                    Suffixes: Options.Suffixes ?? Task.Suffixes
                };

            if (false as boolean)
            {
                return Effect.fail(new Error.InvalidTaskOptions({ Options }));
            }

            if (Options.Key !== undefined && MutableHashMap.has(State.Tasks, Options.Key))
            {
                return Effect.succeed(Options.Key);
            }
            else if (Options.Key !== undefined)
            {
                MutableHashMap.set(State.Tasks, Options.Key, Out);

                return Effect.succeed(Options.Key);
            }
            else
            {
                const Handle: Task.Handle = Task.Handle();
                MutableHashMap.set(State.Tasks, Handle, Out);

                return Effect.succeed(Handle);
            }
        };

        const MakeGroup = (Options: Group.Options): TaskServiceEffect<Group.Handle, Error.GroupCollision> =>
        {
            if (Options.Key !== undefined)
            {
                if (Array.from(MutableMultiMap.Keys(State.Groups)).includes(Options.Key))
                {
                    return Effect.fail(new Error.GroupCollision({ Key: Symbol.keyFor(Options.Key)! }));
                }
                else
                {
                    MutableMultiMap.Set(State.Groups, Options.Key, Option.none());
                    return Effect.succeed(Options.Key!);
                }
            }
            else
            {
                const Handle: Group.Handle = Group.Handle();
                MutableMultiMap.Set(State.Groups, Handle, Option.none());
                return Effect.succeed(Handle);
            }
        };

        const MakeGroupSafe = (Options: Group.Options): TaskServiceEffect<Group.Handle> =>
        {
            if (Options.Key !== undefined)
            {
                if (Array.from(MutableMultiMap.Keys(State.Groups)).includes(Options.Key))
                {
                    return Effect.succeed(Options.Key);
                }
                else
                {
                    MutableMultiMap.Set(State.Groups, Options.Key, Option.none());
                    return Effect.succeed(Options.Key!);
                }
            }
            else
            {
                const Handle: Group.Handle = Group.Handle();
                MutableMultiMap.Set(State.Groups, Handle, Option.none());
                return Effect.succeed(Handle);
            }
        };

        const PatchState: PatchState = dual(2, (
            Handle: Task.Handle,
            StatePatch: Partial<TaskState.TaskState>
        ): TaskServiceEffect<void, Error.InvalidTaskStatePatch> =>
            Effect.gen(function* ()
            {
                if (State.Has(Handle))
                {
                    const Current: TaskState.TaskState = State.GetUnsafe(Handle);

                    // @TODO Validate `StatePatch`.
                    if (false as boolean)
                    {
                        return yield* Effect.fail(new Error.InvalidTaskStatePatch({
                            CurrentState: State.GetViewUnsafe(Handle),
                            Patch: StatePatch
                        }));
                    }

                    State.SetUnsafe(Handle, { ...Current, ...StatePatch });
                }
                else
                {
                    return Effect.fail(new Error.TaskNotFound({ Key: State.GetKeyUnsafe(Handle) }));
                }
            }));

        const Remove: TaskServiceImpl["Remove"] = Internal.Fn("Remove")(function* (Handle: Task.Handle)
        {
            // 1. Remove handle/state entry
            MutableHashMap.remove(State.Tasks, Handle);

            // 2. Remove handle from group
            pipe(
                Handle,
                State.GetGroupHandle,
                Option.map((GroupHandle: Group.Handle) =>
                    MutableMultiMap.remove(State.Groups, GroupHandle, Handle))
            );

            return Effect.void;
        });

        const RemoveSafe: TaskServiceImpl["RemoveSafe"] =
            Internal.Fn("RemoveSafe")(function* (Handle: Task.Handle)
            {
                yield* Effect.option(Remove(Handle));
            });

        const SetState: SetState = dual(2, (
            Handle: Task.Handle,
            NewState: TaskState.TaskState
        ): TaskServiceEffect<void, Error.InvalidNewTaskState> =>
            Effect.gen(function* ()
            {
                if (State.Has(Handle))
                {
                // @TODO Validate `NewState`.
                    if (true as boolean)
                    {
                        return yield* Effect.fail(new Error.InvalidNewTaskState({
                            CurrentState: State.GetViewUnsafe(Handle),
                            NewState
                        }));
                    }

                    State.SetUnsafe(Handle, NewState);
                }
                else
                {
                    return Effect.fail(new Error.TaskNotFound({ Key: State.GetKeyUnsafe(Handle) }));
                }
            }));

        const SetTaskStatus: SetTaskStatus = dual(2, (
            Handle: Task.Handle,
            NewStatus: Task.Status
        ): TaskServiceEffect<void, Error.InvalidTaskStatePatch> =>
            Effect.gen(function* ()
            {
                if (State.Has(Handle))
                {
                // @TODO Validate `NewStatus`.
                    if (true as boolean)
                    {
                        return yield* Effect.fail(new Error.InvalidTaskStatePatch({
                            CurrentState: State.GetViewUnsafe(Handle),
                            Patch: { Status: NewStatus }
                        }));
                    }

                    const NewState: TaskState.TaskState =
                        {
                            ...State.GetUnsafe(Handle),
                            Status: NewStatus
                        };

                    State.SetUnsafe(Handle, NewState);
                }
                else
                {
                    return Effect.fail(new Error.TaskNotFound({ Key: State.GetKeyUnsafe(Handle) }));
                }
            }));

        return {
            Emit,
            Exists,
            ExistsOrFail,
            GetState,
            GetStateOrFail,
            GetStateUnsafe,
            Make,
            MakeGroup,
            MakeGroupSafe,
            MakeSafe,
            PatchState,
            Remove,
            RemoveSafe,
            SetState,
            SetTaskStatus
        };
    }));
}

export const TaskService: typeof TaskContext  = TaskContext;
export type TaskService = typeof TaskContext["Service"];

/**
 * The requirements of {@link TaskServiceEffect | TaskServiceEffects} and
 * other {@link Effect!Effect | effects} that run in the {@link TaskContext:var}.
 */
export type Environment = TaskService;

export type TaskServiceEffect<A, E = never, R = never> = Effect.Effect<A, E, Exclude<R, TaskContext>>;
export type WithTaskServiceEffect<A, E = never, R = never> = Effect.Effect<A, E, R | TaskContext>;

/** {@inheritDoc SetState:type} */
export const SetState: SetState = dual(2, Effect.fn("TaskService!SetState")(function* (
    Handle: Task.Handle,
    NewState: TaskState.TaskState
)
{
    const Service: TaskService = yield* TaskService;
    return yield* Service.SetState(Handle, NewState);
}));

/** {@inheritDoc SetTaskStatus:type} */
export const SetTaskStatus: SetTaskStatus =
    dual(2, Effect.fn("TaskService!SetTaskStatus")(function* (Handle: Task.Handle, NewStatus: Task.Status)
    {
        return Effect.gen(function* ()
        {
            const Service: TaskContext["Service"] = yield* TaskContext;

            if (true as boolean)
            {
                return yield* Effect.fail(undefined as unknown as Error.InvalidTaskStatePatch);
            }

            yield* Service.SetTaskStatus(Handle, NewStatus);
        });
    }));

/** {@inheritDoc PatchState:type} */
export const PatchState: PatchState = dual(2, (
    Handle: Task.Handle,
    NewState: TaskState.TaskState
): WithTaskServiceEffect<void, Error.InvalidNewTaskState, Environment> =>
{
    return Effect.gen(function*()
    {
        const Service: TaskService = yield* TaskService;
        return Service.PatchState(Handle, NewState);
    });
});

/**
 * Create a task with the specified {@link Options}.
 *
 * @remarks
 * If a {@link Options!Key} is specified, and if a task having this key already exists, then this
 * will fail with a {@link TaskCollision} error.
 *
 * @see {@link MakeSafe} To create a task such that if a key is specified in its {@link Options},
 * and a task having this key already exists, then a new task will *not* be created.
 *
 *
 * @param Options - The {@link Options} with which the task will be created.
 *
 * @returns {Effect.Effect<Handle, TaskCreationError, TaskService>} An {@link Effect!Effect | effect}
 * that creates a task with the given {@link Options}.
 */
export const Make = (
    Options: Task.Options
): WithTaskServiceEffect<Task.Handle, Error.TaskCreationError> => Effect.gen(function* ()
{
    const Service: TaskService = yield* TaskService;
    return yield* Service.Make(Options);
});

export const MakeSafe = (
    Options: Task.Options
): WithTaskServiceEffect<Task.Handle, Error.TaskCreationError> => Effect.gen(function* ()
{
    const Service: TaskService = yield* TaskService;
    return yield* Service.MakeSafe(Options);
});
