/**
 * The main renderer module of this package.
 *
 * @module @sorrell/effect-ink/InkRenderer
 */

/**
 * @file      InkRenderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Data, Effect, Layer, type Scope } from "effect";
import { type Instance as InkNativeInstance, render as InkRender, type RenderOptions } from "ink";
import type { ReactNode } from "react";

/** Performance metrics for a render operation. */
export type InkRenderMetrics =
    {
        /** Time spent rendering in milliseconds. */
        renderTime: number;
    };

export type InkRenderOptions = RenderOptions;

export class InkRenderError extends Data.TaggedError("InkRenderError")<{
    readonly Cause: unknown;
}> { }

export class InkExitError extends Data.TaggedError("InkExitError")<{
    readonly Cause: unknown;
}> { }

export class InkAlreadyUnmountedError extends Data.TaggedError("InkAlreadyUnmountedError")<{
    readonly Message: string;
}> { }

export interface InkInstance
{
    readonly Rerender: (
        Element: ReactNode
    ) => Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;

    readonly Unmount: Effect.Effect<void, InkRenderError>;

    readonly Cleanup: Effect.Effect<void>;

    readonly Clear: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;

    readonly WaitUntilExit: Effect.Effect<unknown, InkExitError>;

    readonly WaitUntilRenderFlush: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;
}

export interface InkRenderer
{
    readonly Render: (
        Element: ReactNode,
        Options?: RenderOptions
    ) => Effect.Effect<InkInstance, InkRenderError, Scope.Scope>;

    readonly Run: (
        Element: ReactNode,
        Options?: RenderOptions
    ) => Effect.Effect<unknown, InkRenderError | InkExitError>;
}

export const InkRenderer: Context.Service<InkRenderer, InkRenderer> =
    Context.Service<InkRenderer>("@sorrell/effect-ink/InkRenderer");

export const Render = (
    Element: ReactNode,
    Options?: RenderOptions
): Effect.Effect<InkInstance, InkRenderError, InkRenderer | Scope.Scope> =>
    Effect.gen(function* ()
    {
        const Renderer: InkRenderer = yield* InkRenderer;

        return yield* Renderer.Render(Element, Options);
    });

export const Run = (
    Element: ReactNode,
    Options?: RenderOptions
): Effect.Effect<unknown, InkRenderError | InkExitError, InkRenderer> =>
    Effect.gen(function* ()
    {
        const Renderer: InkRenderer = yield* InkRenderer;

        return yield* Renderer.Run(Element, Options);
    });

export const LayerFromRenderer = (
    Renderer: InkRenderer
) =>
    Layer.succeed(InkRenderer, Renderer);

export const LayerLive: Layer.Layer<InkRenderer, never, never> = Layer.effect(
    InkRenderer,
    Effect.sync((): InkRenderer =>
    {
        const RenderScoped = (
            Element: ReactNode,
            Options?: RenderOptions
        ): Effect.Effect<InkInstance, InkRenderError, Scope.Scope> =>
            Effect.acquireRelease(
                Effect.try({
                    catch: (Cause: unknown) => new InkRenderError({ Cause }),
                    try: () =>
                    {
                        const NativeInstance: InkNativeInstance = Options !== undefined
                            ? InkRender(Element, Options)
                            : InkRender(Element);

                        return WrapInkInstance(NativeInstance);
                    }
                }),
                (Instance: InkInstance) => Instance.Cleanup
            );

        const RunElement = (
            Element: ReactNode,
            Options?: RenderOptions
        ): Effect.Effect<unknown, InkRenderError | InkExitError> =>
            Effect.scoped(
                Effect.gen(function* ()
                {
                    const Instance: InkInstance = yield* RenderScoped(Element, Options);

                    return yield* Instance.WaitUntilExit;
                })
            );

        return {
            Render: RenderScoped,
            Run: RunElement
        };
    })
);

const WrapInkInstance = (
    NativeInstance: InkNativeInstance
): InkInstance =>
{
    let IsUnmounted: boolean = false;

    const RequireMounted = <A, E>(
        EffectToRun: Effect.Effect<A, E>
    ): Effect.Effect<A, E | InkAlreadyUnmountedError> =>
        IsUnmounted
            ? Effect.fail(
                new InkAlreadyUnmountedError({
                    Message: "The Ink instance has already been unmounted."
                })
            )
            : EffectToRun;

    const Rerender = (
        Element: ReactNode
    ): Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError> =>
        RequireMounted(
            Effect.try({
                catch: (Cause: unknown) => new InkRenderError({ Cause }),
                try: () =>
                {
                    NativeInstance.rerender(Element);
                }
            })
        );

    const Unmount: Effect.Effect<void, InkRenderError> =
        Effect.try({
            catch: (Cause: unknown) => new InkRenderError({ Cause }),
            try: () =>
            {
                if (!IsUnmounted)
                {
                    NativeInstance.unmount();
                    IsUnmounted = true;
                }
            }
        });

    const Cleanup: Effect.Effect<void> = Effect.sync(() =>
    {
        if (!IsUnmounted)
        {
            NativeInstance.cleanup();
            IsUnmounted = true;
        }
    });

    const Clear: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError> =
        RequireMounted(
            Effect.try({
                catch: (Cause: unknown) => new InkRenderError({ Cause }),
                try: () =>
                {
                    NativeInstance.clear();
                }
            })
        );

    const WaitUntilExit: Effect.Effect<unknown, InkExitError> =
        Effect.tryPromise({
            catch: (Cause: unknown) => new InkExitError({ Cause }),
            try: () => NativeInstance.waitUntilExit()
        });

    const WaitUntilRenderFlush: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError> =
        RequireMounted(
            Effect.tryPromise({
                catch: (Cause: unknown) => new InkRenderError({ Cause }),
                try: () => NativeInstance.waitUntilRenderFlush()
            })
        );

    return {
        Cleanup,
        Clear,
        Rerender,
        Unmount,
        WaitUntilExit,
        WaitUntilRenderFlush
    };
};
