/**
 * An alternating media+text list of case studies, with an optional row of secondary link
 * pills above it (e.g. links to a podcast or playlist).
 *
 * @module @sorrell/ui/CaseStudyList
 *
 * @file      CaseStudyList.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ArrowUpRight } from "lucide-react";
import type * as React from "react";
import type { ReactNode } from "react";

import { Cn } from "./ClassName.js";

const SecondaryLinkClassName =
    "inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm " +
    "font-medium text-white no-underline transition-colors hover:border-zinc-500 hover:bg-zinc-800 " +
    "hover:no-underline";

const WatchTalkLinkClassName =
    "group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white no-underline " +
    "hover:no-underline";

const WatchTalkArrowClassName =
    "h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

const MediaFrameClassName =
    "relative aspect-video w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-900";

const MediaOverlayClassName =
    "absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20";

const EyebrowClassName = "mb-3 font-mono text-sm font-medium tracking-wider text-zinc-400 uppercase";

const ItemTitleClassName = "leading-tighter text-xl font-semibold text-white md:text-2xl";

/** A single case study in a {@link CaseStudyList}. */
export interface CaseStudyListItem
{
    readonly description: string;
    readonly href: string;
    readonly mediaAlt: string;
    readonly mediaSrc: string;
    readonly title: string;
}

/** A secondary link pill, e.g. to a podcast or playlist. */
export interface CaseStudyListLink
{
    readonly href: string;
    readonly label: string;
}

/** {@inheritDoc CaseStudyList} */
export interface CaseStudyListProps
{
    readonly className?: string;
    readonly eyebrow?: ReactNode;
    readonly heading: ReactNode;
    readonly items: ReadonlyArray<CaseStudyListItem>;
    readonly links?: ReadonlyArray<CaseStudyListLink>;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const CaseStudyList = (
    {
        className: ClassName,
        eyebrow: Eyebrow,
        heading: Heading,
        items: Items,
        links: Links = []
    }: CaseStudyListProps
): React.JSX.Element =>
{
    return (
        <section className={ Cn("relative w-full py-24 md:pt-40 md:pb-24", ClassName) }>
            <div className="mx-auto mb-12 w-full max-w-295 px-4">
                {
                    Eyebrow !== undefined ?
                        <p className={ EyebrowClassName }>
                            { Eyebrow }
                        </p> :
                        undefined
                }
                <h2 className="leading-tighter text-2xl font-semibold text-white md:text-3xl">
                    { Heading }
                </h2>

                {
                    Links.length > 0 ?
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            {
                                Links.map((LinkItem) =>
                                    (
                                        <a className={ SecondaryLinkClassName }
                                            href={ LinkItem.href }
                                            key={ LinkItem.href }
                                            rel="noopener noreferrer"
                                            target="_blank">
                                            { LinkItem.label }
                                            <ArrowUpRight aria-hidden="true"
                                                className="h-4 w-4" />
                                        </a>
                                    ))
                            }
                        </div> :
                        undefined
                }
            </div>

            <div className="mx-auto flex w-full max-w-295 flex-col gap-12 px-4 md:gap-16">
                {
                    Items.map((Item, Index) =>
                    {
                        const ImageOnRight = Index % 2 === 1;

                        return (
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center"
                                key={ Item.href }>
                                <div className={ Cn(
                                    "flex w-full flex-col gap-5 lg:mx-auto lg:max-w-104",
                                    ImageOnRight ? "lg:order-1" : "lg:order-2"
                                ) }>
                                    <h3 className={ ItemTitleClassName }>
                                        { Item.title }
                                    </h3>
                                    <p className="max-w-md text-base leading-relaxed text-zinc-300">
                                        { Item.description }
                                    </p>
                                    <a className={ WatchTalkLinkClassName }
                                        href={ Item.href }
                                        rel="noopener noreferrer"
                                        target="_blank">
                                        Watch the talk
                                        <ArrowUpRight aria-hidden="true"
                                            className={ WatchTalkArrowClassName } />
                                    </a>
                                </div>

                                <a aria-label={ `Watch ${ Item.title }` }
                                    className={ Cn(
                                        "group relative",
                                        ImageOnRight ? "lg:order-2" : "lg:order-1"
                                    ) }
                                    href={ Item.href }
                                    rel="noopener noreferrer"
                                    target="_blank">
                                    <div className={ MediaFrameClassName }>
                                        <img alt={ Item.mediaAlt }
                                            className="h-full w-full object-cover"
                                            src={ Item.mediaSrc } />
                                        <div className={ MediaOverlayClassName } />
                                    </div>
                                </a>
                            </div>
                        );
                    })
                }
            </div>
        </section>
    );
};
