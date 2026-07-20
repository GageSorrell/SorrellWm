/**
 * @file      Shared.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    type DefaultRenderer,
    type ListrBaseClassOptions,
    type ListrTaskObject,
    Listr as OriginalListr } from "listr2";
import { type ListrConstructorTask, RunListr } from "@sorrell/cli-utilities";
import type { PackageNameType } from "./Shared.Types";

/* eslint-disable jsdoc/require-jsdoc */

/** {@inheritdoc PackageNameType} */
export const PackageName: PackageNameType = "reactive-event-cli" as const;

/* eslint-enable jsdoc/require-jsdoc */

/** A string-only {@link Error} used by {@link Listr} to show nicely-formatted errors. */
export class SimpleError extends Error
{
    public constructor(Message: string)
    {
        super();
        this.TheMessage = Message;
    }

    public TheMessage: string;
};

class Listr<ContextType>
    extends OriginalListr<ContextType, typeof DefaultRenderer, typeof DefaultRenderer>
{
    public constructor(
        Task: ListrConstructorTask<ContextType>,
        Options?: ListrBaseClassOptions<ContextType, typeof DefaultRenderer, typeof DefaultRenderer>,
        ParentTask?: ListrTaskObject<
            unknown,
            typeof DefaultRenderer,
            typeof DefaultRenderer
        >
    )
    {
        if (Options === undefined && ParentTask === undefined)
        {
            super(Task);
        }
        else if (Options !== undefined && ParentTask === undefined)
        {
            super(Task, Options);
        }
        else if (Options !== undefined && ParentTask !== undefined)
        {
            super(Task, Options, ParentTask);
        }
    }
};

/**
 * A wrapper for `new Listr` that handles errors nicely.
 *
 * @template ContextType - The type of the `listr2` context used by the {@link Task}.
 *
 * @param Task - The task(s) to run.
 * @param GenericErrorMessage - The error message that is shown if the {@link Task | task(s)} throw(s)
 * something other than a {@link SimpleError}.
 * @param Options - *(Optional)* The {@link ListrBaseClassOptions} used to customize the
 * {@link Task | task(s)}.
 * @param ParentTask - *(Optional)* The {@link ListrTaskObject | parent task} of which the
 * {@link Task | task(s)} are (a) descendant(s).
 */
export async function RunListr<ContextType = unknown>(
    Task: ListrConstructorTask<ContextType>,
    GenericErrorMessage: string,
    Options?: ListrBaseClassOptions<ContextType, typeof DefaultRenderer, typeof DefaultRenderer>,
    ParentTask?: ListrTaskObject<
        unknown,
        typeof DefaultRenderer,
        typeof DefaultRenderer
    >
): Promise<void>
{
    try
    {
        await new Listr(Task, Options, ParentTask);
    }
    catch (ListrError: unknown)
    {
        if (ListrError instanceof SimpleError)
        {
            console.error(`🚨 ${ ListrError.TheMessage }`);
        }
        else
        {
            console.dir(ListrError);
            console.error(`\n🚨 ${ GenericErrorMessage }.  The error is printed above.`);
        }
    }
}
