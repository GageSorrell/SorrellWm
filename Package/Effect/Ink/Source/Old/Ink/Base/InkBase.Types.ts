/**
 * @file      InkBase.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { InkAlreadyUnmountedError, InkExitError, InkRenderError } from "../../../Error.ts";
import type { Effect } from "effect";
import type { ReactNode } from "react";
export type { RenderOptions } from "ink";

/** Performance metrics for a render operation. */
export type RenderMetrics =
    {
        /** Time spent rendering in milliseconds. */
        renderTime: number;
    };

export interface InkBaseInstance
{
    readonly rerender: (
        Element: ReactNode
    ) => Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;

    readonly unmount: Effect.Effect<void, InkRenderError>;

    readonly cleanup: Effect.Effect<void>;

    readonly clear: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;

    readonly waitUntilExit: Effect.Effect<unknown, InkExitError>;

    readonly waitUntilRenderFlush: Effect.Effect<void, InkRenderError | InkAlreadyUnmountedError>;
}
