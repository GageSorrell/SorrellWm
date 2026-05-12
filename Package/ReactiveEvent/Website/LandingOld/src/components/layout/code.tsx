/**
 * @file      code.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { type ReactNode, useState } from "react";
import { Icon } from "../icons";
import hljs from "highlight.js/lib/common";
import { track } from "@vercel/analytics";

export type FCodeTab =
    {
        Content: string;
        Highlights?: Array<{ color: string; lines: Array<number> }>;
        Language?: string;
        Name: string;
    };

export type PCode =
    {
        FixedHeight?: number,
        Tabs: Array<FCodeTab>;
        Terminal?: { run: string; command: string; result: string };
    };

export function Code({ FixedHeight, Tabs, Terminal }: PCode): ReactNode
{
    const [ Running, SetRunning ] = useState<boolean>(false);
    const runSnippet = () =>
    {
        SetRunning(true);
        setTimeout(() => SetRunning(false), 1000);
        track("run-snippet", Terminal);
    };

    const RootClass: string =
        [
            "w-full",
            "bg-gradient-to-br",
            "from-zinc-500",
            "to-zinc-800",
            "p-px",
            "rounded-xl",
            "overflow-hidden",
            "h-full"
        ].join(" ");

    return (
        <div className={ RootClass }>
            <RadixTabs.Root
                className="bg-zinc-950 rounded-[11px] overflow-hidden h-full flex flex-col justify-between"
                defaultValue={ Tabs[0].Name }>
                <div>
                    <div className="flex border-b border-zinc-800">
                        <div className="h-10 flex items-center gap-2 px-3 border-r border-zinc-800">
                            <div className="h-3 w-3 rounded-full bg-zinc-700" />
                            <div className="h-3 w-3 rounded-full bg-zinc-700" />
                            <div className="h-3 w-3 rounded-full bg-zinc-700" />
                        </div>
                        <RadixTabs.List className="flex">
                            {Tabs.map(({ Name }, Index: number) => (
                                <RadixTabs.Trigger
                                    className="h-10 px-3 flex items-center font-mono text-xs border-r border-zinc-800 data-[state=active]:text-white"
                                    key={ Index }
                                    value={ Name }>
                                    { Name }
                                </RadixTabs.Trigger>
                            ))}
                        </RadixTabs.List>
                    </div>
                    <div
                        className={ `${Terminal ? "pb-8" : ""} ${
                            FixedHeight ? "" : "max-h-96"
                        } overflow-y-auto` }
                        style={ { height: FixedHeight } }>
                        {
                            Tabs.map(({ Name, Content, Highlights, Language }: FCodeTab, Index: number) =>
                            {
                                const Markup: string = hljs.highlightAuto(
                                    Content,
                                    Language ? [ Language ] : undefined
                                ).value;
                                const LineCount: number = (Markup.match(/\n/g) || [ ]).length + 1;
                                return (
                                    <RadixTabs.Content
                                        key={ Index }
                                        value={ Name }
                                        className="relative font-mono text-sm flex flex-col min-h-full data-[state=inactive]:absolute">
                                        <ul className="absolute inset-0 text-zinc-600 py-3">
                                            {
                                                [ ...new Array(LineCount) ].map((e, InnerIndex: number) =>
                                                {
                                                    let backgroundColor: string = "transparent";
                                                    Highlights?.forEach((highlight) =>
                                                    {
                                                        if (highlight.lines.includes(InnerIndex + 1))
                                                        {
                                                            backgroundColor = highlight.color;
                                                        }
                                                    });
                                                    return (
                                                        <li
                                                            className="relative"
                                                            key={ InnerIndex }>
                                                            <div
                                                                className="absolute inset-y-0 left-0 w-full"
                                                                style={ { backgroundColor } }
                                                            />
                                                            <span className="relative block w-12 pr-4 text-right">
                                                                { InnerIndex + 1 }
                                                            </span>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                        <div className="relative w-full py-3 pl-12 grow flex flex-col">
                                            <div className="w-full overflow-x-auto grow">
                                                <pre style={ { contain: "none" } }>
                                                    <code
                                                        className="block"
                                                        dangerouslySetInnerHTML={ {
                                                            __html: Markup.replaceAll("\n", "<br/>")
                                                        } }
                                                    />
                                                </pre>
                                            </div>
                                        </div>
                                    </RadixTabs.Content>
                                );
                            })
                        }
                    </div>
                </div>
                {Terminal && (
                    <div className="relative border-t border-zinc-800 py-8">
                        <button
                            className={
                                "absolute -top-5 left-12 inline-flex h-10 rounded-xl p-px " +
                                "bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-lg"
                            }
                            onClick={ () => runSnippet() }>
                            <div className={
                                "flex h-full items-center gap-2 px-6 font-medium rounded-[11px] " +
                                "bg-gradient-to-br from-zinc-700 to-zinc-900 text-white"
                            }>
                                <Icon
                                    className="h-3.5"
                                    name="play"
                                />
                                <span>{ Terminal.run }</span>
                            </div>
                        </button>
                        <div className="font-mono text-white text-sm flex py-3 overflow-x-auto">
                            <div className="text-zinc-600 w-12 shrink-0 text-right pr-4">
                                $
                            </div>
                            <div>
                                <div>{Terminal.command}</div>
                                <div className="relative">
                                    <pre className={ `${Running ? "opacity-0" : ""}` }>
                                        <code>
                                            <br />
                                            {Terminal.result}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </RadixTabs.Root>
        </div>
    );
};
