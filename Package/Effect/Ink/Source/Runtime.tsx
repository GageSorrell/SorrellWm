/**
 * Use the {@link \@sorrell/effect-ink/Renderer} module via a handle, to manage
 * the lifetime of the {@link https://www.npmjs.com/package/ink | ink} session.
 *
 * @module @sorrell/effect-ink/Runtime
 */

/**
 * @file      Runtime.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Component from "./Component/index.js";
import * as Event from  "./Internal/Event.tsx";
import * as Theme from "./Theme.ts";
import { Context, Data, Effect, type Scope, pipe } from "effect";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { type Instance, render } from "ink";

export const TypeIdKey: "~sorrell/effect-ink/Runtime" = "~sorrell/effect-ink/Runtime" as const;

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export class InkRuntimeError extends Data.TaggedError("InkRuntimeError")<{ readonly message: string; }> { }


export interface Options extends Component.Theme.ThemeContext { }


export interface Runtime
{
    readonly Instance: Instance | undefined;
    readonly Kill: () => Effect.Effect<void, InkRuntimeError>;
    readonly Run: (RootComponent: FC, Options?: Options) =>
    Effect.Effect<void, InkRuntimeError, Event.EventBridgePubSub | Scope.Scope>;
}

interface RootProps extends PropsWithChildren, Partial<Component.Theme.ThemeProviderProps>
{
    readonly Bridge: Event.InkEventBridge;
}

const RootComponent = ({
    Bridge,
    Theme: InTheme = Theme.DefaultTheme,
    children
}: RootProps): ReactNode =>
{
    return (
        <Event.Provider { ...{ Bridge } }>
            <Component.Theme.ThemeProvider Theme={ InTheme }>
                { children }
            </Component.Theme.ThemeProvider>
        </Event.Provider>
    );
};

export const Runtime: Context.Reference<Runtime> = Context.Reference<Runtime>(
    TypeIdKey,
    {
        defaultValue: () =>
        {
            let Instance: Instance | undefined = undefined;

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

                    const UiEventService: Event.EventBridgePubSubImpl = yield* Event.EventBridgePubSub;
                    const Bridge: Event.InkEventBridge = yield* Event.Make(UiEventService);
                    // const Bridge: Event.InkEventBridge = yield* Event.Make(Event.EventBridgePubSub );

                    Instance = yield* Effect.sync(() => render(
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

            return {
                Instance,
                Kill,
                Run
            };
        }
    }
);
