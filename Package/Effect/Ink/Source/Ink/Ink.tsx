/**
 * Run `ink` in `effect` programs, with niceties including {@link | theme support}.
 *
 * @note For simpler implementations, the {@link \@sorrell/effect-ink/Ink/Base} service
 * allows `effect` programs to run `ink` without the aforementioned niceties.
 *
 * @module @sorrell/effect-ink/Ink
 */

/**
 * @file      Ink.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as InkBase from "./Base/index.ts";
import { Context, Effect, Layer, type Scope } from "effect";
import type {
    InkExitError,
    InkRenderError
} from "../Error/Error.ts";
import type { ReactNode } from "react";
import { RuntimeProvider } from "../React/index.ts";

export interface Ink extends InkBase.InkBase
{
    readonly renderBase: InkBase.InkBase["render"];
    readonly runBase: InkBase.InkBase["run"];
}

export const Ink: Context.Service<Ink, Ink> = Context.Service<Ink>("@sorrell/effect-ink/Ink");

export const render = (
    Element: ReactNode,
    Options?: InkBase.RenderOptions
): Effect.Effect<InkBase.InkBaseInstance, InkRenderError, Ink | Scope.Scope> =>
    Effect.gen(function* ()
    {
        const Renderer: Ink = yield* Ink;

        return yield* Renderer.render(
            Element,
            Options
        );
    });

export const run = (
    Element: ReactNode,
    Options?: InkBase.RenderOptions
): Effect.Effect<unknown, InkRenderError | InkExitError, Ink> =>
    Effect.gen(function* ()
    {
        const Renderer: Ink = yield* Ink;

        return yield* Renderer.run(
            Element,
            Options
        );
    });

export const layerFromBase: Layer.Layer<Ink, never, InkBase.InkBase> =
    Layer.effect(
        Ink,
        Effect.gen(function* ()
        {
            const BaseRenderer: InkBase.InkBase = yield* InkBase.InkBase;

            const WrapElement = (
                Element: ReactNode
            ): Effect.Effect<ReactNode> =>
                Effect.gen(function* ()
                {
                    const RuntimeContext: Context.Context<never> = yield* Effect.context();

                    return (
                        <RuntimeProvider Context={ RuntimeContext }>
                            { Element }
                        </RuntimeProvider>
                    );
                });

            const RenderWithRuntime: Ink["render"] = (
                Element: ReactNode,
                Options?: InkBase.RenderOptions
            ) =>
                Effect.gen(function* ()
                {
                    const WrappedElement: ReactNode = yield* WrapElement(Element);

                    return yield* BaseRenderer.render(
                        WrappedElement,
                        Options
                    );
                });

            const RunWithRuntime: Ink["run"] = (
                Element: ReactNode,
                Options?: InkBase.RenderOptions
            ) =>
                Effect.gen(function* ()
                {
                    const WrappedElement: ReactNode = yield* WrapElement(Element);

                    return yield* BaseRenderer.run(
                        WrappedElement,
                        Options
                    );
                });

            return {
                render: RenderWithRuntime,
                run: RunWithRuntime,

                renderBase: BaseRenderer.render,
                runBase: BaseRenderer.run
            };
        })
    );

export const layerLive: Layer.Layer<Ink, never, never> =
    Layer.provide(
        layerFromBase,
        InkBase.layerLive
    );
