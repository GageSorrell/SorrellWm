/**
 * A badge that indicates a keybind that can be pressed to perform a relevant action.
 *
 * @module @sorrell/ink-ui/Badge/JumpBadge
 *
 * @file      JumpBadge.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "../Theme.tsx";

/** {@inheritDoc JumpBadge} */
export interface JumpBadgeProps
{
    readonly Hint: string;
}

export/**
       * Displays a concise keyboard jump hint.
       *
       * @category Navigation
       * @since 1.0.0
       */
const JumpBadge = ({ Hint }: JumpBadgeProps): React.ReactNode =>
{
    const Theme = useTheme();

    return (
        <Ink.Text
            bold
            color={ Theme.Warning }>
            [{ Hint }]
        </Ink.Text>
    );
};
