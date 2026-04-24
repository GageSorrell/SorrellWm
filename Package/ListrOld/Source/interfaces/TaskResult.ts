/**
 * @file      TaskResult.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    ExitSymbol,
    FailureSymbol,
    SubtasksSymbol,
    SuccessSymbol } from "./TaskResult.Internal.js";
import type { ListrRendererSubclass, ListrTaskWrapper } from "@root/index.js";
import type { ListrTask, ListrTaskResult } from "./task.interface.js";
import type { TMaybeArray } from "@sorrell/utilities/misc";
import type { TaskWrapper } from "@lib/task-wrapper.js";

export type SubtasksFactoryFnArgument<
    ContextType,
    SubtasksContextType,
    ParentContextType,
    RendererType extends ListrRendererSubclass,
    FallbackRendererType extends ListrRendererSubclass
> =
    Omit<
        TaskWrapper<ContextType, SubtasksContextType, ParentContextType, RendererType, FallbackRendererType>,
        | "Skip"
        | "Enabled"
    >;

export type SubtasksFactoryFn<
    ContextType,
    SubtasksContextType,
    ParentContextType,
    RendererType extends ListrRendererSubclass,
    FallbackRendererType extends ListrRendererSubclass
> =
    {
        (Parent: SubtasksFactoryFnArgument<
            ContextType,
            SubtasksContextType,
            ParentContextType,
            RendererType,
            FallbackRendererType
        >): TMaybeArray<ListrTask<
            SubtasksContextType,
            unknown,
            ContextType,
            RendererType,
            FallbackRendererType
        >>;
    };

export namespace Tag
{
    export type Exit = typeof ExitSymbol;
    export type Failure = typeof FailureSymbol;
    export type Subtasks = typeof SubtasksSymbol;
    export type Success = typeof SuccessSymbol;
}

export type Tag =
    | Tag.Exit
    | Tag.Failure
    | Tag.Subtasks
    | Tag.Success;

export type FTaskResultBase =
    {
        Tag: Tag;
    };

export type TTaskResultBase<TagType extends Tag, RecordLike = { }> =
    keyof FTaskResultBase extends keyof RecordLike
        ? never
        : (
            RecordLike &
            {
                Tag: TagType;
            }
        );

export namespace TaskResult
{
    export namespace Return
    {
        export type Exit = TTaskResultBase<
            Tag.Exit,
            Argument.Exit
        >;

        export type Failure = TTaskResultBase<
            Tag.Failure,
            Argument.Failure
        >;

        export type Success = TTaskResultBase<Tag.Success>;

        export type Subtasks<
            ContextType,
            SubtaskContextType,
            ParentContextType,
            RendererType extends ListrRendererSubclass,
            FallbackRendererType extends ListrRendererSubclass
        > =
            TTaskResultBase<
                Tag.Subtasks,
                {
                    Finally: Argument.Subtasks.Finally.Callback<
                        ContextType,
                        SubtaskContextType,
                        ParentContextType,
                        RendererType,
                        FallbackRendererType
                    >;
                    Subtasks: Argument.Subtasks.Tasks<
                        ContextType,
                        SubtaskContextType,
                        ParentContextType,
                        RendererType,
                        FallbackRendererType
                    >;
                }
            >;
    }

    export namespace Argument
    {
        export namespace Subtasks
        {
            export namespace Finally
            {
                export type Argument<
                    ContextType,
                    SubtaskContextType,
                    ParentContextType,
                    RendererType extends ListrRendererSubclass,
                    FallbackRendererType extends ListrRendererSubclass
                > =
                    {
                        Context: ContextType;
                        NewContext: SubtaskContextType;
                        ThisTask: ListrTaskWrapper<
                            ContextType,
                            SubtaskContextType,
                            ParentContextType,
                            RendererType,
                            FallbackRendererType
                        >;
                    };

                export type Return<
                    ContextType,
                    SubtaskContextType,
                    ParentContextType,
                    RendererType extends ListrRendererSubclass,
                    FallbackRendererType extends ListrRendererSubclass
                > =
                    Omit<
                        ListrTaskResult<
                            ContextType,
                            SubtaskContextType,
                            ParentContextType,
                            RendererType,
                            FallbackRendererType
                        >,
                        "Subtasks"
                    >;

                export type Callback<
                    ContextType,
                    SubtaskContextType,
                    ParentContextType,
                    RendererType extends ListrRendererSubclass,
                    FallbackRendererType extends ListrRendererSubclass
                > =
                    {
                        (Argument: Argument<
                            ContextType,
                            SubtaskContextType,
                            ParentContextType,
                            RendererType,
                            FallbackRendererType
                        >): Promise<Return<
                            ContextType,
                            SubtaskContextType,
                            ParentContextType,
                            RendererType,
                            FallbackRendererType
                        >>;
                    };
            }

            export type Tasks<
                ContextType,
                SubtaskContextType,
                ParentContextType,
                RendererType extends ListrRendererSubclass,
                FallbackRendererType extends ListrRendererSubclass
            > =
                | TMaybeArray<ListrTask<
                    SubtaskContextType,
                    unknown,
                    ContextType,
                    RendererType,
                    FallbackRendererType
                >>
                | SubtasksFactoryFn<
                    ContextType,
                    SubtaskContextType,
                    ParentContextType,
                    RendererType,
                    FallbackRendererType
                >;
        }

        /**
         * The argument passed to {@link Listr.Return.Exit}.
         */
        export type Exit =
            {
                Title?: string;
            };
        export type Failure =
            /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
            | { }
            | {
                Die: false;
            }
            | {
                Die: boolean;
                Completely?: boolean;
                Message?: string;
                TaskTitle?: string;
            }
            | {
                Die: true;
                Completely?: boolean;
                Message: string;
                TaskTitle?: string;
            };
    }
}
