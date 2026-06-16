/**
 * @file      TaskService.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Error from "./TaskError.js";
import * as Group from "./Group.js";
import * as Log from "./Log.js";
import * as Output from "./Output.js";
import * as Task from "./Task.js";
import * as TaskState from "./TaskState.js";
import { Context, Effect, Exit, Function, HashMap, HashSet, Layer, Option, type Scope } from "effect";
import { dual, pipe, type FunctionN } from "effect/Function";
import { MultiMap } from "@sorrell/multimap";
import { Utility } from "./Internal/index.ts";

const TypeIdKey: string = "@sorrell/effect-ink/Task/TaskService";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);

export type TypeId = typeof TypeId;

// #region Implementation

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
         * @returns {TaskServiceEffect<void, InvalidNewTaskState.TaskState>} An {@link Effect!Effect | effect} that
         * sets the state of the given task to the given {@link NewState}.
         */
        (Handle: Task.Handle, NewState: TaskState.TaskState): TaskServiceEffect<void, Error.InvalidNewTaskState>;

        /**
         * Set the state of a given task by specifying the task to update, then calling the function
         * returned by this with the new state.
         *
         * @param Handle - The {@link Handle} of the task whose state will be updated by the
         * function returned by this.
         *
         * @returns {(NewState: TaskState.TaskState) => TaskServiceEffect<void, InvalidNewTaskState.TaskState>} An
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
             * @returns {TaskServiceEffect<void, InvalidNewTaskState.TaskState>} An {@link Effect!Effect | effect} that
             * sets the state of the given task with the given {@link NewState}.
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
         * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An {@link Effect!Effect | effect} that
         * updates the state of the given task to the given {@link StatePatch}.
         */
        (Handle: Task.Handle, StatePatch: Partial<TaskState.TaskState>): TaskServiceEffect<void, Error.InvalidTaskStatePatch>;

        /**
         * Update the state of a given task by specifying the task to patch, then calling the function
         * returned by this with an object containing the properties with which the given task's state
         * will be updated.
         *
         * @param Handle - The {@link Handle} of the task whose state will be updated by the
         * function returned by this.
         *
         * @returns {(StatePatch: Partial<TaskState.TaskState>) => TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An
         * {@link Effect!Effect | effect} that updates the state of the given task with the
         * given {@link StatePatch}.
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
             * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An {@link Effect!Effect | effect} that
             * updates the state of the given task with the given {@link StatePatch | patch}.
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
         * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An {@link Effect!Effect | effect} that
         * updates the status of the given task to the given {@link NewStatus | status}.
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
             * @returns {TaskServiceEffect<void, Error.InvalidTaskStatePatch>} An {@link Effect!Effect | effect} that
             * updates the status of the given task to the given {@link NewStatus | status}.
             */
            (NewStatus: Task.Status): TaskServiceEffect<void, Error.InvalidTaskStatePatch>;
        };
    };

// #endregion

// #region Service

export class TaskContext
    extends Context.Service<TaskContext, {
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
        readonly GetStateOrFail: (Handle: Task.Handle) => TaskServiceEffect<TaskState.TaskState, Error.TaskNotFound>;

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

        /** {@inheritDoc Emit:type} */
        readonly Emit: Emit;

        readonly Make:
        {
            (Options: Task.Options): TaskServiceEffect<Task.Handle, Error.TaskCreationError>;
        };

        readonly MakeSafe:
        {
            (Options: Task.Options): TaskServiceEffect<Task.Handle, Exclude<Error.TaskCreationError, Error.TaskCollision>>;
        };

        readonly MakeGroup:
        {
            (Options: Group.Options): TaskServiceEffect<Group.Handle, Error.GroupCollision>;
        };

        readonly MakeGroupSafe:
        {
            (Options: Group.Options): TaskServiceEffect<Group.Handle>;
        };
    }>()(TypeIdKey)
{
    public static readonly Layer = Layer.effect(TaskContext, Effect.gen(function* ()
    {
        const Tasks: HashMap.HashMap<Task.Handle, TaskState.TaskState> = HashMap.empty<Task.Handle, TaskState.TaskState>();
        const SubTasks: MultiMap.MultiMap<Task.Handle, Task.Handle> = MultiMap.make<Task.Handle, Task.Handle>();

        /** A mapping of `symbol` keys of {@link Groups:var} to {@link Log.Log | Logs}. */
        const Logs: HashMap.HashMap<Log.Handle, Log.Log> =
            HashMap.empty<Log.Handle, Log.Log>();

        /**
         * A mapping of group handles to the handles of the tasks, logs, and outputs owned
         * by the respective groups.
         */
        const Groups: Group.Groups = Group.Empty();

        const DefaultGroupSettings: Group.Settings = Group.Settings({
            OutputDisplay: Output.Display.Hidden(),
            OutputStyle: Output.Style.Pooled()
        });

        const GroupSettings: HashMap.HashMap<Group.Handle, Group.Settings> =
            HashMap.make([
                Group.Anonymous,
                DefaultGroupSettings
            ]);

        const GetViewUnsafe = (Handle: Task.Handle): TaskState.TaskStateView =>
        {
            const State: TaskState.TaskState = Option.getOrUndefined(HashMap.get(Tasks, Handle))!;
            return TaskState.TaskStateView(Handle, State);
        };

        const GetUnsafe = (Handle: Task.Handle): TaskState.TaskState => Option.getOrUndefined(HashMap.get(Tasks, Handle))!;

        const Has = (Handle: Task.Handle): boolean => HashMap.has(Tasks, Handle);

        const GetKeyUnsafe = (Handle: Task.Handle): string => Symbol.keyFor(Handle)!;

        const SetUnsafe = (Handle: Task.Handle, State: TaskState.TaskState): void =>
        {
            pipe(Tasks, HashMap.set(Handle, State));
        };

        const GetGroupFromTask = (Handle: Task.Handle): Option.Option<Group.MemberSet> =>
        {
            const Entry: Option.Option<readonly [ Group.Handle, Group.MemberHandle ]> = MultiMap.findFirst(
                Groups,
                (Value: Group.MemberHandle, _Key: Group.Handle) =>
                {
                    return Handle === Value;
                }
            );

            if (Option.isSome(Entry))
            {
                return MultiMap.get(Groups, Entry.value[0]);
            }
            else
            {
                return Option.none();
            }
        };

        const CurrentGroupHandle: Group.Handle = Group.Anonymous;

        const GetCurrentGroupHandle = (): Group.Handle => CurrentGroupHandle;

        function GetGroupHandle(Handle: Task.Handle): Option.Option<Group.Handle>;
        function GetGroupHandle(Handle: Log.Handle): Option.Option<Group.Handle>;
        function GetGroupHandle(Handle: Task.Handle | Log.Handle): Option.Option<Group.Handle>
        {
            const Entry: Option.Option<readonly [ Group.Handle, Group.MemberHandle ]> = MultiMap.findFirst(
                Groups,
                (Value: Group.MemberHandle, _Key: Group.Handle) =>
                {
                    return Handle === Value;
                }
            );

            return Option.match(Entry, {
                onNone: () => Option.none(),
                onSome: ([ GroupHandle ]: readonly [ Group.Handle, Group.MemberHandle ]) => Option.some(GroupHandle)
            });
        };

        function GetGroupHandleUnsafe(TaskHandle: Task.Handle): Group.Handle;
        function GetGroupHandleUnsafe(LogHandle: Log.Handle): Group.Handle;
        function GetGroupHandleUnsafe(TheHandle: Task.Handle | Log.Handle): Group.Handle
        {
            return Option.getOrUndefined(GetGroupHandle(TheHandle as Task.Handle))!;
        }

        const GetLogHandle = (Handle: Task.Handle): Option.Option<Log.Handle> =>
        {
            const Group: Option.Option<HashSet.HashSet<Group.MemberHandle>> = GetGroupFromTask(Handle);
            if (Option.isSome(Group))
            {
                const Matches: HashSet.HashSet<Group.MemberHandle> = HashSet.filter(
                    Group.value,
                    Log.IsLogHandle
                );

                if (HashSet.size(Matches) > 0)
                {
                    return Option.some(Array.from(Matches)[0] as Log.Handle);
                }
                else
                {
                    return Option.none();
                }
            }
            else
            {
                return Option.none();
            }
        };

        const GetLogHandleFromGroupHandle =
            (Handle: Group.Handle): Option.Option<Log.Handle> =>
            {
                const Handles: Group.MemberSet =
                    Option.getOrUndefined(MultiMap.get(Groups, Handle))!;

                const Matches: HashSet.HashSet<Group.MemberHandle> = HashSet.filter(
                    Handles,
                    Log.IsLogHandle
                );

                if (HashSet.size(Matches) > 0)
                {
                    return Option.some(Array.from(Matches)[0] as Log.Handle);
                }
                else
                {
                    return Option.none();
                }
            };

        const GetLogFromTaskHandleUnsafe = (Handle: Task.Handle): Log.Log =>
        {
            const LogHandle: Log.Handle = Option.getOrUndefined(GetLogHandle(Handle))!;
            return Option.getOrUndefined(HashMap.get(Logs, LogHandle))!;
        };

        const GetLogFromTaskHandle = (Handle: Task.Handle): Option.Option<Log.Log> =>
        {
            const LogHandle: Log.Handle = Option.getOrUndefined(GetLogHandle(Handle))!;
            return HashMap.get(Logs, LogHandle);
        };

        const GetLogFromGroupHandleUnsafe = (GroupHandle: Group.Handle): Log.Log =>
        {
            return Option.getOrUndefined(HashMap.get(Logs, Array.from(
                HashSet.filter(
                    (Option.getOrUndefined(MultiMap.get(Groups, GroupHandle))!),
                    (Value: Group.MemberHandle): boolean =>
                    {
                        return Log.IsLogHandle(Value);
                    }))[0]! as Log.Handle))!;
        };

        const RemoveTaskFromGroup = (TaskHandle: Task.Handle) =>
        {
            // const GroupHandle = GetGroupHandle
        };

        return {
            // [ TypeId ]: TypeId,

            Emit: dual(2, (
                Handle: Task.Handle,
                Output: Output.Output
            ): TaskServiceEffect<void, Error.TaskNotFound | Error.TaskLogNotFound> => Effect.gen(function* ()
            {
                if (Has(Handle))
                {
                    // @TODO Validate `Output`.
                    if (true as boolean)
                    {
                        const { _tag: _, ...Out  } = Output;
                        return yield* Effect.fail(new Error.TaskLogNotFound({
                            ...Out,
                            Owner: Handle,
                            // @TODO
                            // SinkExists: false
                        }));
                    }

                    // InternalService.SetUnsafe(Handle, NewState);
                }
                else
                {
                    return Effect.fail(new Error.TaskNotFound({ Key: GetKeyUnsafe(Handle) }));
                }
            })),
            Exists: (Handle: Task.Handle): boolean =>
            {
                return HashMap.has(Tasks, Handle);
            },
            ExistsOrFail: (Handle: Task.Handle): TaskServiceEffect<true, Error.TaskNotFound> =>
            {
                return Has(Handle)
                    ? Effect.succeed(true)
                    : Effect.fail(new Error.TaskNotFound({ Key: GetKeyUnsafe(Handle) }));
            },
            GetState: (Handle: Task.Handle): Option.Option<TaskState.TaskState> =>
            {
                return HashMap.get(Tasks, Handle);
            },
            GetStateOrFail: (Handle: Task.Handle): TaskServiceEffect<TaskState.TaskState, Error.TaskNotFound> =>
            {
                const Out: Option.Option<TaskState.TaskState> = HashMap.get(Tasks, Handle);
                if (Option.isSome(Out))
                {
                    return Effect.succeed(Out.value);
                }
                else
                {
                    return Effect.fail(new Error.TaskNotFound({ Key: Symbol.keyFor(Handle)! }));
                }
            },
            GetStateUnsafe: (Handle: Task.Handle): TaskState.TaskState =>
            {
                return HashMap.getUnsafe(Tasks, Handle);
            },
            Make: (Options: Task.Options): TaskServiceEffect<Task.Handle, Error.TaskCreationError> =>
            {
                const ValidateTaskOptions = Effect.gen(function* ()
                {

                });

                type WithTaskOptions<
                    PreviousEffectType extends FunctionN<any, Effect.Effect<any, any, any>>,
                    ArgumentsType
                > =
                    [ PreviousEffectType ] extends [ never ]
                        ? ArgumentsType extends ReadonlyArray<unknown>
                            ? readonly [ Task.Options, ...ArgumentsType ]
                            : readonly [ Task.Options, ArgumentsType ]
                        : ReturnType<PreviousEffectType> extends
                        Effect.Effect<infer A extends ReadonlyArray<unknown>, any, any>
                            ? ArgumentsType extends ReadonlyArray<unknown>
                                ? readonly [ ...A, ...ArgumentsType ]
                                : readonly [ ...A, ArgumentsType ]
                            : ArgumentsType extends ReadonlyArray<unknown>
                                ? readonly [ Task.Options, ...ArgumentsType ]
                                : readonly [ Task.Options, ArgumentsType ];

                type EffectWithTaskOptions<
                    PreviousEffectType extends FunctionN<any, Effect.Effect<any, any, any>>,
                    ArgumentsType = readonly [ ],
                    E = never
                > = Effect.Effect<WithTaskOptions<PreviousEffectType, ArgumentsType>, E, Scope.Scope>;

                const GetNewTaskHandle = (
                    Options: Task.Options
                ): EffectWithTaskOptions<never, Task.Handle, Error.TaskCollision> =>
                    Effect.gen(function* ()
                    {
                        if (Options.Key !== undefined)
                        {
                            if (HashMap.has(Tasks, Options.Key))
                            {
                                return yield* Effect.fail(
                                    new Error.TaskCollision({ Key: Symbol.keyFor(Options.Key!)! })
                                );
                            }
                            else
                            {
                                return [ Options, Options.Key! ];
                            }
                        }
                        else
                        {
                            return [ Options, Task.Handle() ] as const;
                        }
                    });

                //     ([ Options, Handle ], TheExit: Exit.Exit<unknown, unknown>) => Effect.gen(function* ()
                //     {

                //     })
                // );

                /* eslint-disable-next-line @typescript-eslint/typedef */
                const RegisterTaskHandle = Function.tupled((
                    Options: Task.Options,
                    Handle: Task.Handle
                ): EffectWithTaskOptions<typeof GetNewTaskHandle> => Effect.acquireRelease(
                    Effect.gen(function* ()
                    {
                        HashMap.set(Tasks, Handle);
                        return [ Options, Handle ] as const;
                    }),
                    (
                        [ _Options, Handle ]: readonly [ Task.Options, Task.Handle ],
                        TheExit: Exit.Exit<unknown, unknown>
                    ) => Effect.gen(function* ()
                    {
                        if (Exit.isFailure(TheExit))
                        {
                            HashMap.remove(Tasks, Handle);
                            pipe(
                                GetGroupFromTask(Handle),
                                Option.match({
                                    onNone: Function.constVoid,
                                    onSome: ()
                                })
                            );

                            MultiMap.remove(Groups, GetGroupFromTask(Handle));
                        }
                    })
                ));

                const HandleTaskGroup = (
                    Options: Task.Options,
                    Handle: Task.Handle
                ): Effect.Effect<WithTaskOptions<typeof GetNewTaskHandle, Group.Handle>> =>
                    Effect.gen(function* ()
                    {
                        return [ Options, Handle, Group.Handle() ] as const;
                    });

                const HandleSubtasks = Effect.gen(function* ()
                {

                });

                const MakeInitialState = Effect.gen(function* ()
                {

                });

                // yield* pipe(
                //     ValidateTaskOptions,
                //     HandleTaskHandle,
                //     HandleTaskGroup,
                //     HandleSubtasks,
                //     MakeInitialState
                // );

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

                if (Options.Key !== undefined && HashMap.has(Tasks, Options.Key))
                {
                    return Effect.fail(new Error.TaskCollision({ Key: Symbol.keyFor(Options.Key)! }));
                }
                else if (Options.Key !== undefined)
                {
                    HashMap.set(Tasks, Options.Key, Out);

                    if (Options.Group !== undefined)
                    {
                        const Group: Option.Option<HashSet.HashSet<Group.MemberHandle>> = MultiMap.get(Groups, Options.Group);
                        if (Option.isNone(Group))
                        {
                            return Effect.fail(new Error.GroupNotFound({ Key: Utility.ArgumentHandleKey(Options.Group) }));
                        }
                        else
                        {
                            MultiMap.add(Groups, Options.Group, Out);
                        }
                    }

                    const GroupHandle: Group.Handle = Options.Group ?? CurrentGroupHandle;
                    MultiMap.add(Groups, GroupHandle, Options.Key);

                    if (Options.Parent !== undefined)
                    {
                        MultiMap.add(SubTasks, Options.Parent, Options.Key);
                    }

                    return Effect.succeed(Options.Key);
                }
                else
                {
                    const Handle: Task.Handle = Task.Handle();
                    HashMap.set(Tasks, Handle, Out);

                    const GroupHandle: Group.Handle = Options.Group ?? Group.Anonymous;
                    MultiMap.add(Groups, GroupHandle, Handle);

                    if (Options.Parent !== undefined)
                    {
                        MultiMap.add(SubTasks, Options.Parent, Handle);
                    }

                    return Effect.succeed(Handle);
                }
            },
            MakeSafe: (Options: Task.Options): TaskServiceEffect<Task.Handle, Error.InvalidTaskOptions> =>
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

                if (Options.Key !== undefined && HashMap.has(Tasks, Options.Key))
                {
                    return Effect.succeed(Options.Key);
                }
                else if (Options.Key !== undefined)
                {
                    HashMap.set(Tasks, Options.Key, Out);

                    return Effect.succeed(Options.Key);
                }
                else
                {
                    const Handle: Task.Handle = Task.Handle();
                    HashMap.set(Tasks, Handle, Out);

                    return Effect.succeed(Handle);
                }
            },
            MakeGroup: (Options: Group.Options): TaskServiceEffect<Group.Handle, Error.GroupCollision> =>
            {
                if (Options.Key !== undefined)
                {
                    if (Array.from(MultiMap.keys(Groups)).includes(Options.Key))
                    {
                        return Effect.fail(new Error.GroupCollision({ Key: Symbol.keyFor(Options.Key)! }));
                    }
                    else
                    {
                        MultiMap.set(Groups, Options.Key, Option.none());
                        return Effect.succeed(Options.Key!);
                    }
                }
                else
                {
                    const Handle: Group.Handle = Group.Handle();
                    MultiMap.set(Groups, Handle, Option.none());
                    return Effect.succeed(Handle);
                }
            },
            MakeGroupSafe: (Options: Group.Options): TaskServiceEffect<Group.Handle> =>
            {
                if (Options.Key !== undefined)
                {
                    if (Array.from(MultiMap.keys(Groups)).includes(Options.Key))
                    {
                        return Effect.succeed(Options.Key);
                    }
                    else
                    {
                        MultiMap.set(Groups, Options.Key, Option.none());
                        return Effect.succeed(Options.Key!);
                    }
                }
                else
                {
                    const Handle: Group.Handle = Group.Handle();
                    MultiMap.set(Groups, Handle, Option.none());
                    return Effect.succeed(Handle);
                }
            },
            PatchState: dual(2, (
                Handle: Task.Handle,
                StatePatch: Partial<TaskState.TaskState>
            ): TaskServiceEffect<void, Error.InvalidTaskStatePatch> =>
                Effect.gen(function* ()
                {
                    if (Has(Handle))
                    {
                        const Current: TaskState.TaskState = GetUnsafe(Handle);

                        // @TODO Validate `StatePatch`.
                        if (false as boolean)
                        {
                            return yield* Effect.fail(new Error.InvalidTaskStatePatch({
                                CurrentState: GetViewUnsafe(Handle),
                                Patch: StatePatch
                            }));
                        }

                        SetUnsafe(Handle, { ...Current, ...StatePatch });
                    }
                    else
                    {
                        return Effect.fail(new Error.TaskNotFound({ Key: GetKeyUnsafe(Handle) }));
                    }
                })),
            SetState: dual(2, (Handle: Task.Handle, NewState: TaskState.TaskState): TaskServiceEffect<void, Error.InvalidNewTaskState> =>
                Effect.gen(function* ()
                {
                    if (Has(Handle))
                    {
                    // @TODO Validate `NewState`.
                        if (true as boolean)
                        {
                            return yield* Effect.fail(new Error.InvalidNewTaskState({
                                CurrentState: GetViewUnsafe(Handle),
                                NewState
                            }));
                        }

                        SetUnsafe(Handle, NewState);
                    }
                    else
                    {
                        return Effect.fail(new Error.TaskNotFound({ Key: GetKeyUnsafe(Handle) }));
                    }
                })),
            SetTaskStatus: dual(2, (
                Handle: Task.Handle,
                NewStatus: Task.Status
            ): TaskServiceEffect<void, Error.InvalidTaskStatePatch> =>
                Effect.gen(function* ()
                {
                    if (Has(Handle))
                    {
                    // @TODO Validate `NewStatus`.
                        if (true as boolean)
                        {
                            return yield* Effect.fail(new Error.InvalidTaskStatePatch({
                                CurrentState: GetViewUnsafe(Handle),
                                Patch: { Status: NewStatus }
                            }));
                        }

                        const NewState: TaskState.TaskState =
                            {
                                ...GetUnsafe(Handle),
                                Status: NewStatus
                            };

                        SetUnsafe(Handle, NewState);
                    }
                    else
                    {
                        return Effect.fail(new Error.TaskNotFound({ Key: GetKeyUnsafe(Handle) }));
                    }
                }))
        };
    }));
}

export const TaskService = TaskContext;
export type TaskService = typeof TaskContext["Service"];

/**
 * The requirements of {@link TaskServiceEffect | TaskServiceEffects} and other {@link Effect!Effect | effects}
 * that run in the {@link TaskContext:var}.
 */
export type Environment = TaskService;

export type TaskServiceEffect<A, E = never, R = never> = Effect.Effect<A, E, Exclude<R, TaskContext>>;
export type WithTaskServiceEffect<A, E = never, R = never> = Effect.Effect<A, E, R | TaskContext>;

// #endregion

// #region Convenience Functions

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
        const Service = yield* TaskService;
        return Service.PatchState(Handle, NewState);
    });
});

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
         * @returns {WithTaskServiceEffect<void, TaskNotFound | TaskLogNotFound>} An {@link Effect!Effect | effect}
         * that emits the given {@link Output} from the task given by the function that returned this.
         */
        (Handle: Task.Handle, Output: Output.Output): WithTaskServiceEffect<void, Error.TaskNotFound | Error.TaskLogNotFound>;

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
             * @returns {WithTaskServiceEffect<void, TaskNotFound | TaskLogNotFound>} An {@link Effect!Effect | effect}
             * that emits the given {@link Output} from the task given by the function that returned this.
             */
            (Output: Output.Output): WithTaskServiceEffect<void, Error.TaskNotFound | Error.TaskLogNotFound>;
        };
    };

// #endregion

// #region Default Layer

// #endregion
