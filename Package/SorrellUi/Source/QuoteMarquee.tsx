/**
 * An infinite, auto-scrolling carousel of quotes with drag, pause-on-hover/focus, and
 * prev/next controls. See {@link UseQuoteMarquee} for the interaction logic.
 *
 * @module @sorrell/ui/QuoteMarquee
 *
 * @file      QuoteMarquee.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import type { ReactNode } from "react";

import { Cn } from "./ClassName.js";
import { UseQuoteMarquee } from "./UseQuoteMarquee.js";

const CopyIndexes: ReadonlyArray<number> = [ 0, 1, 2 ];

const EyebrowClassName = "mb-3 font-mono text-sm font-medium tracking-wider text-zinc-400 uppercase";

const HeadingClassName = "leading-tighter max-w-2xl text-2xl font-semibold text-white md:text-3xl";

const NavButtonClassName =
    "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border " +
    "border-zinc-700 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-500 " +
    "hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

const RailClassName =
    "sorrell-ui-quotes-rail flex touch-pan-y gap-4 overflow-x-auto px-4 " +
    "[-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] select-none";

const CardClassName =
    "min-h-54 md:min-h-56 flex w-65 shrink-0 flex-col border border-zinc-700 bg-zinc-950 p-4 " +
    "md:w-80 md:p-6";

const FadeLeftClassName =
    "pointer-events-none absolute inset-y-0 left-0 hidden w-16 md:block " +
    "bg-[linear-gradient(to_right,rgb(9_9_11),transparent)]";

const FadeRightClassName =
    "pointer-events-none absolute inset-y-0 right-0 w-16 md:w-20 " +
    "bg-[linear-gradient(to_left,rgb(9_9_11),transparent)]";

const AttributionRowClassName = "mt-auto flex items-center gap-2.5 pt-3 md:gap-3 md:pt-8";

const AuthorClassName = "shrink-0 font-mono text-sm font-medium text-zinc-200";

const AttributionDividerClassName = "h-px flex-1 bg-[linear-gradient(to_right,transparent,rgb(63_63_70))]";

const LogoWrapperClassName = "flex shrink-0 items-center text-zinc-300";

/** A single quote in a {@link QuoteMarquee}. */
export interface Quote
{
    readonly author: string;
    readonly company?: string;
    /** Rendered small, to the right of the author/company — typically a company logo mark. */
    readonly logo?: ReactNode;
    readonly text: string;
}

/** {@inheritDoc QuoteMarquee} */
export interface QuoteMarqueeProps
{
    readonly className?: string;
    readonly eyebrow?: ReactNode;
    readonly heading: ReactNode;
    readonly quotes: ReadonlyArray<Quote>;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const QuoteMarquee = (
    { className: ClassName, eyebrow: Eyebrow, heading: Heading, quotes: Quotes }: QuoteMarqueeProps
): React.JSX.Element =>
{
    const {
        containerRef: ContainerRef,
        railRef: RailRef,
        scrollNext: ScrollNext,
        scrollPrevious: ScrollPrevious
    } = UseQuoteMarquee();

    return (
        <div className={ Cn("block w-full", ClassName) }
            ref={ ContainerRef }>
            <section className="relative w-full py-24 md:pt-40 md:pb-24">
                <div className="relative mx-auto w-full max-w-295 px-4">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-12">
                        <div>
                            {
                                Eyebrow !== undefined ?
                                    <p className={ EyebrowClassName }>{ Eyebrow }</p> :
                                    undefined
                            }
                            <h2 className={ HeadingClassName }>{ Heading }</h2>
                        </div>

                        <div className="flex gap-2">
                            <button aria-label="Scroll quotes left"
                                className={ NavButtonClassName }
                                onClick={ ScrollPrevious }
                                type="button">
                                <ChevronLeft aria-hidden="true"
                                    className="h-4 w-4" />
                            </button>
                            <button aria-label="Scroll quotes right"
                                className={ NavButtonClassName }
                                onClick={ ScrollNext }
                                type="button">
                                <ChevronRight aria-hidden="true"
                                    className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative isolate">
                    <div aria-label="Developer quotes"
                        className={ RailClassName }
                        ref={ RailRef }
                        tabIndex={ 0 }>
                        {
                            CopyIndexes.map((CopyIndex) =>
                                Quotes.map((QuoteItem) =>
                                    (
                                        <article className={ CardClassName }
                                            data-copy={ CopyIndex }
                                            data-role="card"
                                            key={ `${ CopyIndex }-${ QuoteItem.author }` }>
                                            <p className="text-sm text-zinc-400 leading-relaxed md:text-base">
                                                &ldquo;{ QuoteItem.text }&rdquo;
                                            </p>

                                            <div className={ AttributionRowClassName }>
                                                <span className={ AuthorClassName }>
                                                    { QuoteItem.author }
                                                </span>
                                                <div className={ AttributionDividerClassName } />
                                                {
                                                    QuoteItem.logo !== undefined ?
                                                        <div className={ LogoWrapperClassName }>
                                                            { QuoteItem.logo }
                                                        </div> :
                                                        undefined
                                                }
                                            </div>
                                        </article>
                                    )))
                        }
                    </div>

                    <div aria-hidden="true"
                        className={ FadeLeftClassName } />
                    <div aria-hidden="true"
                        className={ FadeRightClassName } />
                </div>
            </section>
        </div>
    );
};
