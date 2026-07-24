/**
 *
 *
 * @module @sorrell/ink-ui/Overlay/ConfirmOverlay
 *
 * @file      ConfirmOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Overlay } from "./Overlay.tsx";
import { useRoutedInput } from "../Interaction/Shortcut.ts";
import { useTheme } from "../Theme.tsx";

/** {@inheritDoc ConfirmOverlay} */
export interface ConfirmOverlayProps
{
    readonly Message: string;
    readonly OnCancel: () => void;
    readonly OnConfirm: () => void;
    readonly Title?: string;
}

export/**
       * Requests a keyboard-confirmed yes or no decision.
       *
       * @category Overlay
       * @since 1.0.0
       */
const ConfirmOverlay = ({
    Message,
    OnCancel,
    OnConfirm,
    Title = "Confirm"
}: ConfirmOverlayProps): React.ReactNode =>
{
    const Theme = useTheme();
    const [ Confirmed, SetConfirmed ] = React.useState(true);

    useRoutedInput((Input: string, Key: Ink.Key) =>
    {
        if (Key.escape || Input.toLowerCase() === "n")
        {
            OnCancel();
            return true;
        }
        else if (Input.toLowerCase() === "y")
        {
            OnConfirm();
            return true;
        }
        else if (Key.leftArrow || Key.rightArrow || Key.tab)
        {
            SetConfirmed((Current: boolean) => !Current);
            return true;
        }
        else if (Key.return)
        {
            (Confirmed ? OnConfirm : OnCancel)();
            return true;
        }
        return false;
    });

    return (
        <Overlay Title={ Title }>
            <Ink.Text color={ Theme.Text }>{ Message }</Ink.Text>
            <Ink.Box gap={ 2 }>
                <Ink.Text
                    bold={ Confirmed }
                    color={ Confirmed ? Theme.Success : Theme.TextMuted }>
                    { Confirmed ? "› " : "  " }Yes
                </Ink.Text>
                <Ink.Text
                    bold={ !Confirmed }
                    color={ !Confirmed ? Theme.Error : Theme.TextMuted }>
                    { !Confirmed ? "› " : "  " }No
                </Ink.Text>
            </Ink.Box>
        </Overlay>
    );
};
