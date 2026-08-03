/**
 * Converts, measures, and centers rectangular boxes for Electron windows.
 *
 * @module @sorrell/wm/Main/Utility/Math/Box
 *
 * @file      Box.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Box, type IntInterval, IntPoint } from "@sorrell/math";
import { type Rectangle, screen } from "electron";
import { Function } from "effect";

export/** Convert a mathematical box to an Electron rectangle. */
const ToRectangle = (Self: Box.Box): Rectangle =>
{
    const { X: x, Y: y } = Box.Min(Self);
    return screen.screenToDipRect(
        null,
        {
            height: Box.Height(Self),
            width:  Box.Width(Self),
            x,
            y
        }
    );
};

export/**
       * Return a box's center point, rounding fractional coordinates toward the upper-left.
       *
       * @since 0.1.0
       */
const CenterPoint = (Self: Box.Box): IntPoint.IntPoint =>
{
    const MidpointX = Self.Left + Box.Width(Self) / 2;
    const MidpointY = Self.Top + Box.Height(Self) / 2;
    return IntPoint.IntPoint(MidpointX, MidpointY);
};

export/** Create a box of the requested width and height centered over another box. */
const Center: {
    (That: Box.Box): (Size: IntInterval.IntInterval) => Box.Box;
    (Maximum: IntPoint.IntPoint, That: Box.Box): Box.Box;
} = Function.dual(2, (InMaximum: IntPoint.IntPoint, That: Box.Box): Box.Box =>
{
    const Width = InMaximum.X;
    const Height = InMaximum.Y;
    const Left = That.Left + Math.floor((Box.Width(That) - Width) / 2);
    const Top = That.Top + Math.floor((Box.Height(That) - Height) / 2);
    const Minimum = IntPoint.IntPoint(Left, Top);
    const Maximum = IntPoint.IntPoint(Left + Width, Top + Height);

    return Box.Box({
        Bottom: Maximum.Y,
        Left: Minimum.X,
        Right: Maximum.X,
        Top: Minimum.Y
    });
});
