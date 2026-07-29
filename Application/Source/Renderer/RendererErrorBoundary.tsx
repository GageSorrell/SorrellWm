/**
 * React error boundary that forwards rendering failures to the main logger.
 *
 * @module @sorrell/wm/Renderer/RendererErrorBoundary
 *
 * @file      RendererErrorBoundary.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Logging.js";
import { Component, type ErrorInfo, type ReactNode } from "react";

/** {@inheritDoc RendererErrorBoundary} */
export interface RendererErrorBoundaryProps
{
    readonly children: ReactNode;
}

interface RendererErrorBoundaryState
{
    readonly Failed: boolean;
}

/** Report uncaught React rendering failures and contain the failed surface. */
export class RendererErrorBoundary extends Component<
    RendererErrorBoundaryProps,
    RendererErrorBoundaryState
>
{
    public override state: RendererErrorBoundaryState = { Failed: false };

    /** Mark the failed renderer surface for containment. */
    public static getDerivedStateFromError(): RendererErrorBoundaryState
    {
        return { Failed: true };
    }

    public override componentDidCatch(ErrorValue: Error, Information: ErrorInfo): void
    {
        Logging.Error(
            "Application",
            "The renderer React error boundary captured an error.",
            new Error(`${ ErrorValue.stack ?? ErrorValue.message }\n${ Information.componentStack }`)
        );
    }

    public override render(): ReactNode
    {
        return this.state.Failed ? null : this.props.children;
    }
}
