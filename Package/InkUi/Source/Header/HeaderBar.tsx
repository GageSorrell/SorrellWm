/**
 *
 *
 * @module @sorrell/ink-ui/Header/HeaderBar
 *
 * @file      HeaderBar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "../Theme.tsx";

/** {@inheritDoc HeaderBar} */
export interface HeaderBarProps

{
    readonly Left?: React.ReactNode;
    readonly Right?: React.ReactNode;
    readonly Title: string;
}

export/**
       * Displays a title with optional content aligned to either side.
       *
       * @category Display
       * @since 1.0.0
       */
const HeaderBar = ({
    Left,
    Right,
    Title
}: HeaderBarProps): React.ReactNode =>
{
    const Theme = useTheme();

    return (
        <Ink.Box justifyContent="space-between">
            <Ink.Box gap={ 1 }>
                { Left }
                <Ink.Text
                    bold
                    color={ Theme.Primary }>
                    { Title }
                </Ink.Text>
            </Ink.Box>
            <Ink.Box>
                { Right }
            </Ink.Box>
        </Ink.Box>
    );
};
