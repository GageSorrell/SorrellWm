/**
 *
 *
 * @module
 *
 * @file      Animation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-jsdoc */

// @TODO TEMPORARY
/* eslint-disable @typescript-eslint/typedef */

import * as Ink from "ink";
import * as React from "react";
import { Array, Function, String } from "effect";

export interface ImpulseBackgroundBoxProps extends React.PropsWithChildren
{
    readonly ImpulseKey: number;
    readonly Duration?: number;
    readonly FrameDuration?: number;
}

export function ImpulseBackgroundBox({
    ImpulseKey,
    Duration = 350,
    FrameDuration = 16,
    children
}: ImpulseBackgroundBoxProps
): React.ReactElement
{
    const [ IsAnimating, SetIsAnimating ] = React.useState(false);

    const { time, reset } = Ink.useAnimation({
        interval: FrameDuration,
        isActive: IsAnimating
    });

    React.useEffect(() =>
    {
        if (ImpulseKey !== 0)
        {
            SetIsAnimating(true);
            reset();
        }
    }, [ ImpulseKey, reset ]);

    const Progress = Math.min(time / Duration, 1);

    React.useEffect(() =>
    {
        if (Progress >= 1)
        {
            SetIsAnimating(false);
        }
    }, [ Progress ]);

    const BackgroundColor = React.useMemo(() =>
    {
        if (!IsAnimating)
        {
            return undefined;
        }

        return GetImpulseBackgroundColor(Progress);
    }, [ IsAnimating, Progress ]);

    return (
        <Ink.Box
            backgroundColor={ BackgroundColor }
            paddingX={ 1 }>
            { children }
        </Ink.Box>
    );
}

function GetImpulseBackgroundColor(Progress: number): string | undefined
{
    if (Progress >= 1)
    {
        return undefined;
    }

    const EasedProgress = EaseOutCubic(Progress);

    /*
     * Fade from white toward near-black, then remove the background color.
     * The removal is what restores the terminal's true default background.
     */
    const Channel = Math.round(255 * (1 - EasedProgress));

    return FormatRgbAsHex(Channel, Channel, Channel);
}

function EaseOutCubic(Value: number): number
{
    const ClampedValue = Math.max(0, Math.min(1, Value));

    return 1 - Math.pow(1 - ClampedValue, 3);
}

function FormatRgbAsHex(Red: number, Green: number, Blue: number): string
{
    const ToHex = Function.flow(
        (In: number) => In.toString(16),
        String.padStart(2, "0"),
        String.toUpperCase
    );

    return Array.join("")([ "#", ToHex(Red), ToHex(Green), ToHex(Blue) ]);
}
