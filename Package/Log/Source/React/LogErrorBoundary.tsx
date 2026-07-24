/**
 *
 *
 * @module @sorrell/log/React/LogErrorBoundary
 *
 * @file      LogErrorBoundary.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Component,
    type ErrorInfo,
    type ReactNode
} from "react";
import type { CategoryInput } from "../Category.js";
import type { DirectLogger } from "../Logger.js";
import { useLogger } from "./useLogger.js";

/** Props for the React logging error boundary. */
export interface LogErrorBoundaryProps
{
    readonly Category?: CategoryInput;
    readonly Fallback?: ReactNode;
    readonly children?: ReactNode;
}

interface InnerProps extends LogErrorBoundaryProps
{
    readonly Logger: DirectLogger;
}

interface State
{
    readonly ErrorValue?: unknown;
}

class InnerBoundary extends Component<InnerProps, State>
{
    public override state: State = { };
    private LastLogged: unknown;

    public static getDerivedStateFromError(ErrorValue: unknown): State
    {
        return { ErrorValue };
    }

    public override componentDidCatch(ErrorValue: unknown, Info: ErrorInfo): void
    {
        if (Object.is(this.LastLogged, ErrorValue))
        {
            return;
        }

        this.LastLogged = ErrorValue;
        this.props.Logger.Error("React error boundary captured an error", ErrorValue, {
            ComponentStack: Info.componentStack
        });
    }

    public override render(): ReactNode
    {
        if (this.state.ErrorValue !== undefined)
        {
            return this.props.Fallback ?? null;
        }

        return this.props.children;
    }
}

/** Log captured render errors once and render an optional fallback. */
export function LogErrorBoundary(Props: LogErrorBoundaryProps): ReactNode
{
    const Logger = useLogger(Props.Category ?? "React");
    return <InnerBoundary { ...Props }
        Logger={ Logger } />;
}
