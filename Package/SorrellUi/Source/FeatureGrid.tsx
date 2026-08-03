/**
 * A grid of problem→solution feature cards, with an optional side chart slot (e.g. a
 * {@link ComparisonChart}) next to the section heading.
 *
 * @module @sorrell/ui/FeatureGrid
 *
 * @file      FeatureGrid.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ArrowDown, Check } from "lucide-react";
import type * as React from "react";
import type { ReactNode } from "react";

import { Cn } from "./ClassName.js";

const EyebrowClassName = "mb-3 font-mono text-sm font-medium tracking-wider text-zinc-400 uppercase";

const HeadingClassName = "leading-tighter max-w-md text-2xl font-semibold text-white md:text-3xl";

const CardTitleClassName = "flex items-center gap-2 font-mono text-base font-medium text-white uppercase";

const CardIconClassName = "flex h-6 w-6 shrink-0 items-center justify-center bg-zinc-800";

const ChecklistIconWrapperClassName = "flex h-6 w-6 shrink-0 items-center justify-center";

/** A single problem→solution card in a {@link FeatureGrid}. */
export interface FeatureGridItem
{
    /** A short checklist of what the solution provides, rendered with check marks. */
    readonly checklist: ReadonlyArray<string>;
    readonly icon: ReactNode;
    readonly problem: string;
    readonly title: string;
}

/** {@inheritDoc FeatureGrid} */
export interface FeatureGridProps
{
    /** Rendered beside the heading, e.g. a {@link ComparisonChart}. */
    readonly chart?: ReactNode;
    readonly className?: string;
    readonly eyebrow?: ReactNode;
    readonly heading: ReactNode;
    readonly items: ReadonlyArray<FeatureGridItem>;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const FeatureGrid = (
    { chart: Chart, className: ClassName, eyebrow: Eyebrow, heading: Heading, items: Items }: FeatureGridProps
): React.JSX.Element =>
{
    return (
        <section className={ Cn("relative w-full py-24 md:pt-40 md:pb-24", ClassName) }>
            <div className="relative mx-auto w-full max-w-295 px-4">
                <div className="mb-8 grid grid-cols-1 gap-12 md:mb-16 lg:grid-cols-2 lg:gap-8">
                    <div>
                        {
                            Eyebrow !== undefined ?
                                <p className={ EyebrowClassName }>{ Eyebrow }</p> :
                                undefined
                        }
                        <h2 className={ HeadingClassName }>{ Heading }</h2>
                    </div>

                    {
                        Chart !== undefined ?
                            <div className="flex flex-col justify-center">{ Chart }</div> :
                            undefined
                    }
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {
                        Items.map((Item) =>
                            (
                                <article className="flex flex-col border border-zinc-800 bg-zinc-950 p-5"
                                    key={ Item.title }>
                                    <p className="text-base leading-snug font-medium text-zinc-400">
                                        { Item.problem }
                                    </p>

                                    <div className="my-4 flex items-center gap-2">
                                        <div className="h-px flex-1 bg-zinc-800" />
                                        <ArrowDown aria-hidden="true"
                                            className="h-4 w-4 text-white" />
                                        <div className="h-px flex-1 bg-zinc-800" />
                                    </div>

                                    <h3 className={ CardTitleClassName }>
                                        <span className={ CardIconClassName }>
                                            { Item.icon }
                                        </span>
                                        { Item.title }
                                    </h3>

                                    <ul className="m-0 mt-3 flex list-none flex-col gap-1.5 p-0">
                                        {
                                            Item.checklist.map((ChecklistEntry) =>
                                                (
                                                    <li className="flex items-start gap-2"
                                                        key={ ChecklistEntry }>
                                                        <span className={ ChecklistIconWrapperClassName }>
                                                            <Check aria-hidden="true"
                                                                className="h-4 w-4 text-emerald-500" />
                                                        </span>
                                                        <span className="text-sm text-zinc-400">
                                                            { ChecklistEntry }
                                                        </span>
                                                    </li>
                                                ))
                                        }
                                    </ul>
                                </article>
                            ))
                    }
                </div>
            </div>
        </section>
    );
};
