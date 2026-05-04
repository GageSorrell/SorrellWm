/**
 * @file      complexity.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import { type ReactNode, type RefObject, useRef } from "react";
import { Code } from "../layout/code";
import { ReactiveEvent } from "../Miscellaneous/ReactiveEvent";

export function Complexity(): ReactNode
{
    const SectionRef: RefObject<HTMLElement | null> = useRef<HTMLElement>(null);

    return (
        <section
            className="relative"
            ref={ SectionRef }>
            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 pt-24">
                <h2 className="font-display mb-6 text-2xl sm:text-3xl lg:text-4xl text-white text-center">
                    { Content.heading }
                </h2>
                <p className="text-center max-w-xl mx-auto">{ Content.text }</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-6 pt-12">
                    <div className="flex flex-col items-center gap-6">
                        <h3 className="font-display text-2xl text-white">
                            Without Reactive Event
                        </h3>
                        <Code
                            fixedHeight={ 390 }
                            tabs={ [ WithoutEffectExample ] }
                        />
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <h3 className="font-display text-2xl text-white">
                            With <span className="sr-only">Effect</span>&nbsp;
                            <img
                                className="h-7 inline-block"
                                src="./images/logo.png"
                                style={ { height: "1.5em", width: "1.5em" } }
                            />
                            &nbsp;
                            <ReactiveEvent />
                        </h3>
                        <Code
                            fixedHeight={ 390 }
                            tabs={ [ { ...WithEffectExample, language: "typescript" } ] }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

const WithoutEffectCodeSnippet: string = `async function getTodo(
  id: number
): Promise<
  | { ok: true; todo: any }
  | { ok: false; error: "InvalidJson" | "RequestFailed" }
> {
  try {
    const response = await fetch(\`/todos/\${id}\`)
    if (!response.ok) throw new Error("Not OK!")
    try {
      const todo = await response.json()
      return { ok: true, todo }
    } catch (jsonError) {
      return { ok: false, error: "InvalidJson" }
    }
  } catch (error) {
    return { ok: false, error: "RequestFailed" }
  }
}      `;

const WithEffectCodeSnippet: string = `const getTodo = (
  id: number
): Effect.Effect<unknown, HttpClientError> =>
  httpClient.get(\`/todos/\${id}\`).pipe(
    Effect.andThen((response) => response.json)
  )`;

const WithoutEffectExample: Parameters<typeof Code>[0]["tabs"][number] =
    {
        content: WithoutEffectCodeSnippet,
        highlights:
        [
            {
                color: "#283413",
                lines: [ 4, 5, 9, 10, 12, 13, 14, 15, 16, 17 ]
            }
        ],
        name: "index.ts"
    };

const WithEffectExample: Parameters<typeof Code>[0]["tabs"][number] =
    {
        content: WithEffectCodeSnippet,
        highlights: [
            {
                color: "#283413",
                lines: [ 3 ]
            }
        ],
        name: "index.ts"
    };

/* eslint-disable-next-line @typescript-eslint/typedef */
const Content =
    {
        features:
        {
            color: "#283413",
            description: "Keep track of possible errors and treat them as values.",
            name: "Error Handling"
        },
        heading: "Type-safety at Every Step",
        text: "Define your events as types, and wield the benefits at every step."
    };
