/**
 * A decorative, light/dark-aware grid backdrop.
 *
 * @module @sorrell/ui/GridBackground
 *
 * @file      GridBackground.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";

import { Cn } from "./ClassName.js";

/** Props for {@link GridBackground}. */
export interface GridBackgroundProps
{
    readonly className?: string;
}

/**
 * Renders an absolutely-positioned, `aria-hidden` grid pattern behind a section. Meant to be
 * placed as the first child of a `position: relative` container.
 *
 * @category Component
 * @since 1.0.0
 */
export const GridBackground = ({ className: ClassName }: GridBackgroundProps): React.JSX.Element =>
{
    return (
        <div aria-hidden="true"
            className={ Cn("pointer-events-none absolute inset-0", ClassName) }>
            <div className="sorrell-ui-grid-bg sorrell-ui-grid-bg--light absolute inset-0" />
            <div className="sorrell-ui-grid-bg sorrell-ui-grid-bg--dark absolute inset-0" />
        </div>
    );
};
