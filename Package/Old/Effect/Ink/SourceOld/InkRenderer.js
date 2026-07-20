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
import { Context, Data, Effect, Layer } from "effect";
import { render as InkRender } from "ink";
export class InkRenderError extends Data.TaggedError("InkRenderError") {
}
export class InkExitError extends Data.TaggedError("InkExitError") {
}
export class InkAlreadyUnmountedError extends Data.TaggedError("InkAlreadyUnmountedError") {
}
export const InkRenderer = Context.Service("@sorrell/effect-ink/InkRenderer");
export const Render = (Element, Options) => Effect.gen(function* () {
    const Renderer = yield* InkRenderer;
    return yield* Renderer.Render(Element, Options);
});
export const Run = (Element, Options) => Effect.gen(function* () {
    const Renderer = yield* InkRenderer;
    return yield* Renderer.Run(Element, Options);
});
export const LayerFromRenderer = (Renderer) => Layer.succeed(InkRenderer, Renderer);
export const LayerLive = Layer.effect(InkRenderer, Effect.sync(() => {
    const RenderScoped = (Element, Options) => Effect.acquireRelease(Effect.try({
        catch: (Cause) => new InkRenderError({ Cause }),
        try: () => {
            const NativeInstance = Options !== undefined
                ? InkRender(Element, Options)
                : InkRender(Element);
            return WrapInkInstance(NativeInstance);
        }
    }), (Instance) => Instance.Cleanup);
    const RunElement = (Element, Options) => Effect.scoped(Effect.gen(function* () {
        const Instance = yield* RenderScoped(Element, Options);
        return yield* Instance.WaitUntilExit;
    }));
    return {
        Render: RenderScoped,
        Run: RunElement
    };
}));
const WrapInkInstance = (NativeInstance) => {
    let IsUnmounted = false;
    const RequireMounted = (EffectToRun) => IsUnmounted
        ? Effect.fail(new InkAlreadyUnmountedError({
            Message: "The Ink instance has already been unmounted."
        }))
        : EffectToRun;
    const Rerender = (Element) => RequireMounted(Effect.try({
        catch: (Cause) => new InkRenderError({ Cause }),
        try: () => {
            NativeInstance.rerender(Element);
        }
    }));
    const Unmount = Effect.try({
        catch: (Cause) => new InkRenderError({ Cause }),
        try: () => {
            if (!IsUnmounted) {
                NativeInstance.unmount();
                IsUnmounted = true;
            }
        }
    });
    const Cleanup = Effect.sync(() => {
        if (!IsUnmounted) {
            NativeInstance.cleanup();
            IsUnmounted = true;
        }
    });
    const Clear = RequireMounted(Effect.try({
        catch: (Cause) => new InkRenderError({ Cause }),
        try: () => {
            NativeInstance.clear();
        }
    }));
    const WaitUntilExit = Effect.tryPromise({
        catch: (Cause) => new InkExitError({ Cause }),
        try: () => NativeInstance.waitUntilExit()
    });
    const WaitUntilRenderFlush = RequireMounted(Effect.tryPromise({
        catch: (Cause) => new InkRenderError({ Cause }),
        try: () => NativeInstance.waitUntilRenderFlush()
    }));
    return {
        Cleanup,
        Clear,
        Rerender,
        Unmount,
        WaitUntilExit,
        WaitUntilRenderFlush
    };
};
//# sourceMappingURL=InkRenderer.js.map