/**
 *
 *
 * @module @sorrell/ink-ui/StatusBar
 *
 * @file      StatusBar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.js";

/** {@inheritDoc StatusBarItem} */
export interface StatusBarItem
{
    readonly Color?: string;
    readonly Label: string;
}

/** {@inheritDoc StatusBar} */
export interface StatusBarProps
{
    readonly Items: ReadonlyArray<StatusBarItem>;
}

export/**
       * Renders a compact row of application status values.
       *
       * @category Display
       * @since 1.0.0
       */
const StatusBar = ({ Items }: StatusBarProps): React.ReactNode =>
{
    const Theme = useTheme();

    return (
        <Ink.Box gap={ 1 }>
            { Items.map((Item: StatusBarItem) => (
                <Ink.Text
                    color={ Item.Color ?? Theme.TextMuted }
                    key={ Item.Label }>
                    { Item.Label }
                </Ink.Text>
            )) }
        </Ink.Box>
    );
};
