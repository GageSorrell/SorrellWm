/**
 * @file      hero.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../atoms/button";
import { Checklist } from "../atoms/checklist";
import { Divider } from "../layout/divider";

export const Headlines: Array<Record<"gradient" | "text", string>> =
    [
        {
            gradient: "from-violet-400 to-violet-600",
            text: "IPC events"
        },
        {
            gradient: "from-[#5B9EE9] to-[#2F74C0]",
            text: "React hooks"
        },
        {
            gradient: "from-emerald-400 to-emerald-600",
            text: "process handlers"
        },
        {
            gradient: "from-violet-400 to-violet-600",
            text: "desktop apps"
        },
        {
            gradient: "from-red-400 to-red-600",
            text: "preload APIs"
        }
    ];

export function Hero()
{
    const [ CurrentIndex, SetCurrentIndex ] = useState<number>(0);
    useEffect(() =>
    {
        const AnimationTimer: NodeJS.Timeout = setInterval(
            (): void =>
            {
                SetCurrentIndex((OldId: number) =>
                {
                    return OldId === Headlines.length - 1
                        ? 0
                        : OldId + 1;
                });
            },
            2500
        );

        return (): void => clearInterval(AnimationTimer);
    }, [ ]);

    const BuildTypeSafeClass: string =
        [
            "text-transparent",
            "bg-clip-text",
            "bg-gradient-to-br",
            "from-white",
            "to-zinc-300"
        ].join(" ");

    const InElectronClass: string = "text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-300";

    return (
        <section className="relative z-10">
            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 pt-20">
                <div className="flex flex-col md:flex-row md:gap-x-6 lg:gap-x-0 xl:grid xl:grid-cols-2 mt-4">
                    <div className="shrink-0 md:w-1/2 lg:w-7/12 xl:w-auto">
                        <h1 className="font-display text-4xl sm:text-4xl lg:text-5xl mb-8">
                            <span className={ BuildTypeSafeClass }>
                                Build type-safe
                            </span>
                            <br />
                            <span className="block relative">
                                <AnimatePresence initial={ false }>
                                    <span className="relative opacity-0">
                                        { Headlines[CurrentIndex].text }
                                    </span>
                                    <motion.span
                                        animate={ { opacity: 1, y: 0 } }
                                        className={
                                            "not-sr-only absolute top-0 -bottom-4 block text-transparent " +
                                            "bg-clip-text bg-gradient-to-br " +
                                            Headlines[CurrentIndex].gradient
                                        }
                                        exit={ { opacity: 0, transition: { duration: 0.2 } } }
                                        initial={ { opacity: 0, y: "-100%" } }
                                        key={ CurrentIndex }
                                    >
                                        { Headlines[CurrentIndex].text }
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            <span className={ InElectronClass }>
                                in Electron
                            </span>
                        </h1>
                        <div
                            className="flex md:hidden"
                            style={ { justifyContent: "center", marginTop: "-3rem" } }>
                            <img
                                alt="Reactive Event Logo"
                                src="/images/Hero.png"
                                width="80%"
                            />
                        </div>
                        <Checklist
                            items={ [
                                "Maximum Type-safety (incl. error handling)",
                                "Makes your code more composable, reusable and testable",
                                "Extensive library with a rich ecosystem of packages",
                                "Clustering and Workflows (Alpha)"
                            ] }
                        />
                        <div className="mt-10 flex flex-col sm:flex-row items-start gap-3">
                            <Button href="/docs/latest/article/getting-started">
                                Get Started
                            </Button>
                        </div>
                    </div>
                    <div
                        className="hidden md:flex shrink grow"
                        style={ { alignItems: "flex-start", justifyContent: "center", marginTop: "-6rem" } }>
                        <img
                            alt="Reactive Event Logo"
                            src="/images/Hero.png"
                        />
                    </div>
                </div>
            </div>
            <Divider className="mt-8 md:-mt-8" />
        </section>
    );
};
