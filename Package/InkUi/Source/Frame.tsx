/**
 * Draws a themed border and optional title around terminal content.
 *
 * @module @sorrell/ink-ui/Frame
 *
 * @file      Frame.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.js";

/** {@inheritDoc Frame} */
export interface FrameProps extends React.PropsWithChildren
{
    readonly Active?: boolean;
    readonly Footer?: string;
    readonly Padding?: number;
    readonly Title?: string;
}

export/**
       * Draws a themed border and optional title around terminal content.
       *
       * @category Layout
       * @since 1.0.0
       */
const Frame = ({
    Active = false,
    children,
    Footer,
    Padding = 1,
    Title
}: FrameProps): React.ReactNode =>
{
    const Theme = useTheme();
    const Content = typeof children === "string" || typeof children === "number"
        ? <Ink.Text>{ children }</Ink.Text>
        : children;

    return (
        <Ink.Box flexDirection="column">
            { Title !== undefined && (
                <Ink.Text
                    bold
                    color={ Active ? Theme.Primary : Theme.TextMuted }>
                    { Active ? "▸ " : "" }{ Title }
                </Ink.Text>
            ) }
            <Ink.Box
                borderColor={ Active ? Theme.BorderActive : Theme.Border }
                borderStyle="round"
                flexDirection="column"
                paddingX={ Padding }>
                { Content }
            </Ink.Box>
            { Footer !== undefined && (
                <Ink.Text color={ Theme.TextMuted }>{ Footer }</Ink.Text>
            ) }
        </Ink.Box>
    );
};
