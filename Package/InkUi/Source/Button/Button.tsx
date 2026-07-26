/**
 *
 *
 * @module @sorrell/ink-ui/Button/Button
 *
 * @file      Button.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import type { CornerShapeValue } from "../Box/CompactBorder.ts";

export type ButtonAppearance =
    /** Emphasizes the button. */
    | "primary"

    /** The default appearance. */
    | "secondary"

    /** Minimizes emphasis when not hovered or focused. */
    | "subtle"

    /** No background or border. */
    | "transparent"

    /** No background. */
    | "outline";

export type IconPosition =
    | "before"
    | "after";

export interface ButtonProps
{
    readonly Icon?: React.ReactNode;
    readonly Appearance?: ButtonAppearance;
    readonly IconPosition?: IconPosition;
    readonly Large?: boolean;
    readonly Disabled?: boolean;
    readonly DisabledFocusable?: boolean;
    readonly Shape?: CornerShapeValue;
}
