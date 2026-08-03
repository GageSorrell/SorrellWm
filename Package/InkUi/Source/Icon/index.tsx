/**
 * One-cell SVG icon rendering.
 *
 * @module @sorrell/ink-ui/Icon
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Svg, type SvgProps } from "../Svg/Svg.tsx";

/** {@inheritDoc Icon} */
export interface IconProps
{
    readonly fallback?: SvgProps["fallback"];
    readonly src: SvgProps["children"];
}

/** Renders an SVG in exactly one terminal cell. */
export function Icon({ fallback, src }: IconProps): React.ReactElement
{
    return (
        <Svg
            { ...(fallback === undefined ? { } : { fallback }) }
            height={ 1 }
            width={ 1 }>
            { src }
        </Svg>
    );
}
