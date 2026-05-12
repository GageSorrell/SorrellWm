/**
 * @file      complexity.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

/* eslint-disable @typescript-eslint/no-namespace */

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
            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 pt-10 md:pt-16">
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
                            FixedHeight={ 390 }
                            Tabs={ [
                                Examples.Without.Backend,
                                Examples.Without.Frontend,
                                Examples.Without.Types
                            ] }
                        />
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <h3 className="font-display text-2xl text-white">
                            With <span className="sr-only">Effect</span>&nbsp;&nbsp;
                            <img
                                className="h-7 inline-block"
                                src="./images/logo.png"
                                style={ { height: "1.5em", width: "1.5em" } }
                            />
                            &nbsp;&nbsp;
                            <ReactiveEvent />
                        </h3>
                        <Code
                            FixedHeight={ 390 }
                            Tabs={ [
                                Examples.With.Backend,
                                Examples.With.Frontend,
                                Examples.With.Types
                            ] }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

type FExample = Parameters<typeof Code>[0]["Tabs"][number];

type FExampleSet =
    {
        Backend: FExample;
        Frontend: FExample;
        Types: FExample;
    };

type FExamples =
    {
        With: FExampleSet;
        Without: FExampleSet;
    };

const Examples: FExamples =
    {
        With:
        {
            Backend:
            {
                Content: `import { Handler, ipcMain } from "reactive-event";
import type { DamagePayload, PlayerAttackResult } from "./Types";

function HandlePlayerAttack(Payload: DamagePayload): PlayerAttackResult { /* ... */ }

ipcMain.handle("OnAttack", async (Request: DamagePayload) =>
{
    try
    {
        const Result: PlayerAttackResult = await HandlePlayerAttack(Request);
        return Handler.succeed(Result);
    }
    catch (Error: PlayerAttackError)
    {
        return Handler.fail(Error);
    }
});\n`,
                // Highlights:
                // [
                //     {
                //         color: "#283413",
                //         lines: [ 3 ]
                //     }
                // ],
                Language: "typescript",
                Name: "main.ts"
            },
            Frontend:
            {
                Content: `import { useInvokeDeferred } from "reactive-event";
import type { DamagePayload, PlayerAttackResult } from "./Types";

function GetPayload(): DamagePayload { /* ... */ }
function OnPlayerAttack(Result: PlayerAttackResult) { /* ... */ }

const AttackButton = (): ReactNode =>
{
    const { invoke } = useInvokeDeferred();

    const AttackPlayer = async () =>
    {
        const { data, error } = await invoke("OnAttack", GetPayload());
        if (error === undefined)
        {
            OnPlayerAttack(data);
        }
        else
        {
            // Update UI based on the specific error (of type PlayerAttackError)...
        }
    };

    return <button onClick={ AttackPlayer }>Attack Player</button>;
};`,
                Highlights:
                [
                    {
                        color: "#283413",
                        lines: [ 13, 14, 15, 16, 17 ]
                    }
                ],
                Language: "typescript",
                Name: "app.tsx"
            },
            Types:
            {
                Content: `import type { EventDecl } from "reactive-event";

type OnAttack = EventDecl<
    DamagePayload,
    PlayerAttackResult,
    PlayerAttackError
>;

export type DamagePayload =
    {
        Amount: number;
        DamageType: "Melee" | "Ranged";
        Owner: string;
        Receiver: string;
    };

export type PlayerAttackResult = { /* ... */ };

export type PlayerAttackError =
    | "PlayerNotFound"
    | "ConnectionError"
    | "DebuffOverrides";

// Generated by reactive-event-cli, or written manually.
declare module "reactive-event/registrar"
{
    export interface Registrar
    {
        OnAttack: OnAttackEvent;
    };
}`,
                // Highlights:
                // [
                //     {
                //         color: "#283413",
                //         lines: [ 3 ]
                //     }
                // ],
                Language: "typescript",
                Name: "types.ts"
            }
        },
        Without:
        {
            Backend:
            {
                Content: `import { ipcMain } from "electron";
import type { DamagePayload, PlayerAttackResult } from "./Types";

function HandlePlayerAttack(Payload: DamagePayload): PlayerAttackResult { /* ... */ }

ipcMain.handle("OnAttack", async (Event, ...Arguments) =>
{
    try
    {
        // Validate Arguments and extract payload as zeroth argument.
        // ...
        const Request: DamagePayload = Arguments[0] as DamagePayload;
        const Result: PlayerAttackResult = await HandlePlayerAttack(Request);
        return Result;
    }
    catch (Error: PlayerAttackError)
    {
        // Now, the renderer has to determine whether the response is a
        // PlayerAttackResult, a PlayerAttackError, or some other
        // type of error...
        return Error;
    }
    catch (Error: unknown)
    {
        // No convenient or built-in way to convey error state to the renderer...
    }
});\n`,
                // Highlights:
                // [
                //     {
                //         color: "#283413",
                //         lines: [ 4, 5, 9, 10, 12, 13, 14, 15, 16, 17 ]
                //     }
                // ],
                Language: "typescript",
                Name: "main.ts"
            },
            Frontend:
            {
                Content: `import type { DamagePayload, PlayerAttackResult } from "./Types";

function GetPayload(): DamagePayload { /* ... */ }
function OnPlayerAttack(Result: PlayerAttackResult) { /* ... */ }

const AttackButton = (): ReactNode =>
{
    const AttackPlayer = () =>
    {
        // Assume that ipcRenderer.invoke has been exposed via a preload script...
        window.electron.ipcRenderer.invoke("OnAttack", GetPayload()).then(
            (Event, ...Arguments) =>
            {
                if (Arguments.length > 0)
                {
                    const InResult: unknown = Arguments[0];
                    // Ensure that the Result is actually a PlayerAttackResult.
                    // ...
                    const Result: PlayerAttackResult = InResult as PlayerAttackResult;
                    OnPlayerAttack(Result);

                    // Or, if InResult is not a PlayerAttackResult, there is no convenient
                    // way to determine/handle error state...
                }
                else
                {
                    // No convenient way to determine/handle error state...
                }
        });
    };

    return <button onClick={ AttackPlayer }>Attack Player</button>;
};`,
                Highlights:
                [
                    {
                        color: "#283413",
                        lines: [ 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]
                    }
                ],
                Language: "typescript",
                Name: "app.tsx"
            },
            Types:
            {
                Content: `export type DamagePayload =
    {
        Amount: number;
        DamageType: "Melee" | "Ranged";
        Owner: string;
        Receiver: string;
    };

export type PlayerAttackResult = { /* ... */ };

export type PlayerAttackError =
    | "PlayerNotFound"
    | "ConnectionError"
    | "DebuffOverrides";`,

                // Highlights:
                // [
                //     {
                //         color: "#283413",
                //         lines: [ 4, 5, 9, 10, 12, 13, 14, 15, 16, 17 ]
                //     }
                // ],
                Language: "typescript",
                Name: "types.ts"
            }
        }
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
