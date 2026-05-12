/**
 * @file      Tweets.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Dedent } from "@sorrell/utilities/string";
import { Glow } from "../layout/glow";
import Image from "next/image";
import type { ReactNode } from "react";

type FTweet =
    {
        User:
        {
            Avatar: string;
            Bio: string;
            Name: string;
        };
        Text: string;
    };

const TweetsContent: ReadonlyArray<FTweet> =
    [
        {
            Text: Dedent(
                `Effect is the 🐐 of TypeScript

                - Rust style error handling
                - Retries, Concurrency, Streams, …
                - Missing standard library\n`
            ),
            User:
            {
                Avatar: "https://pbs.twimg.com/profile_images/1361293861813956608/FBJWYoXx_400x400.jpg",
                Bio: "Product Engineer at Vercel",
                Name: "Tobias Lins"
            }
        },
        {
            Text: Dedent(
                `Effect is so, so good. Error handling in TypeScript has always felt so haphazard.
                Effect makes it feel effortless. And that’s only a tiny part of what makes Effect such a great
                set of libraries. Keep up the great work!`
            ),
            user:
            {
                Avatar: "https://avatars.githubusercontent.com/u/39350030?v=4",
                Bio: "Software engineer at PolyCam",
                Name: "Devin Jameson"
            }
        },
        {
            Text: Dedent(
                `I LOVE Effect, been using it for a month now and it took a minute to figure out how to build
                composable services, but oh-my-god my code has never been this sexy.`
            ),
            user:
            {
                Avatar: "https://pbs.twimg.com/profile_images/1595833949955260416/rzBglApR_400x400.jpg",
                Bio: "Functional programmer in TypeScript",
                Name: "David Peter"
            }
        },
        {
            Text: Dedent(
                `Delightfully, Effect is one of those rare tools that lift you up & educate you to become a
                better developer; Sustainably and well beyond the framework itself. And it does so both
                /effect/ively and *very* gently... Also, our community is *chefs kiss*`
            ),
            User: {
                Avatar: "https://avatars.githubusercontent.com/u/1172528?v=4",
                Bio: "TypeScript Engineer",
                Name: "Sebastian Lorenz"
            }
        }
    ] as const;

type PTweetCard =
    FTweet &
    {
        Index: number;
        NumTweets: number;
    };

function TweetCard({ Index, NumTweets, Text, User }: PTweetCard): ReactNode
{
    const RootStyle: string =
        [
            "m-0",
            "shrink-0",
            "grow-0",
            "px-6",
            "w-full",
            "sm:w-[480px]",
            (Index >= NumTweets)
                ? "hidden sm:block"
                : ""
        ].join(" ");

    const InnerStyle: string =
        [
            "h-full",
            "bg-gradient-to-br",
            "from-zinc-300",
            "to-zinc-500",
            "p-px",
            "rounded-3xl"
        ].join(" ");

    const CardStyle: string =
        [
            "h-full",
            "bg-gradient-to-br",
            "from-zinc-700",
            "to-zinc-900",
            "p-6",
            "rounded-[23px]",
            "flex",
            "flex-col",
            "justify-between",
            "items-start",
            "text-zinc-200"
        ].join(" ");

    const UserStyle: string =
        [
            "relative",
            "h-12",
            "w-12",
            "shrink-0",
            "rounded-full",
            "overflow-hidden",
            "border",
            "border-white",
            "shadow-lg"
        ].join(" ");

    return (
        <div className={ RootStyle }>
            <div className={ InnerStyle }>
                <div className={ CardStyle }>
                    <p className="whitespace-pre-wrap">
                        { Text }
                    </p>
                    <div className="mt-6 flex gap-4">
                        <div className={ UserStyle }>
                            <Image
                                alt={ User.name }
                                fill
                                src={ User.avatar }
                            />
                        </div>
                        <div className="leading-snug">
                            <div className="text-white font-medium">
                                { User.name }
                            </div>
                            <div>{ User.bio }</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function TweetCarousel(): ReactNode
{
    const ContentDuplicated: ReadonlyArray<FTweet> =
        [
            ...TweetsContent,
            ...TweetsContent,
            ...TweetsContent
        ] as const;

    return ContentDuplicated.map((Tweet: FTweet, Index: number): ReactNode =>
    {
        return (
            <Tweet
                key={ Index }
                { ...{ Index, ...Tweet } }
            />
        );
    });
};

export function Tweets(): ReactNode
{
    const RootStyle: string =
        [
            "w-full",
            "max-w-screen-xl",
            "mx-auto",
            "px-4",
            "sm:px-8",
            "lg:px-16",
            "pt-32"
        ].join(" ");

    const HeaderStyle: string =
        [
            "font-display",
            "text-2xl",
            "sm:text-3xl",
            "lg:text-4xl",
            "text-white",
            "text-center",
            "mb-16"
        ].join(" ");

    return (
        <section className="relative">
            <Glow direction="down" />
            <div className={ RootStyle }>
                <h2 className={ HeaderStyle }>
                    What Reactive Event users are saying
                </h2>
                <div className="flex flex-col gap-6 sm:gap-0 sm:flex-row items-stretch sm:animate-scroll">
                    <TweetCarousel />
                </div>
            </div>
        </section>
    );
};
