/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Event
 * @internal
 *
 * @file      Event.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Prompt from "../Prompt.js";
import { Context, Data, Effect, Layer, PubSub, type Scope, Stream, pipe } from "effect";
import {
    type PropsWithChildren,
    type Context as ReactContext,
    type ReactNode,
    type RefObject,
    createContext,
    useContext,
    useEffect,
    useRef
} from "react";
import type { Field } from "../Component/index.ts";
import type { Mutable } from "effect/Types";

export const TypeId: string = "~sorrell/effect-ink/Internal/Event";

// export interface InkEventDefinition extends Data.TaggedEnum.WithGenerics<1>
// {
//     readonly State: this["A"];
// }

// export type InkEvent<StateType, A> = Data.TaggedEnum<{
//     //     readonly NoOp: { };
//     readonly NextFrame: { readonly State: StateType; };
//     readonly Submit: { readonly value: A; };
// }>;

// export type InkEvent =
//     | BeginPromptEvent
//     | BeginProseEvent
//     | Prompt.AnyAction
//     | InputEvent;

export interface SuspendEvent
{
    readonly _tag: "SuspendEvent";
}

export interface SuspensionFinishedEvent
{
    readonly _tag: "SuspensionFinishedEvent";
}

// export type BackendEvent =
//     | SuspendEvent
//     | BeginPromptEvent
//     | BeginProseEvent
//     | Prompt.AnyAction;

// export type FrontendEvent =
//     | SuspensionFinishedEvent
//     | InputEvent;

export interface InkEventBridge
{
    readonly Publish: (Event: Frontend.Event) => void;
    readonly Subscribe: (Listener: (Event: Backend.Event) => void) => () => void;
}

export namespace Backend
{
    export namespace Begin
    {
        export type Field =
            {
                readonly Options: unknown;
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                readonly Component: Field.Component<any, any>;
                readonly Keybinds: Prompt.Keybinds | undefined;
            };

        export type Prose =
            {
                readonly Content: Prompt.Operand.Prose["Content"];
                readonly Component: Prompt.Operand.Prose["Component"];
            };
    }

    export type Begin = Data.TaggedEnum<{
        readonly "Begin.Field": Begin.Field;
        readonly "Begin.Prose": Begin.Prose;
    }>;

    export type Suspend = Data.TaggedEnum<{
        readonly "Suspend.Start": { };
        readonly "Suspend.End": { };
    }>;

    export type Constructor =
        {
            readonly Action: typeof Prompt.Action;
            readonly Begin: Data.TaggedEnum.Constructor<Begin>;
            readonly Suspend: Data.TaggedEnum.Constructor<Suspend>;
        };

    export type Event =
        | Begin
        | Prompt.Action<unknown, unknown>
        | Suspend;
}

export const Frontend: Data.TaggedEnum.Constructor<Frontend.Event> = Data.taggedEnum<Frontend.Event>();

export const Backend: Backend.Constructor =
    {
        // Action: Prompt.Action,
        Begin: Data.taggedEnum<Backend.Begin>(),
        Suspend: Data.taggedEnum<Backend.Suspend>()
    } as const as Backend.Constructor;

import("../Prompt.js").then((PromptModule: typeof Prompt) =>
{
    (Backend as Mutable<Backend.Constructor>).Action = PromptModule.Action;
});

export namespace Frontend
{
    export type Input = Omit<Prompt.HandlerArgument<never>, "Publish" | "State">;
    export type Event = Data.TaggedEnum<{
        readonly Input: Input;
        // readonly Input: InputEvent;
        readonly OnSuspended: { };
    }>;
}

interface Part<EventType>
{
    readonly Publish: (Event: EventType) => Effect.Effect<void>;
    readonly Stream: Stream.Stream<EventType>;
    readonly Subscribe: PubSub.Subscription<EventType>;
}

// export interface BeginPromptEvent
// {
//     readonly _tag: "BeginPromptEvent";
//     readonly Options: unknown;
//     /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
//     readonly Component: Field.Component<any, any>;
//     readonly Keybinds: Prompt.Keybinds | undefined;
// }

// export interface BeginProseEvent extends Pick<Prompt.Operand.Prose, "Content" | "Component">
// {
//     readonly _tag: "BeginProseEvent";
// }

// export const BeginPromptEvent = ({
//     Keybinds,
//     Options,
//     Component
// }: Omit<BeginPromptEvent, "_tag">): BeginPromptEvent =>
// {
//     return {
//         _tag: "BeginPromptEvent",

//         Component,
//         Keybinds,
//         Options
//     };
// };

// export const BeginProseEvent = ({ Component, Content }: Omit<BeginProseEvent, "_tag">): BeginProseEvent =>
// {
//     return {
//         _tag: "BeginProseEvent",

//         Component,
//         Content
//     };
// };

export interface EventBridgePubSubImpl
{
    readonly Input: Part<Frontend.Event>;
    readonly ActionOptions: Part<Backend.Event>;
}

const EmptyContext: InkEventBridge =
    {
        Publish: (_Event: Frontend.Event) => { },
        Subscribe: (_Listener: (_Event: Backend.Event) => void) => () => { }
    } as const;

const InkEventContext: ReactContext<InkEventBridge> = createContext<InkEventBridge>(EmptyContext);

export type ProviderProps =
    PropsWithChildren<{
        readonly Bridge: InkEventBridge;
    }>;

export const Provider = ({ Bridge, children }: ProviderProps): ReactNode =>
{
    return (
        <InkEventContext.Provider value={ Bridge }>
            { children }
        </InkEventContext.Provider>
    );
};

export const UseEvents = (): readonly [ InkEventBridge ] =>
{
    const Bridge: InkEventBridge = useContext(InkEventContext);

    // Effect.runSync(Console.log("Bridge!!!"));

    if (Bridge === undefined)
    {
        throw new Error("UseEvents was called in a component that is not wrapped in a <InkEventProvider />.");
    }

    // Effect.runSync(Console.log("Bridge is DEFINED!!!"));

    return [ Bridge ] as const;
};

export const UseEvent = (Handler: (Event: Backend.Event) => void): void =>
{
    const [ Bridge ] = UseEvents();
    const HandlerReference: RefObject<typeof Handler> = useRef(Handler);

    useEffect(() =>
    {
        HandlerReference.current = Handler;
    }, [ Handler ]);

    useEffect(() =>
    {
        return Bridge.Subscribe((Event: Backend.Event) =>
        {
            // Effect.runSync(Console.log("FooFooHandler"));
            // Effect.runSync(Console.log("FooFoo"));
            HandlerReference.current(Event);
        });
    }, [ Bridge ]);
};

export class EventBridgePubSub extends Context.Service<EventBridgePubSub, EventBridgePubSubImpl>()(TypeId)
{
    static readonly layer: Layer.Layer<EventBridgePubSub> = Layer.effect(
        EventBridgePubSub,
        Effect.gen(function* ()
        {
            const capacity: 512 = 512 as const;
            const ActionOptionsEvents: PubSub.PubSub<Backend.Event> =
                yield* PubSub.bounded<Backend.Event>({ capacity });

            const InputEvents: PubSub.PubSub<Frontend.Event> =
                yield* PubSub.bounded<Frontend.Event>({ capacity });

            yield* Effect.addFinalizer(() =>
            {
                return Effect.all([
                    PubSub.shutdown(ActionOptionsEvents),
                    PubSub.shutdown(InputEvents)
                ]);
            });

            const ActionOptions: Part<Backend.Event> =
                {
                    Publish: (Event: Backend.Event) => Effect.gen(function* ()
                    {
                        yield* PubSub.publish(ActionOptionsEvents, Event);
                    }),
                    Stream: Stream.fromPubSub(ActionOptionsEvents),
                    Subscribe: yield* PubSub.subscribe(ActionOptionsEvents)
                } as const;

            const Input: Part<Frontend.Event> =
                {
                    Publish: (Event: Frontend.Event) => pipe(
                        PubSub.publish(InputEvents, Event),
                        Effect.asVoid
                    ),
                    Stream: Stream.fromPubSub(InputEvents),
                    Subscribe: yield* PubSub.subscribe(InputEvents)
                } as const;

            return EventBridgePubSub.of({
                ActionOptions,
                Input
            });
        })
    );
}

// @TODO
// Pick back up by making the service that ChatGPT recommends (rather than)
// just implementing a singleton object with no service.  Then, make the Runtime
// use this service.

// export const Make = () => Effect.gen(function* ()
//     Events: InkEvents
// ): Effect.Effect<InkEventBridge, never, Scope.Scope> =>
//     Effect.gen(function* ()
//     {
//         const Listeners = new Set<(Event: UiEvent) => void>();

//         yield* Events.Subscribe.pipe(
//             Stream.runForEach((Event) =>
//                 Effect.sync(() =>
//                 {
//                     for (const Listener of Listeners)
//                     {
//                         Listener(Event);
//                     }
//                 })
//             ),
//             Effect.forkScoped
//         );

//         return {
//             Publish: (Event) =>
//             {
//                 Effect.runFork(Events.Publish(Event));
//             },

//             Subscribe: (Listener) =>
//             {
//                 Listeners.add(Listener);

//                 return () =>
//                 {
//                     Listeners.delete(Listener);
//                 };
//             }
//         };
//     });

export const Make = (Events: EventBridgePubSubImpl): Effect.Effect<InkEventBridge, never, Scope.Scope> =>
    Effect.gen(function* ()
    {
        const Listeners: Set<(Event: Backend.Event) => void> =
            new Set<(Event: Backend.Event) => void>();

        yield* pipe(
            Events.ActionOptions.Stream,
            Stream.runForEach((Event: Backend.Event) =>
                Effect.sync(() =>
                {
                    for (const Listener of Listeners)
                    {
                        Listener(Event);
                    }
                })
            ),
            Effect.forkScoped({ startImmediately: true })
        );

        return {
            Publish: (Event: Frontend.Event) =>
            {
                Effect.runFork(Events.Input.Publish(Event));
            },

            Subscribe: (Listener: (Value: Backend.Event) => void) =>
            {
                Listeners.add(Listener);

                return () =>
                {
                    Listeners.delete(Listener);
                };
            }
        };
    });
