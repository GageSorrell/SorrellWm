/**
 * A landing-page hero section: eyebrow badge link, heading, subheading, an action slot
 * (e.g. an {@link InstallCommandPanel}), and a social-proof logo row.
 *
 * @module @sorrell/ui/Hero
 *
 * @file      Hero.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ArrowRight } from "lucide-react";
import type * as React from "react";
import type { ReactNode } from "react";

import { Cn } from "./ClassName.js";
import { GridBackground } from "./GridBackground.js";

const BadgeClassName =
    "group mb-4 inline-flex items-center gap-2 font-mono text-sm tracking-wider text-zinc-300 " +
    "uppercase transition-colors hover:text-white";

const BadgeArrowClassName =
    "text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300";

const HeadingClassName = "text-4xl leading-tighter font-bold text-white md:text-[3.4rem]";

const SubheadingClassName = "mt-6 max-w-3xl text-lg leading-snug text-zinc-400 md:mx-auto";

const SocialProofLabelClassName = "font-mono text-sm font-medium tracking-wider text-zinc-400 uppercase";

/** A single logo shown in the hero's "in production at" social-proof row. */
export interface HeroSocialProofLogo
{
    readonly name: string;
    readonly node: ReactNode;
}

/** Props for {@link Hero}. */
export interface HeroProps
{
    /** Eyebrow badge, rendered as a link above the heading. Omit to hide the badge. */
    readonly badgeHref?: string;
    readonly badgeLabel?: string;
    readonly children?: ReactNode;
    readonly className?: string;
    readonly heading: ReactNode;
    /** Omit to hide the social-proof row entirely. */
    readonly logos?: ReadonlyArray<HeroSocialProofLogo>;
    readonly socialProofLabel?: string;
    readonly subheading?: ReactNode;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const Hero = (
    {
        badgeHref: BadgeHref,
        badgeLabel: BadgeLabel,
        children: Children,
        className: ClassName,
        heading: Heading,
        logos: Logos = [],
        socialProofLabel: SocialProofLabel = "In production at",
        subheading: Subheading
    }: HeroProps
): React.JSX.Element =>
{
    return (
        <section className={ Cn("relative w-full", ClassName) }>
            <GridBackground />
            <div aria-hidden="true"
                className="sorrell-ui-hero-glow pointer-events-none absolute inset-x-0 top-0 h-150" />
            <div className="relative mx-auto w-full max-w-295 px-4 py-20">
                <div className="max-w-4xl text-left md:mx-auto md:text-center">
                    {
                        BadgeHref !== undefined && BadgeLabel !== undefined ?
                            <a className={ BadgeClassName }
                                href={ BadgeHref }>
                                <span className="text-zinc-500 group-hover:text-zinc-400">//</span>
                                <span>{ BadgeLabel }</span>
                                <ArrowRight aria-hidden="true"
                                    className={ BadgeArrowClassName }
                                    size={ 16 } />
                            </a> :
                            undefined
                    }

                    <h1 className={ HeadingClassName }>{ Heading }</h1>

                    {
                        Subheading !== undefined ?
                            <p className={ SubheadingClassName }>{ Subheading }</p> :
                            undefined
                    }

                    {
                        Children !== undefined ?
                            <div className="mx-auto mt-8 max-w-xl">{ Children }</div> :
                            undefined
                    }

                    {
                        Logos.length > 0 ?
                            <div className="mt-14 flex flex-col items-center gap-5">
                                <p className={ SocialProofLabelClassName }>{ SocialProofLabel }</p>
                                <ul className="flex flex-wrap items-end justify-center gap-x-8 gap-y-5">
                                    {
                                        Logos.map((Logo) =>
                                            (
                                                <li className="flex items-end"
                                                    key={ Logo.name }>{ Logo.node }</li>
                                            ))
                                    }
                                </ul>
                            </div> :
                            undefined
                    }
                </div>
            </div>
        </section>
    );
};
