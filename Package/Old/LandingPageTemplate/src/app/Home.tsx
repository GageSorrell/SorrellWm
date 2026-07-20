/**
 * @file      Home.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

"use client";

import { A, Div, Main } from "@sorrell/react/client";
import { CodeEditorAnimationPlayer } from "../components/CodeEditor/CodeEditorPlayer";
import Image from "next/image";
import { Intellisense } from "./Intellisense";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home(): ReactNode
{
    const MainStyle: ReadonlyArray<string> =
        [
            "flex",
            "flex-1",
            "w-full",
            "max-w-3xl",
            "flex-col",
            "items-center",
            "justify-between",
            "py-32",
            "px-16",
            "bg-white",
            "dark:bg-black",
            "sm:items-start"
        ] as const;

    const RootStyle: ReadonlyArray<string> =
        [
            "flex",
            "flex-col",
            "flex-1",
            "items-center",
            "justify-center",
            "bg-zinc-50",
            "font-sans",
            "dark:bg-black"
        ] as const;

    const LinkStyle: ReadonlyArray<string> =
        [
            "flex",
            "h-12",
            "w-full",
            "items-center",
            "justify-center",
            "rounded-full",
            "border",
            "border-solid",
            "border-black/[.08]",
            "px-5",
            "transition-colors",
            "hover:border-transparent",
            "hover:bg-black/[.04]",
            "dark:border-white/[.145]",
            "dark:hover:bg-[#1a1a1a]",
            "md:w-[158px]"
        ] as const;

    const InitialSuggestions: ReactNode = Intellisense({
        Markdown: "handle(**channel: string**, listener: (event: IpcMainInvokeEvent, ...args: any[]) =&gt; " +
        "(Promise&lt;any&gt;) | (any)): void"
    });

    const ListenerIntellisense: ReactNode = Intellisense({
        Markdown: "handle(channel: string, **listener: (event: IpcMainInvokeEvent, ...args: any[]) =&gt; " +
        "(Promise&lt;any&gt;) | (any)**): void"
    });

    const EventArgumentIntellisense: ReactNode = Intellisense({
        Markdown: "listener(**event: IpcMainInvokeEvent**, ...args: any[]): any"
    });

    const ArgumentsArgumentIntellisense: ReactNode = Intellisense({
        Markdown: "listener(event: IpcMainInvokeEvent, **...args: any[]**): any"
    });

    return (
        <Div className={ RootStyle }>
            <ThemeToggle />
            <Main className={ MainStyle }>
                <CodeEditorAnimationPlayer
                    Changes={ [
                        {
                            Duration: 2000,
                            Type: "Pause"
                        },
                        {
                            Intellisense: InitialSuggestions,
                            Position: [ 0, "ipcMain.handle(".length ],
                            Text: "\"GetSettings\"",
                            Type: "Add"
                        },
                        {
                            Intellisense: ListenerIntellisense,
                            // Position: [ 0, "ipcMain.handle(\"GetSettings\"".length ],
                            Position: [ 1, 0 ],
                            Text: ", (",
                            Type: "Add"
                        },
                        {
                            Intellisense: EventArgumentIntellisense,
                            LineIndex: 0,
                            // Position: [ 0, "ipcMain.handle(\"GetSettings\", (".length ],
                            // Text: "Event",
                            Type: "AddLine"
                        },
                        {
                            Intellisense: EventArgumentIntellisense,
                            LineIndex: 0,
                            // Position: [ 0, "ipcMain.handle(\"GetSettings\", (".length ],
                            // Text: "Event",
                            Type: "AddLine"
                        },
                        {
                            Intellisense: EventArgumentIntellisense,
                            Position: [ 0, 0 ],
                            // Position: [ 0, "ipcMain.handle(\"GetSettings\", (".length ],
                            Text: "import { ipcMain } from \"reactive-event\";",
                            // Text: "Event",
                            Type: "Add"
                        },
                        {
                            Intellisense: EventArgumentIntellisense,
                            Position: [ 0, "ipcMain.handle(\"GetSettings\"".length ],
                            // Position: [ 0, "ipcMain.handle(\"GetSettings\", (".length ],
                            Text: ", Event",
                            // Text: "Event",
                            Type: "Add"
                        },
                        {
                            Intellisense: ArgumentsArgumentIntellisense,
                            // Position: [ 0, "ipcMain.handle(\"GetSettings\", (Event".length ],
                            Position: [ 0, "ipcMain.handle(\"GetSettings\", Event".length ],
                            SpeedScalar: 0.5,
                            Text: ", ...Arguments",
                            Type: "Add"
                        }
                    ] }
                    CursorPosition={ [ 0, "ipcMain.handle(".length ] }
                    InitialCode="ipcMain.handle("
                    InitialIntellisense={ InitialSuggestions }
                />
                {/* <CodeEditorAnimationPlayer
                    Code={ [
                        "type User =",
                        "    {",
                        "        Name: string;",
                        "        Email: string;",
                        "    };"
                    ].join("\n") }
                    CursorPosition={ [ 2, 20 ] }
                /> */}
                <Image
                    alt="Next.js logo"
                    className="dark:invert"
                    height={ 20 }
                    priority
                    src="/misc/next.svg"
                    width={ 100 }
                />
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1
                        className={
                            "max-w-xs text-3xl font-semibold leading-10 tracking-tight " +
                            "text-black dark:text-zinc-50"
                        }>
                        To get started, edit the page.tsx file.
                    </h1>
                    <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Looking for a starting point or more instructions? Head over to{" "}
                        <a
                            className="font-medium text-zinc-950 dark:text-zinc-50"
                            href={
                                "https://vercel.com/templates?framework=next.js&utm_source=create-next-app" +
                                "&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            }>
                            Templates
                        </a>{" "}
                        or the{" "}
                        <a
                            className="font-medium text-zinc-950 dark:text-zinc-50"
                            href={
                                "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir" +
                                "-template-tw&utm_campaign=create-next-app"
                            }>
                            Learning
                        </a>{" "}
                        center.
                    </p>
                </div>
                <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
                    <a
                        className={
                            "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground " +
                            "px-5 text-background transition-colors hover:bg-[#383838] " +
                            "dark:hover:bg-[#ccc] md:w-39.5"
                        }
                        href={
                            "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-" +
                            "tw&utm_campaign=create-next-app"
                        }
                        rel="noopener noreferrer"
                        target="_blank">
                        <Image
                            alt="Vercel logomark"
                            className="dark:invert"
                            height={ 16 }
                            src="/misc/vercel.svg"
                            width={ 16 }
                        />
                        Deploy Now
                    </a>
                    <A
                        className={ LinkStyle }
                        rel="noopener noreferrer"
                        target="_blank">
                        Documentation
                    </A>
                </div>
            </Main>
        </Div>
    );
}
