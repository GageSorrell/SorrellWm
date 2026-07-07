/**
 * The entrypoint of the {@link \@sorrell/effect-ink/Component} module for
 * {@link \@sorrell/effect-ink/Prompt}.
 *
 * @module @sorrell/effect-ink/Component/Prompt
 *
 * @file      Prompt.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Doc from "./Doc/Doc.js";
import * as Event from "../Internal/Event.tsx";
import * as Field from "./Field/Field.tsx";
import * as Function from "effect/Function";
import * as Ink from "ink";
import * as Option from "effect/Option";
import * as Prompt from "../Prompt.ts";
import * as React from "react";
import { Hash } from "effect";
import { KeybindsFooter } from "./Footer.tsx";
import { pipe } from "effect/Function";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type AnyDoc = Doc.Doc<any>;

/** @internal */
export const RootComponent = (): React.ReactNode =>
{
    const [ Atoms, SetAtoms ] =
        React.useState<ReadonlyArray<Field.Field | AnyDoc>>([ {
            Component: (_Props: unknown) => undefined,
            ErrorMessage: Option.none(),
            IsSubmitted: false,
            IsValidating: false,
            Keybinds: { },
            Options: { },
            State: Option.none()
        } ]);

    const [ Bridge ] = Event.UseEvents();

    const [ KeybindsOverride, SetKeybindsOverride ] = React.useState<Prompt.Keybinds | undefined>(undefined);

    Ink.useInput((Input: string, Key: Ink.Key) =>
    {
        Bridge.Publish({
            _tag: "Input",

            Input: Input !== "" ? Option.some(Input) : Option.none(),
            Key
        });
    });

    const UpdateTail = (Callback: (OldTail: Field.Field | AnyDoc) => Field.Field | AnyDoc) =>
    {
        SetAtoms((Old: ReadonlyArray<Field.Field | AnyDoc>) =>
        {
            const Tail: Field.Field | AnyDoc = Old[Old.length - 1];
            return [ ...(Old.slice(0, Old.length - 1)), Callback({ ...Tail }) ];
        });
    };

    const App: Ink.AppProps = Ink.useApp();

    const SuspensionHandle: React.RefObject<Ink.TerminalSuspension | undefined> =
        React.useRef<Ink.TerminalSuspension | undefined>(undefined);

    Event.UseEvent((InEvent: Event.Backend.Event): void =>
    {
        if (InEvent._tag === "Begin.Field")
        {
            SetAtoms((Old: ReadonlyArray<Field.Field | AnyDoc>) => [
                ...Old,
                {
                    Component: InEvent.Component,
                    ErrorMessage: Option.none(),
                    IsSubmitted: false,
                    IsValidating: false,
                    Keybinds: InEvent.Keybinds,
                    Options: InEvent.Options,
                    State: Option.none()
                }
            ]);
        }
        else if (InEvent._tag === "Begin.Doc")
        {
            SetAtoms((Old: ReadonlyArray<Field.Field | AnyDoc>) => [
                ...Old,
                {
                    Component: InEvent.Component,
                    Content: InEvent.Content
                }
            ]);
        }
        else if (InEvent._tag === "Suspend.Start")
        {
            App.suspendTerminal().then((Value: Ink.TerminalSuspension) =>
            {
                SuspensionHandle.current = Value;
                Bridge.Publish({ _tag: "OnSuspended" });
                // @TODO Implement in `Prompt` module, in `runLoop`, `TempFile` ctor the
                // ability to fire the SuspendEvent, and receive/handle `SuspensionFinishedEvent`.
                // Also add a `ResumeEvent` to fire from the `Prompt` module.
            });
        }
        else if (InEvent._tag === "Suspend.End")
        {
            // @TODO Resume the `ink` rendering
        }
        else
        {
            pipe(
                InEvent,
                Prompt.Action.$match({
                    ClearError: (_Value: unknown) =>
                    {
                        UpdateTail((Old: Field.Field | AnyDoc) =>
                        {
                            // Effect.runSync(Console.log("ClearError"));
                            return {
                                ...Old,
                                ErrorMessage: Option.none()
                            };
                        });
                    },
                    Fail: ({ Message }: { readonly Message: React.ReactNode; }) =>
                    {
                        UpdateTail((Old: Field.Field | AnyDoc) =>
                        {
                            // Effect.runSync(Console.log("Fail"));
                            return {
                                ...Old,
                                ErrorMessage: Option.some(Message),
                                IsValidating: false
                            };
                        });
                    },
                    NextFrame: ({ State }: { readonly State: unknown; }) =>
                    {
                        // Effect.runSync(Console.log("NextFrame Callback"));
                        UpdateTail((OldTail: Field.Field | AnyDoc) =>
                        {
                            return {
                                ...OldTail,
                                State: Option.some(State)
                            };
                        });
                    },
                    NoOp: Function.identity,
                    SetKeybinds: ({ Keybinds: Out }: { readonly Keybinds: Prompt.Keybinds; }) =>
                    {
                        SetKeybindsOverride((_Old: Prompt.Keybinds | undefined) => Out);
                    },
                    StartValidation: (_Value: unknown) =>
                    {
                        UpdateTail((OldTail: Field.Field | AnyDoc) =>
                        {
                            // Effect.runSync(Console.log("StartValidation"));
                            return {
                                ...OldTail,
                                ErrorMessage: Option.none(),
                                IsValidating: true
                            };
                        });
                    },
                    Submit: ({ value }: { readonly value: unknown; }) =>
                    {
                        UpdateTail((OldTail: Field.Field | AnyDoc) =>
                        {
                            return {
                                ...OldTail,
                                ErrorMessage: Option.none(),
                                IsSubmitted: true,
                                IsValidating: false,
                                State: Option.some(value)
                            };
                        });
                    }
                })
            );
        }
    });

    const RenderedAtoms: React.ReactNode = Atoms.map((
        Atom: Field.Field | AnyDoc,
        Index: number
    ) =>
    {
        if ("IsSubmitted" in Atom)
        {
            const {
                Component,
                ErrorMessage,
                IsSubmitted,
                IsValidating,
                Options,
                State
            } = Atom;

            const key: React.Key = Hash.array([ State, Index ]).toString();

            return Option.isSome(State)
                ? <Field.Field
                    Component={ Component }
                    Props={ {
                        ErrorMessage,
                        IsSubmitted: IsSubmitted || Index < Atoms.length - 1,
                        IsValidating,
                        Options,
                        State: State.value
                    } }
                    key={ key }
                />
                : undefined;
            //     : <Ink.Text key={ key }></Ink.Text>;
        }
        else
        {
            const { Component, Content } = Atom;
            return <Doc.Doc
                key={ Index }
                { ...{ Component, Content } }
            />;
        }
    });

    const LastAtom: Field.Field | AnyDoc | undefined = Atoms[Atoms.length - 1];

    const Keybinds: Prompt.Keybinds | undefined =
        KeybindsOverride !== undefined
            ? KeybindsOverride
            : LastAtom !== undefined && "Keybinds" in LastAtom
                ? LastAtom.Keybinds
                : { };

    return (
        <Ink.Box
            flexDirection="column"
            maxHeight="100%">
            <Ink.Box
                flexDirection="column"
                flexGrow={ 1 }>
                { RenderedAtoms }
            </Ink.Box>
            <KeybindsFooter { ...{ Keybinds } } />
        </Ink.Box>
    );
};
