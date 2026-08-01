/**
 * A hairline divider between landing-page sections.
 *
 * @module @sorrell/ui/SectionDivider
 *
 * @file      SectionDivider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";

import { Cn } from "./ClassName.js";

/** Props for {@link SectionDivider}. */
export interface SectionDividerProps
{
    readonly className?: string;
}

/**
 * Renders an `aria-hidden` `<hr>` between sections.
 *
 * @category Component
 * @since 1.0.0
 */
export const SectionDivider = ({ className: ClassName }: SectionDividerProps): React.JSX.Element =>
{
    return (
        <hr aria-hidden="true"
            className={ Cn("w-full border-t border-zinc-800/80", ClassName) } />
    );
};
