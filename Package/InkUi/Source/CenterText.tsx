/**
 *
 *
 * @module @sorrell/ink-ui/CenterText
 *
 * @file      CenterText.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";

/** {@inheritDoc CenterText} */
export interface CenterTextProps extends React.PropsWithChildren
{
    readonly Color?: string;
    readonly Width?: number | `${ number }%`;
}

export/**
       * Centers text horizontally within an Ink layout region.
       *
       * @category Display
       * @since 1.0.0
       */
const CenterText = ({
    Color,
    Width = "100%",
    children
}: CenterTextProps): React.ReactNode =>
{
    const width: CenterTextProps["Width"] = Width;
    const TextProps: Ink.TextProps = Color !== undefined
        ? { color: Color }
        : { };

    return (
        <Ink.Box
            justifyContent="center"
            { ...{ width } }>
            <Ink.Text { ...TextProps }>
                { children }
            </Ink.Text>
        </Ink.Box>
    );
};
