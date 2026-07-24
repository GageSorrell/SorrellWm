/**
 *
 *
 * @module @sorrell/ink-ui/Badge
 *
 * @file      Badge.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "../Theme.js";

/** {@inheritDoc Badge} */
export interface BadgeProps extends React.PropsWithChildren
{
    readonly Color?: string;
}

export/**
       * Renders compact status text with a colored terminal background.
       *
       * @category Display
       * @since 1.0.0
       */
const Badge = ({ children, Color }: BadgeProps): React.ReactNode =>
{
    const Theme = useTheme();

    return (
        <Ink.Text
            backgroundColor={ Color ?? Theme.BackgroundElement }
            color={ Theme.Text }>
            { " " }{ children }{ " " }
        </Ink.Text>
    );
};
