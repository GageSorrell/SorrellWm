/**
 * @file      cta.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "../atoms/button";
import { Headlines } from "./hero";

export function CTA(): ReactNode
{
    const [ CurrentIndex, SetCurrentIndex ] = useState<number>(0);
    useEffect(() =>
    {
        const AnimationTimer: NodeJS.Timeout = setInterval(
            () =>
            {
                SetCurrentIndex((OldId: number) => (OldId === Headlines.length - 1 ? 0 : OldId + 1));
            },
            2500
        );
        return () => clearInterval(AnimationTimer);
    }, [ ]);

    return (
        <section className="relative">
            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 pb-24 pt-32 ">
                <div>
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-center">
                        <span
                            className={
                                "text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-300"
                            }>
                            Build type-safe
                        </span>
                        <br />
                        <span className="block relative">
                            <AnimatePresence initial={ false }>
                                {
                                    Headlines.map(({ text, gradient }, Index: number): ReactNode =>
                                    {
                                        if (Index === CurrentIndex)
                                        {
                                            return (
                                                <motion.span
                                                    animate={ { opacity: 1, y: 0 } }
                                                    className={
                                                        "not-sr-only w-full h-32 text-center absolute " +
                                                        "block text-transparent bg-clip-text " +
                                                        `bg-gradient-to-br ${ gradient }`
                                                    }
                                                    exit={ { opacity: 0, transition: { duration: 0.2 } } }
                                                    initial={ { opacity: 0, y: "-100%" } }
                                                    key={ text }
                                                >
                                                    { text }
                                                </motion.span>
                                            );
                                        }
                                    })
                                }
                            </AnimatePresence>
                        </span>
                        <br />
                        <span
                            className={
                                "text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-300"
                            }>
                            in Electron
                        </span>
                    </h2>
                    <p className="mt-8 mb-4 max-w-xl text-center mx-auto">
                        Reactive Event makes it easy to always know <i>what</i> data is being
                        sent <i>where</i>.
                        Check out our friendly documentation to get started.
                    </p>
                    <div className="mt-10 flex gap-3 justify-center">
                        <Button href="/docs/latest/article/getting-started">Get Started</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
