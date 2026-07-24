/**
 *
 *
 * @module @sorrell/ink-ui/GradientBadge
 *
 * @file      GradientBadge.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "../Theme.tsx";

/** {@inheritDoc GradientBadge} */
export interface GradientBadgeProps
{
    readonly From?: string;
    readonly Text: string;
    readonly To?: string;
}

const ParseHex = (Value: string): readonly [ number, number, number ] =>
{
    const Normalized = Value.replace(/^#/u, "");
    return [
        Number.parseInt(Normalized.slice(0, 2), 16),
        Number.parseInt(Normalized.slice(2, 4), 16),
        Number.parseInt(Normalized.slice(4, 6), 16)
    ];
};

const Interpolate = (From: string, To: string, Position: number): string =>
{
    const Start = ParseHex(From);
    const End = ParseHex(To);
    const Channel = (Index: 0 | 1 | 2): string =>
        Math.round(Start[Index] + (End[Index] - Start[Index]) * Position)
            .toString(16)
            .padStart(2, "0");

    return `#${ Channel(0) }${ Channel(1) }${ Channel(2) }`;
};

export/**
       * Renders text whose foreground color transitions across a gradient.
       *
       * @category Display
       * @since 1.0.0
       */
const GradientBadge = ({
    From,
    Text: Value,
    To
}: GradientBadgeProps): React.ReactNode =>
{
    const Theme = useTheme();
    const Characters = [ ...Value ];
    const Divisor = Math.max(1, Characters.length - 1);

    return (
        <Ink.Text>
            { Characters.map((Character: string, Index: number) => (
                <Ink.Text
                    color={ Interpolate(
                        From ?? Theme.Primary,
                        To ?? Theme.Secondary,
                        Index / Divisor
                    ) }
                    key={ `${ Character }-${ Index }` }>
                    { Character }
                </Ink.Text>
            )) }
        </Ink.Text>
    );
};
