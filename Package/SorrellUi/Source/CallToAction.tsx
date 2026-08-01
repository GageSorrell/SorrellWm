/**
 * A closing call-to-action band: eyebrow slot, heading, an action slot (e.g. an
 * {@link InstallCommandPanel}), and up to two link actions.
 *
 * @module @sorrell/ui/CallToAction
 *
 * @file      CallToAction.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import type { ReactNode } from "react";

import { Button } from "./Button.js";
import { Cn } from "./ClassName.js";
import { GridBackground } from "./GridBackground.js";

/** A single link action rendered as an outline {@link Button}. */
export interface CallToActionLink
{
    readonly href: string;
    readonly icon?: ReactNode;
    readonly label: string;
}

/** Props for {@link CallToAction}. */
export interface CallToActionProps
{
    readonly children?: ReactNode;
    readonly className?: string;
    /** Small line of copy above {@link CallToActionProps.heading}, e.g. a code snippet. */
    readonly eyebrow?: ReactNode;
    readonly heading: ReactNode;
    readonly primaryAction?: CallToActionLink;
    readonly secondaryAction?: CallToActionLink;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const CallToAction = (
    {
        children: Children,
        className: ClassName,
        eyebrow: Eyebrow,
        heading: Heading,
        primaryAction: PrimaryAction,
        secondaryAction: SecondaryAction
    }: CallToActionProps
): React.JSX.Element =>
{
    return (
        <section className={ Cn("relative w-full py-36 md:py-24", ClassName) }>
            <GridBackground />
            <div className="relative mx-auto w-full max-w-295 px-4">
                <div className="flex flex-col items-center text-center">
                    {
                        Eyebrow !== undefined ?
                            <p className="mb-3 font-mono text-base text-zinc-500">{ Eyebrow }</p> :
                            undefined
                    }

                    <h2 className="leading-tighter max-w-3xl text-4xl font-bold text-white">{ Heading }</h2>

                    {
                        Children !== undefined ?
                            <div className="mx-auto mt-8 w-full max-w-xl">{ Children }</div> :
                            undefined
                    }

                    {
                        PrimaryAction !== undefined || SecondaryAction !== undefined ?
                            <div className="mt-6 flex flex-row items-center justify-center gap-3">
                                {
                                    PrimaryAction !== undefined ?
                                        <Button className="w-44"
                                            render={ <a href={ PrimaryAction.href } /> }
                                            size="lg"
                                            variant="outline">
                                            { PrimaryAction.icon }
                                            { PrimaryAction.label }
                                        </Button> :
                                        undefined
                                }
                                {
                                    SecondaryAction !== undefined ?
                                        <Button className="w-44"
                                            render={ <a href={ SecondaryAction.href }
                                                rel="noopener noreferrer"
                                                target="_blank" /> }
                                            size="lg"
                                            variant="outline">
                                            { SecondaryAction.icon }
                                            { SecondaryAction.label }
                                        </Button> :
                                        undefined
                                }
                            </div> :
                            undefined
                    }
                </div>
            </div>
        </section>
    );
};
