/**
 * Use the {@link \@sorrell/effect-ink/Renderer} module via a handle, to manage
 * the lifetime of the {@link https://www.npmjs.com/package/ink | ink} session.
 *
 * @module @sorrell/effect-ink/Runtime
 *
 * @file      Runtime.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Component from "./Component/index.js";
import * as Event from  "./Internal/Event.tsx";
import * as Ink from "ink";
import * as Theme from "./Theme.ts";
import { Context, Data, Effect, type Scope, pipe } from "effect";
import type { FC, PropsWithChildren, ReactNode } from "react";

export const TypeIdKey: "~sorrell/effect-ink/Runtime" = "~sorrell/effect-ink/Runtime" as const;

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export class InkRuntimeError extends Data.TaggedError("InkRuntimeError")<{ readonly message: string; }> { }

export interface Options extends Component.Theme.ThemeContext
{
    readonly EnableMouseInteraction?: boolean;
}

export interface Runtime
{
    // readonly [ Internal.Private ]:
    // {
    //     readonly Flush: Effect.Effect<void>;

    //     readonly Suspend: <A, E, R>(Arg: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>;
    // };
    readonly Instance: Ink.Instance | undefined;
    readonly Kill: () => Effect.Effect<void, InkRuntimeError>;
    readonly Run: (RootComponent: FC, Options?: Options) =>
    Effect.Effect<void, InkRuntimeError, Event.Bridge | Scope.Scope>;
}

interface RootProps
    extends PropsWithChildren,
    Partial<Component.Theme.ThemeProviderProps>,
    Omit<Options, keyof Component.Theme.ThemeContext>
{
    readonly Bridge: Event.InkEventBridge;
}

const RootComponent = (Props: RootProps): React.ReactNode =>
{
    const Defaults: Required<Pick<RootProps, "EnableMouseInteraction" | "Theme">> =
        {
            EnableMouseInteraction: true,
            Theme: Component.Theme.DefaultTheme
        };

    const { Bridge, EnableMouseInteraction, Theme, children } = { ...Defaults, ...Props };

    return (
        <Event.Provider { ...{ Bridge } }>
            <Mouse.Provider>
                <Component.Theme.ThemeProvider { ...{ Theme } }>
                    { children }
                </Component.Theme.ThemeProvider>
            </Mouse.Provider>
        </Event.Provider>
    );
};

export const Runtime: Context.Reference<Runtime> = Context.Reference<Runtime>(
    TypeIdKey,
    {
        defaultValue: () =>
        {
            let Instance: Ink.Instance | undefined = undefined;

            const Kill = (): Effect.Effect<void, InkRuntimeError> => Effect.gen(function* ()
            {
                if (false as boolean)
                {
                    yield* Effect.fail(new InkRuntimeError({ message: "Error in Kill method." }));
                }
            });

            // const Run = (ConsumerRootComponent: FC): Effect.Effect<void, InkRuntimeError, Scope.Scope> =>
            const Run = (ConsumerRootComponent: FC, Options?: Options) =>
                Effect.gen(function* ()
                {
                    if (Instance !== undefined)
                    {
                        return;
                    }

                    const UiEventService: Event.BridgeImpl = yield* Event.Bridge;
                    const Bridge: Event.InkEventBridge = yield* Event.Make(UiEventService);
                    // const Bridge: Event.InkEventBridge = yield* Event.Make(Event.EventBridgePubSub );

                    Instance = yield* Effect.sync(() => Ink.render(
                        <RootComponent
                            Theme={ Options?.Theme ?? Theme.DefaultTheme }
                            { ...{ Bridge } }>
                            <ConsumerRootComponent />
                        </RootComponent> )
                    );

                    yield* Effect.addFinalizer(() => Effect.sync(() => Instance?.unmount()));

                    yield* pipe(
                        Effect.tryPromise({
                            catch: (Cause: unknown) =>
                                Cause instanceof Error
                                    ? Cause
                                    : new InkRuntimeError({ message: String(Cause) }),
                            try: Instance?.waitUntilExit
                        }),
                        Effect.forkScoped({ startImmediately: true })
                    );
                });

            // const Flush: Effect.Effect<void> = Effect.gen(function* ()
            // {
            //     const EventBridge: Event.EventBridgePubSubImpl = yield* Event.EventBridgePubSub;
            //     EventBridge.
            // });
            // // Effect.promise(() => App.waitUntilRenderFlush);

            // const Suspend = <A, E, R>(Arg: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
            // {
            //     return Effect.acquireUseRelease(
            //         Effect.promise(() => Instance?.suspendTerminal),
            //         () =>
            //         {
            //             return Arg;
            //         },
            //         (Suspension) =>
            //         {
            //             return Effect.promise(() =>
            //             {
            //                 return Suspension.resume();
            //             });
            //         }
            //     );
            // }

            return {
                Instance,
                Kill,
                Run
            };
        }
    }
);
