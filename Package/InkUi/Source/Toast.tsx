/**
 *
 *
 * @module @sorrell/ink-ui/Toast
 *
 * @file      Toast.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.js";

/** {@inheritDoc Toast} */
export interface ToastProps
{
    readonly DurationMilliseconds?: number;
    readonly Message: string;
    readonly OnDismiss?: () => void;
    readonly Tone?: "error" | "info" | "success" | "warning";
}

export/**
       * Displays a transient themed notification.
       *
       * @category Feedback
       * @since 1.0.0
       */
const Toast = ({
    DurationMilliseconds = 2_500,
    Message,
    OnDismiss,
    Tone = "info"
}: ToastProps): React.ReactNode | null =>
{
    const Theme = useTheme();
    const [ Visible, SetVisible ] = React.useState(true);

    React.useEffect(() =>
    {
        const Timer = setTimeout(() =>
        {
            SetVisible(false);
            OnDismiss?.();
        }, DurationMilliseconds);

        return (): void => clearTimeout(Timer);
    }, [ DurationMilliseconds, OnDismiss ]);

    if (!Visible)
    {
        return null;
    }

    const Color = {
        error: Theme.Error,
        info: Theme.Info,
        success: Theme.Success,
        warning: Theme.Warning
    }[Tone];

    return (
        <Ink.Text color={ Color }>
            { Tone === "error" ? "✗" : Tone === "success" ? "✓" : "●" } { Message }
        </Ink.Text>
    );
};
