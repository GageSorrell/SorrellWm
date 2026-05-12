/**
 * @file      features.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Button } from "../atoms/button";
import { Checklist } from "../atoms/checklist";
import { Divider } from "../layout/divider";
import { GlowingIcon } from "../atoms/glowing-icon";
import type { ReactNode } from "react";

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function Features(): ReactNode
{
    const RootStyle: string =
        [
            "w-full",
            "max-w-screen-xl",
            "mx-auto",
            "px-4",
            "sm:px-8",
            "lg:px-16",
            "pb-24",
            "pt-32",
            "grid",
            "grid-cols-1",
            "md:grid-cols-3",
            "gap-16"
        ].join(" ");

    return (
        <section className="relative">
            <div className={ RootStyle }>
                <div>
                    <div className="flex items-center gap-3">
                        <GlowingIcon name="blocks" />
                        <h3 className="font-display text-xl text-white">
                            Powerful building blocks
                        </h3>
                    </div>
                    <p className="my-6">
                        Every part of the Effect ecosystem is designed to be composable.
                        The Effect primitives can be combined in many different ways to
                        tackle the most complex problems.
                    </p>
                    <Checklist
                        items={ [
                            "Immutable data structures",
                            "Asynchronous queues & pub-sub",
                            "Configuration & dependency management"
                        ] }
                    />
                    <Button
                        className="mt-10"
                        href="/docs"
                        secondary>
                        Read documentation
                    </Button>
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <GlowingIcon name="plugs" />
                        <h3 className="font-display text-xl text-white">No more one-off dependencies</h3>
                    </div>
                    <p className="my-6">
                        With Effect the batteries are included. Regardless of the
                        application, your package.json will have never been this small.
                    </p>
                    <Checklist
                        items={ [
                            "Data validation & serialization",
                            "Frameworks for CLI & HTTP applications",
                            "Powerful abstractions for every platform"
                        ] }
                    />
                    <Button
                        className="mt-10"
                        href="/docs"
                        secondary>
                        Read documentation
                    </Button>
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <GlowingIcon name="shield" />
                        <h3 className="font-display text-xl text-white">Never try & catch again</h3>
                    </div>
                    <p className="my-6">
                        Effect doesn&apos;t shy away from errors &mdash; it embraces them as a fact of life.
                        Successfully handle failure with the built-in error-handling primitives.
                    </p>
                    <Checklist
                        items={ [
                            "Type-safe errors as values",
                            "Powerful retry & recovery APIs",
                            "Tools for logging & tracing"
                        ] }
                    />
                    <Button
                        className="mt-10"
                        href="/docs"
                        secondary>
                        Read documentation
                    </Button>
                </div>
            </div>
            <Divider />
        </section>
    );
}
