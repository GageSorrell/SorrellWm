/**
 * The runtime that orchestrates prompt and `ink` state.
 *
 * @todo This might not be needed.
 *
 * @module @sorrell/effect-ink/Runtime
 */

/**
 * @file      Runtime.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Effect, type Exit, type Fiber, pipe } from "effect";
import { type PropsWithChildren, type ReactNode, createContext, useContext } from "react";

export const TypeIdKey: string = "@sorrell/effect-ink/Runtime";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface RuntimeImpl
{
    readonly MakeProvider: (Props: PropsWithChildren) => ReactNode;

    readonly RunFork: <A, E>(Effect: Effect.Effect<A, E>) => Fiber.Fiber<A, E>;

    readonly RunPromiseExit: <A, E>(Effect: Effect.Effect<A, E>) => Promise<Exit.Exit<A, E>>;
}

const EmptyContext: Runtime =
    {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        MakeProvider: undefined as any,
        RunFork: undefined as any,
        RunPromiseExit: undefined as any
        /* eslint-enable @typescript-eslint/no-explicit-any */
    };

const ReactContext: React.Context<Runtime> = createContext<Runtime>(EmptyContext);

export const useInkRuntime = (): Runtime =>
{
    const RuntimeService: Runtime = useContext(ReactContext);

    if (RuntimeService === undefined)
    {
        throw new Error(
            "InkRuntimeService was not found. Wrap the Ink tree with InkRuntimeService.makeProvider(...)."
        );
    }

    return RuntimeService;
};

export class RuntimeContext extends Context.Service<RuntimeContext, RuntimeImpl>()(TypeIdKey) { }

export const Runtime: typeof RuntimeContext  = RuntimeContext;
export type Runtime = typeof RuntimeContext["Service"];

export const Make = <R,>(Services: Context.Context<R>): Runtime =>
{
    const RuntimeService: Runtime =
        {
            MakeProvider: ({ children }: PropsWithChildren): ReactNode =>
            {
                return (
                    <ReactContext.Provider value={ RuntimeService }>
                        { children }
                    </ReactContext.Provider>
                );
            },
            RunFork: <A, E>(In: Effect.Effect<A, E>): Fiber.Fiber<A, E> =>
                pipe(In, Effect.runForkWith(Services)),
            RunPromiseExit: <A, E>(In: Effect.Effect<A, E>): Promise<Exit.Exit<A, E>> =>
                pipe(In, Effect.runPromiseExitWith(Services))
        };

    return RuntimeService;
};

export const MakeFromCurrent = <R,>(): Effect.Effect<Runtime, never, R> => Effect.gen(function* ()
{
    return Make(yield* Effect.context<R>());
});
