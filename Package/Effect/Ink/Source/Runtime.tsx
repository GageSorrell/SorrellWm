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

import { Context, Data, Effect, type Scope, pipe } from "effect";
import { type Instance, render } from "ink";
import type { FC } from "react";

export const TypeIdKey: "~sorrell/effect-ink/Runtime" = "~sorrell/effect-ink/Runtime" as const;

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export class InkRuntimeError extends Data.TaggedError("InkRuntimeError")<{ readonly message: string; }> { }

export interface Runtime
{
    readonly Instance: Instance | undefined;
    readonly Kill: () => Effect.Effect<void, InkRuntimeError>;
    readonly Run: (RootComponent: FC) => Effect.Effect<void, InkRuntimeError, Scope.Scope>;
}

export const Runtime: Context.Reference<Runtime> = Context.Reference<Runtime>(
    "~sorrell/effect-ink/Runtime",
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

            const Run = (RootComponent: FC): Effect.Effect<void, InkRuntimeError, Scope.Scope> =>
                Effect.gen(function* ()
                {
                    if (Instance !== undefined)
                    {
                        return;
                    }

                    Instance = yield* Effect.sync(() => render(<RootComponent />));
                    yield* Effect.addFinalizer(() => Effect.sync(() => Instance?.unmount()));

                    yield* pipe(
                        Effect.tryPromise({
                            catch: (Cause: unknown) =>
                                Cause instanceof Error
                                    ? Cause
                                    : new InkRuntimeError({ message: String(Cause) }),
                            try: Instance?.waitUntilExit
                        }),
                        Effect.asVoid,
                        Effect.forkScoped
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
