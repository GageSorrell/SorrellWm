/**
 * A two-column FAQ section: eyebrow/heading/description/action on the left, a zero-JS
 * `<details>`-based accordion on the right.
 *
 * @module @sorrell/ui/Faq
 *
 * @file      Faq.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import type { ReactNode } from "react";

import { Cn } from "./ClassName.js";

const EyebrowClassName = "mb-3 font-mono text-sm font-medium tracking-wider text-zinc-400 uppercase";

const HeadingClassName = "leading-tighter text-2xl font-semibold text-white md:text-3xl";

const DescriptionClassName = "mt-5 max-w-lg text-lg leading-relaxed text-zinc-400";

const ActionClassName =
    "mt-6 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 " +
    "text-sm font-medium text-white no-underline transition-colors hover:border-zinc-500 " +
    "hover:bg-zinc-800 hover:no-underline";

const DetailsClassName = "group rounded-md border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50";

const SummaryClassName =
    "flex cursor-pointer list-none items-center justify-between bg-transparent px-5 py-4 " +
    "text-base leading-snug font-medium text-zinc-300 hover:bg-transparent hover:text-white";

const ChevronWrapperClassName =
    "ml-2 flex h-6 w-6 shrink-0 items-center justify-center bg-zinc-800/80 text-zinc-400 " +
    "transition-all duration-200 group-hover:bg-zinc-700";

const AnswerClassName =
    "px-5 pt-0 pb-5 text-[15px] leading-relaxed text-zinc-400 [&_a]:underline " +
    "[&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4";

const ChevronIconClassName = "transition-transform duration-200 group-open:rotate-180";

const CollapsibleClassName =
    "grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-open:grid-rows-[1fr]";

/** A single question/answer pair in a {@link Faq}. */
export interface FaqItem
{
    readonly answer: ReactNode;
    readonly question: string;
}

/** A link action rendered below the FAQ's description, e.g. "Ask on Discord". */
export interface FaqAction
{
    readonly href: string;
    readonly icon?: ReactNode;
    readonly label: string;
}

/** {@inheritDoc Faq} */
export interface FaqProps
{
    readonly action?: FaqAction;
    readonly className?: string;
    readonly description?: ReactNode;
    readonly eyebrow?: ReactNode;
    readonly heading: ReactNode;
    readonly items: ReadonlyArray<FaqItem>;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const Faq = (
    {
        action: Action,
        className: ClassName,
        description: Description,
        eyebrow: Eyebrow,
        heading: Heading,
        items: Items
    }: FaqProps
): React.JSX.Element =>
{
    return (
        <section className={ Cn("relative w-full py-24 md:pt-40 md:pb-24", ClassName) }>
            <div className="mx-auto w-full max-w-295">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full px-4 lg:w-1/2">
                        {
                            Eyebrow !== undefined ?
                                <p className={ EyebrowClassName }>{ Eyebrow }</p> :
                                undefined
                        }
                        <h2 className={ HeadingClassName }>{ Heading }</h2>
                        {
                            Description !== undefined ?
                                <p className={ DescriptionClassName }>{ Description }</p> :
                                undefined
                        }
                        {
                            Action !== undefined ?
                                <a className={ ActionClassName }
                                    href={ Action.href }
                                    rel="noopener noreferrer"
                                    target="_blank">
                                    { Action.icon }
                                    <span>{ Action.label }</span>
                                </a> :
                                undefined
                        }
                    </div>

                    <div className="mt-8 w-full px-4 lg:mt-0 lg:w-1/2 lg:pt-28 lg:pr-4 lg:pl-3">
                        <div className="space-y-4">
                            {
                                Items.map((Item) =>
                                    (
                                        <details className={ DetailsClassName }
                                            key={ Item.question }>
                                            <summary className={ SummaryClassName }>
                                                { Item.question }
                                                <span className={ ChevronWrapperClassName }>
                                                    <svg aria-hidden="true"
                                                        className={ ChevronIconClassName }
                                                        fill="none"
                                                        height="16"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        width="16">
                                                        <path d="m6 9 6 6 6-6" />
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className={ CollapsibleClassName }>
                                                <div className="overflow-hidden">
                                                    <div className={ AnswerClassName }>
                                                        { Item.answer }
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
