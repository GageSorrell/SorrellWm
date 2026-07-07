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

import type * as Function from "effect/Function";
import type * as Prompt from "../Prompt.js";
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
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
//     | BeginDocEvent
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
//     | BeginDocEvent
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

        export type Doc =
            {
                readonly Content: Prompt.Operand.Doc["Content"];
                readonly Component: Prompt.Operand.Doc["Component"];
            };
    }

    export type Begin = Data.TaggedEnum<{
        readonly "Begin.Field": Begin.Field;
        readonly "Begin.Doc": Begin.Doc;
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

// export interface BeginDocEvent extends Pick<Prompt.Operand.Doc, "Content" | "Component">
// {
//     readonly _tag: "BeginDocEvent";
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

// export const BeginDocEvent = ({ Component, Content }: Omit<BeginDocEvent, "_tag">): BeginDocEvent =>
// {
//     return {
//         _tag: "BeginDocEvent",

//         Component,
//         Content
//     };
// };

export interface BridgeImpl
{
    readonly Frontend: Part<Frontend.Event>;
    readonly Backend: Part<Backend.Event>;
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

export class Bridge extends Context.Service<Bridge, BridgeImpl>()(TypeId)
{
    static readonly layer: Layer.Layer<Bridge> = Layer.effect(
        Bridge,
        Effect.gen(function* ()
        {
            const capacity: 512 = 512 as const;
            const BackendEvents: PubSub.PubSub<Backend.Event> =
                yield* PubSub.bounded<Backend.Event>({ capacity });

            const FrontendEvents: PubSub.PubSub<Frontend.Event> =
                yield* PubSub.bounded<Frontend.Event>({ capacity });

            const ShutdownBridge: Function.LazyArg<Effect.Effect<[ void, void ]>> =
                () => Effect.all([
                    PubSub.shutdown(BackendEvents),
                    PubSub.shutdown(FrontendEvents)
                ]);

            yield* Effect.addFinalizer(ShutdownBridge);

            const Backend: Part<Backend.Event> =
                {
                    Publish: (Event: Backend.Event) => Effect.gen(function* ()
                    {
                        yield* PubSub.publish(BackendEvents, Event);
                    }),
                    Stream: Stream.fromPubSub(BackendEvents),
                    Subscribe: yield* PubSub.subscribe(BackendEvents)
                } as const;

            const Frontend: Part<Frontend.Event> =
                {
                    Publish: (Event: Frontend.Event) => pipe(
                        PubSub.publish(FrontendEvents, Event),
                        Effect.asVoid
                    ),
                    Stream: Stream.fromPubSub(FrontendEvents),
                    Subscribe: yield* PubSub.subscribe(FrontendEvents)
                } as const;

            return Bridge.of({ Backend, Frontend });
        })
    );
}

export const Make = (Events: BridgeImpl): Effect.Effect<InkEventBridge, never, Scope.Scope> =>
    Effect.gen(function* ()
    {
        const Listeners: Set<(Event: Backend.Event) => void> =
            new Set<(Event: Backend.Event) => void>();

        yield* pipe(
            Events.Backend.Stream,
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
                Effect.runFork(Events.Frontend.Publish(Event));
            },

            Subscribe: (Listener: (Value: Backend.Event) => void) =>
            {
                Listeners.add(Listener);

                return () => void Listeners.delete(Listener);
            }
        };
    });
