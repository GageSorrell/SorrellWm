/**
 * @file      Runtime.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";

import { Effect, Ref, Schedule } from "effect";

export interface EffectTaskRunError<TTaskError>
{
  readonly _tag: "EffectTaskRunError";
  readonly Title: string;
  readonly Path: ReadonlyArray<string>;
  readonly Error: TTaskError;
}

export interface EffectTaskRollbackError<TRollbackError>
{
  readonly _tag: "EffectTaskRollbackError";
  readonly Title: string;
  readonly Path: ReadonlyArray<string>;
  readonly Error: TRollbackError;
}

export type EffectTaskRetryPolicy =
  | Schedule.Schedule
  | {
      readonly Times: number;
      readonly Delay?: string | number;
    };

export interface EffectTaskContext
{
  readonly Title: string;
  readonly Path: ReadonlyArray<string>;
  readonly MarkCommitted: Effect.Effect<void>;
}

export interface EffectTask<
  TInput,
  TOutput,
  TTaskError = never,
  TRollbackError = never,
  TRequirements = never
>
{
  readonly Title: string;
  readonly Enabled?: (Input: TInput) => boolean;
  readonly Retry?: EffectTaskRetryPolicy;
  readonly Run: (
    Input: TInput,
    Context: EffectTaskContext
  ) => Effect.Effect<TOutput, TTaskError, TRequirements>;
  readonly Rollback?: (
    Input: TInput,
    Output: TOutput,
    Context: EffectTaskContext
  ) => Effect.Effect<void, TRollbackError, TRequirements>;
}

type TaskInput<TTask extends AnyEffectTask> =
  TTask extends EffectTask<infer TInput, any, any, any, any>
    ? TInput
    : never;

type TaskOutput<TTask extends AnyEffectTask> =
  TTask extends EffectTask<any, infer TOutput, any, any, any>
    ? TOutput
    : never;

type TaskRequirements<TTask extends AnyEffectTask> =
  TTask extends EffectTask<any, any, any, any, infer TRequirements>
    ? TRequirements
    : never;

type TaskRunFailure<TTask extends AnyEffectTask> =
  TTask extends EffectTask<any, any, infer TTaskError, any, any>
    ? EffectTaskRunError<TTaskError>
    : never;

type TaskRollbackFailure<TTask extends AnyEffectTask> =
  TTask extends EffectTask<any, any, any, infer TRollbackError, any>
    ? EffectTaskRollbackError<TRollbackError>
    : never;

type FirstTask<TTasks extends readonly [AnyEffectTask, ...ReadonlyArray<AnyEffectTask>]> =
  TTasks extends readonly [infer TFirst extends AnyEffectTask, ...ReadonlyArray<AnyEffectTask>]
    ? TFirst
    : never;

type LastTask<TTasks extends readonly [AnyEffectTask, ...ReadonlyArray<AnyEffectTask>]> =
  TTasks extends readonly [...ReadonlyArray<AnyEffectTask>, infer TLast extends AnyEffectTask]
    ? TLast
    : never;

type AreComposable<TTasks extends readonly [AnyEffectTask, ...ReadonlyArray<AnyEffectTask>]> =
  TTasks extends readonly [AnyEffectTask]
    ? true
    : TTasks extends readonly [
        infer TFirst extends AnyEffectTask,
        infer TSecond extends AnyEffectTask,
        ...infer TRest extends ReadonlyArray<AnyEffectTask>
      ]
      ? [TaskOutput<TFirst>] extends [TaskInput<TSecond>]
        ? TRest extends []
          ? true
          : AreComposable<readonly [TSecond, ...TRest]>
        : false
      : false;

type ComposableTasks<TTasks extends readonly [AnyEffectTask, ...ReadonlyArray<AnyEffectTask>]> =
  AreComposable<TTasks> extends true
    ? TTasks
    : never;

type TaskSetError<TTasks extends readonly [AnyEffectTask, ...ReadonlyArray<AnyEffectTask>]> =
  TaskRunFailure<TTasks[number]> | TaskRollbackFailure<TTasks[number]>;

type TaskSetRequirements<TTasks extends readonly [AnyEffectTask, ...ReadonlyArray<AnyEffectTask>]> =
  TaskRequirements<TTasks[number]>;

function ApplyRetryPolicy<TSuccess, TError, TRequirements>(
  TaskEffect: Effect.Effect<TSuccess, TError, TRequirements>,
  RetryPolicy: EffectTaskRetryPolicy
): Effect.Effect<TSuccess, TError, TRequirements>
{
  if ("Times" in RetryPolicy)
  {
    if (RetryPolicy.Delay === undefined)
    {
      return Effect.retry(TaskEffect, { times: RetryPolicy.Times });
    }

    return Effect.retry(
      TaskEffect,
      Schedule.addDelay(
        Schedule.recurs(RetryPolicy.Times),
        () => RetryPolicy.Delay
      )
    );
  }

  return Effect.retry(TaskEffect, RetryPolicy);
}

export function Run<TaskType extends AnyEffectTask = AnyEffectTask>(
  Tasks: ComposableTasks<TasksType>,
  InitialInput: TaskInput<FirstTask<TasksType>>
): Effect.Effect<
  TaskOutput<LastTask<TasksType>>,
  TaskSetError<TasksType>,
  TaskSetRequirements<TasksType>
>
{
  return Effect.scoped(
    Effect.gen(function* ()
    {
      let CurrentValue: unknown = InitialInput;

      for (const CurrentTask of Tasks)
      {
        const PreviousValue = CurrentValue;

        if (CurrentTask.Enabled !== undefined && !CurrentTask.Enabled(PreviousValue))
        {
          continue;
        }

        const TaskPath = [CurrentTask.Title] as const;
        const IsCommittedReference = yield* Ref.make(false);

        const TaskContext: EffectTaskContext =
        {
          Title: CurrentTask.Title,
          Path: TaskPath,
          MarkCommitted: Ref.set(IsCommittedReference, true)
        };

        let RunEffect = CurrentTask.Run(
          PreviousValue,
          TaskContext
        );

        if (CurrentTask.Retry !== undefined)
        {
          RunEffect = ApplyRetryPolicy(RunEffect, CurrentTask.Retry);
        }

        const NextValue = yield* RunEffect.pipe(
          Effect.mapError(
            (Error): EffectTaskRunError<unknown> =>
            ({
              _tag: "EffectTaskRunError",
              Title: CurrentTask.Title,
              Path: TaskPath,
              Error
            })
          )
        );

        if (CurrentTask.Rollback !== undefined)
        {
          yield* Effect.addFinalizer((ExitValue) =>
          {
            if (ExitValue._tag === "Success")
            {
              return Effect.succeed(undefined);
            }

            return Ref.get(IsCommittedReference).pipe(
              Effect.flatMap((IsCommitted) =>
              {
                if (IsCommitted)
                {
                  return Effect.succeed(undefined);
                }

                return CurrentTask.Rollback!(
                  PreviousValue,
                  NextValue,
                  TaskContext
                ).pipe(
                  Effect.mapError(
                    (Error): EffectTaskRollbackError<unknown> =>
                    ({
                      _tag: "EffectTaskRollbackError",
                      Title: CurrentTask.Title,
                      Path: TaskPath,
                      Error
                    })
                  )
                );
              })
            );
          });
        }

        CurrentValue = NextValue;
      }

      return CurrentValue as TaskOutput<LastTask<TasksType>>;
    })
  ) as Effect.Effect<
    TaskOutput<LastTask<TasksType>>,
    TaskSetError<TasksType>,
    TaskSetRequirements<TasksType>
  >;
}
