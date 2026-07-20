/**
 * The internal module that corresponds to {@link \@sorrell/effect-ink/Task/TaskService}.
 *
 * @module @sorrell/effect-ink/Internal/TaskService
 * @internal
 */

/**
 * @file      TaskService.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, HashMap, HashSet, Iterable, MutableHashMap, Option, Tuple, flow, pipe } from "effect";
import { Group, Log, Output, type Task, TaskState } from "../index.ts";
import { MutableMultiMap } from "@sorrell/multimap";
import { Utility } from "./index.ts";

export const Fn = (FunctionName: string) =>
{
    const TaskServiceMethodTag: string = `TaskService.${ FunctionName }`;
    return Effect.fn(TaskServiceMethodTag);
};

export const Step = (ParentFunctionName: string) =>
{
    return (FunctionName: string) => Fn(`${ ParentFunctionName }.${ FunctionName }`);
};
// export const Step = (ParentFunctionName: string) =>
// {
//     return <ThatType extends Effect.Effect<ReadonlyArray<unknown>, any, any>, A>(
//         FunctionName: string
//     ) =>
//     {
//         type OutA =
//             A extends void
//                 ? readonly [ ]
//                 : A extends ReadonlyArray<unknown>
//                     ? A
//                     : readonly [ A ];
//         type OtherA = A extends void ? void : A extends ReadonlyArray<unknown> ? A : readonly [ A ];

//         return function<E, R>(
//             GeneratorFn: (...ArgumentVector: Effect.Success<ThatType>) =>
//             Generator<Effect.Effect<OutA, E, R>, Effect.Effect<OtherA, E, R>, Effect.Success<ThatType>>
//         )
//         {
//             function* Out(
//                 ...ArgumentVector: Effect.Success<ThatType>
//             )
//             // ): Generator<
//             //     Effect.Effect<OutA, E, R>,
//             //     | Effect.Effect<readonly [...Effect.Success<ThatType>, ...OutA ], never, never>
//             //     | Effect.Effect<Effect.Success<ThatType>, never, never>,
//             //     never
//             // >
//             {
//                 const Oot: OtherA = (yield* (yield* GeneratorFn(...ArgumentVector)));
//                 if (Array.isArray(Oot))
//                 {
//                     return Effect.succeed([ ...ArgumentVector, ...(Oot as OutA) ] as const);
//                 }
//                 else
//                 {
//                     return Effect.succeed(ArgumentVector);
//                 }
//             };

//             return Function.tupled(
//                 Fn(`${ ParentFunctionName }.${ FunctionName }`)(Out)
//             );
//         };
//     };
// };

// export type BaseCase<ThatType = readonly [ ], E = never, R = never> =
//     ThatType extends ReadonlyArray<unknown>
//         ? Effect.Effect<ThatType, E, R>
//         : Effect.Effect<readonly [ ThatType ], E, R>;

// export type Accumulate<
//     ThatType extends
//         | ((...Args: any) => any)
//         | Effect.Effect<ReadonlyArray<unknown>, any, any>,
//     ThisType,
//     E = never,
//     R = never
// > =
//     Effect.Effect<
//         readonly [
//             ...(ThatType extends Effect.Effect<any, any, any>
// ? Effect.Success<ThatType> : ThatType extends (...Args: any) => any
// ? ReturnType<ThatType> extends Effect.Effect<infer A extends ReadonlyArray<unknown>, any, any>
// ? A : never : never),
//             ...(ThisType extends ReadonlyArray<unknown> ? ThisType : ThisType extends void
// ? readonly [ ] : readonly [ ThisType ])
//         ],
//         E,
//         R
//     >;

export const DefaultGroupSettings: Group.Settings = Group.Settings({
    OutputDisplay: Output.Display.Hidden()
    // OutputStyle: Output.Style.Pooled()
});

export class State
{
    public readonly Tasks: MutableHashMap.MutableHashMap<Task.Handle, TaskState.TaskState> =
        MutableHashMap.empty<Task.Handle, TaskState.TaskState>();

    public readonly SubTasks: MutableMultiMap.MutableMultiMap<Task.Handle, Task.Handle> =
        MutableMultiMap.Empty<Task.Handle, Task.Handle>();

    /** A mapping of `symbol` keys of {@link Groups:var} to {@link Log.Log | Logs}. */
    public readonly Logs: MutableHashMap.MutableHashMap<Log.Handle, Log.Log> =
        MutableHashMap.empty<Log.Handle, Log.Log>();

    /**
     * A mapping of group handles to the handles of the tasks, logs, and outputs owned
     * by the respective groups.
     */
    public readonly Groups: Group.Groups = Group.Empty();

    public readonly GroupSettings: HashMap.HashMap<Group.Handle, Group.Settings> =
        HashMap.make([
            Group.Anonymous,
            DefaultGroupSettings
        ]);

    public readonly GetViewUnsafe = (Handle: Task.Handle): TaskState.TaskStateView =>
    {
        const State: TaskState.TaskState = Option.getOrUndefined(MutableHashMap.get(this.Tasks, Handle))!;
        return TaskState.TaskStateView(Handle, State);
    };

    public readonly GetUnsafe = (Handle: Task.Handle): TaskState.TaskState =>
        Option.getOrUndefined(MutableHashMap.get(this.Tasks, Handle))!;

    public readonly Has = (Handle: Task.Handle): boolean => MutableHashMap.has(this.Tasks, Handle);

    public readonly GetKeyUnsafe = (Handle: Task.Handle): string => Symbol.keyFor(Handle)!;

    public readonly SetUnsafe = (Handle: Task.Handle, State: TaskState.TaskState): void =>
    {
        pipe(this.Tasks, MutableHashMap.set(Handle, State));
    };

    public readonly GetGroupFromTask: (Handle: Task.Handle) => Option.Option<Group.MemberSet> =
        flow(
            (Handle: Task.Handle) => (Value: Group.MemberHandle, _Key: Group.Handle) => Value === Handle,
            MutableMultiMap.FindFirst(this.Groups),
            Option.flatMap(
                /* eslint-disable-next-line @typescript-eslint/typedef */
                ([ Key ]) => MutableMultiMap.get(this.Groups, Key)
            )
        );

    private readonly CurrentGroupHandle: Group.Handle = Group.Anonymous;

    public readonly GetCurrentGroupHandle = (): Group.Handle => this.CurrentGroupHandle;

    public readonly GetGroupHandle: {
        (Handle: Task.Handle): Option.Option<Group.Handle>;
        (Handle: Log.Handle): Option.Option<Group.Handle>;
        (Handle: Task.Handle | Log.Handle): Option.Option<Group.Handle>;
    } =
        flow(
            (Handle: Task.Handle | Log.Handle) =>
                (Value: Group.MemberHandle, _Key: Group.Handle) => Handle === Value,
            MutableMultiMap.FindFirst(this.Groups),
            Option.map(Tuple.get(0))
        );

    public readonly GetGroupHandleUnsafe: {
        (TaskHandle: Task.Handle): Group.Handle;
        (LogHandle: Log.Handle): Group.Handle;
    } = flow(
        this.GetGroupHandle,
        Option.getOrUndefined,
        (Out: Group.Handle | undefined) => Out!
    );

    public readonly GetLogHandle: (Handle: Task.Handle) => Option.Option<Log.Handle> =
        flow(
            this.GetGroupFromTask,
            Option.flatMap(
                Iterable.findFirst(Log.IsLogHandle)
            )
        );

    public readonly GetLogHandleFromGroupHandle: (Handle: Group.Handle) => Option.Option<Log.Handle> =
        flow(
            MutableMultiMap.get(this.Groups),
            Option.flatMap(
                Iterable.findFirst(Log.IsLogHandle)
            )
        );

    public readonly GetLogHandleUnsafe: {
        (Handle: Task.Handle): Log.Handle;
    } = Utility.MakeUnsafe(this.GetLogHandle);

    public readonly GetLogFromTaskHandleUnsafe: {
        (Handle: Task.Handle): Log.Log;
    } = (Handle: Task.Handle): Log.Log =>
    {
        return Utility.OptionGetUnsafe(MutableHashMap.get(this.Logs, this.GetLogHandleUnsafe(Handle)));
    };

    public readonly GetLogFromTaskHandle = (Handle: Task.Handle): Option.Option<Log.Log> =>
    {
        const LogHandle: Log.Handle = Option.getOrUndefined(this.GetLogHandle(Handle))!;
        return MutableHashMap.get(this.Logs, LogHandle);
    };

    public readonly GetLogFromGroupHandleUnsafe = (GroupHandle: Group.Handle): Log.Log =>
    {
        return Option.getOrUndefined(MutableHashMap.get(this.Logs, Array.from(
            HashSet.filter(
                HashSet.fromIterable((Option.getOrUndefined(MutableMultiMap.get(this.Groups, GroupHandle))!)),
                (Value: Group.MemberHandle): boolean =>
                {
                    return Log.IsLogHandle(Value);
                }))[0]! as Log.Handle))!;
    };
}
