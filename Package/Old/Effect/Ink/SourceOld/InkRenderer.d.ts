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
import { Context, Effect, Layer, type Scope } from "effect";
import { type RenderOptions } from "ink";
import type { ReactNode } from "react";
/** Performance metrics for a render operation. */
export type InkRenderMetrics = {
    /** Time spent rendering in milliseconds. */
    renderTime: number;
};
export type InkRenderOptions = RenderOptions;
declare const InkRenderError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkRenderError";
} & Readonly<A>;
export declare class InkRenderError extends InkRenderError_base<{
    readonly Cause: unknown;
}> {
}
declare const InkExitError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkExitError";
} & Readonly<A>;
export declare class InkExitError extends InkExitError_base<{
    readonly Cause: unknown;
}> {
}
declare const InkAlreadyUnmountedError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkAlreadyUnmountedError";
} & Readonly<A>;
export declare class InkAlreadyUnmountedError extends InkAlreadyUnmountedError_base<{
    readonly Message: string;
}> {
}
export interface InkInstance {
    readonly Rerender: (Element: ReactNode) => Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;
    readonly Unmount: Effect.Effect<void, InkRenderError>;
    readonly Cleanup: Effect.Effect<void>;
    readonly Clear: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;
    readonly WaitUntilExit: Effect.Effect<unknown, InkExitError>;
    readonly WaitUntilRenderFlush: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;
}
export interface InkRenderer {
    readonly Render: (Element: ReactNode, Options?: RenderOptions) => Effect.Effect<InkInstance, InkRenderError, Scope.Scope>;
    readonly Run: (Element: ReactNode, Options?: RenderOptions) => Effect.Effect<unknown, InkRenderError | InkExitError>;
}
export declare const InkRenderer: Context.Service<InkRenderer, InkRenderer>;
export declare const Render: (Element: ReactNode, Options?: RenderOptions) => Effect.Effect<InkInstance, InkRenderError, InkRenderer | Scope.Scope>;
export declare const Run: (Element: ReactNode, Options?: RenderOptions) => Effect.Effect<unknown, InkRenderError | InkExitError, InkRenderer>;
export declare const LayerFromRenderer: (Renderer: InkRenderer) => Layer.Layer<InkRenderer, never, never>;
export declare const LayerLive: Layer.Layer<InkRenderer, never, never>;
export {};
//# sourceMappingURL=InkRenderer.d.ts.map