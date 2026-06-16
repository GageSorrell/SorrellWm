/**
 * @file      InkBase.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Effect, Layer, type Scope } from "effect";
import { InkAlreadyUnmountedError, InkExitError, InkRenderError } from "../../../Error.ts";
import type { InkBaseInstance, RenderOptions } from "./InkBase.Types.ts";
import { type Instance as InkNativeInstance, render as InkRender } from "ink";
import type { ReactNode } from "react";

export interface InkBase
{
    readonly render: (
        Element: ReactNode,
        Options?: RenderOptions
    ) => Effect.Effect<InkBaseInstance, InkRenderError, Scope.Scope>;

    readonly run: (
        Element: ReactNode,
        Options?: RenderOptions
    ) => Effect.Effect<unknown, InkRenderError | InkExitError>;
}

export const InkBase: Context.Service<InkBase, InkBase> =
    Context.Service<InkBase>("@sorrell/effect-ink/Ink/Base");

export const render = (
    Element: ReactNode,
    Options?: RenderOptions
): Effect.Effect<InkBaseInstance, InkRenderError, InkBase | Scope.Scope> =>
    Effect.gen(function* ()
    {
        const Renderer: InkBase = yield* InkBase;

        return yield* Renderer.render(Element, Options);
    });

export const run = (
    Element: ReactNode,
    Options?: RenderOptions
): Effect.Effect<unknown, InkRenderError | InkExitError, InkBase> =>
    Effect.gen(function* ()
    {
        const Renderer: InkBase = yield* InkBase;

        return yield* Renderer.run(Element, Options);
    });

export const layerFromRenderer = (
    Renderer: InkBase
) =>
    Layer.succeed(InkBase, Renderer);

export const layerLive: Layer.Layer<InkBase, never, never> = Layer.effect(
    InkBase,
    Effect.sync((): InkBase =>
    {
        const render = (
            Element: ReactNode,
            Options?: RenderOptions
        ): Effect.Effect<InkBaseInstance, InkRenderError, Scope.Scope> =>
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
                (Instance: InkBaseInstance) => Instance.cleanup
            );

        const run = (
            Element: ReactNode,
            Options?: RenderOptions
        ): Effect.Effect<unknown, InkRenderError | InkExitError> =>
            Effect.scoped(
                Effect.gen(function* ()
                {
                    const Instance: InkBaseInstance = yield* render(Element, Options);

                    return yield* Instance.waitUntilExit;
                })
            );

        return { render, run };
    })
);

const WrapInkInstance = (
    NativeInstance: InkNativeInstance
): InkBaseInstance =>
{
    let IsUnmounted: boolean = false;

    const requireMounted = <A, E>(
        EffectToRun: Effect.Effect<A, E>
    ): Effect.Effect<A, E | InkAlreadyUnmountedError> =>
        IsUnmounted
            ? Effect.fail(
                new InkAlreadyUnmountedError({
                    Message: "The Ink instance has already been unmounted."
                })
            )
            : EffectToRun;

    const rerender = (
        Element: ReactNode
    ): Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError> =>
        requireMounted(
            Effect.try({
                catch: (Cause: unknown) => new InkRenderError({ Cause }),
                try: () =>
                {
                    NativeInstance.rerender(Element);
                }
            })
        );

    const unmount: Effect.Effect<void, InkRenderError> =
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

    const cleanup: Effect.Effect<void> = Effect.sync(() =>
    {
        if (!IsUnmounted)
        {
            NativeInstance.cleanup();
            IsUnmounted = true;
        }
    });

    const clear: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError> =
        requireMounted(
            Effect.try({
                catch: (Cause: unknown) => new InkRenderError({ Cause }),
                try: () =>
                {
                    NativeInstance.clear();
                }
            })
        );

    const waitUntilExit: Effect.Effect<unknown, InkExitError> =
        Effect.tryPromise({
            catch: (Cause: unknown) => new InkExitError({ Cause }),
            try: () => NativeInstance.waitUntilExit()
        });

    const waitUntilRenderFlush: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError> =
        requireMounted(
            Effect.tryPromise({
                catch: (Cause: unknown) => new InkRenderError({ Cause }),
                try: () => NativeInstance.waitUntilRenderFlush()
            })
        );

    return {
        cleanup,
        clear,
        rerender,
        unmount,
        waitUntilExit,
        waitUntilRenderFlush
    };
};
