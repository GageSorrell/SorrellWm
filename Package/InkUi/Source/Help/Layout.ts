/**
 * Tooltip placement helpers.
 *
 * @module @sorrell/ink-ui/Help/Layout
 *
 * @file      Layout.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A cardinal position of a tooltip relative to its target. */
export type TooltipPosition = "top" | "right" | "bottom" | "left";

/** Zero-based terminal-cell bounds. */
export interface TooltipBounds
{
    readonly Height: number;
    readonly Left: number;
    readonly Top: number;
    readonly Width: number;
}

/** Terminal dimensions in cells. */
export interface TooltipScreen
{
    readonly Height: number;
    readonly Width: number;
}

/** The selected tooltip position and its zero-based screen coordinates. */
export interface TooltipPlacement
{
    readonly FullyVisible: boolean;
    readonly Left: number;
    readonly Position: TooltipPosition;
    readonly Top: number;
    readonly VisibleArea: number;
}

const Positions: ReadonlyArray<TooltipPosition> = [ "top", "right", "bottom", "left" ];

/**
 * Select the nearest placement that fits, or the placement with the greatest
 * visible area when no candidate can fit completely.
 */
export function ChooseTooltipPlacement(
    Target: TooltipBounds,
    Tooltip: Readonly<{ readonly Height: number; readonly Width: number }>,
    Screen: TooltipScreen,
    Preferred: TooltipPosition = "bottom"
): TooltipPlacement
{
    const Candidates: ReadonlyArray<TooltipPlacement> = OrderedPositions(Preferred)
        .map((Position: TooltipPosition) => MakePlacement(
            Position,
            Target,
            Tooltip,
            Screen
        ));
    const FullyVisible: TooltipPlacement | undefined = Candidates.find(
        (Candidate: TooltipPlacement) => Candidate.FullyVisible
    );

    if (FullyVisible !== undefined)
    {
        return FullyVisible;
    }

    return Candidates.reduce((Best: TooltipPlacement, Candidate: TooltipPlacement) =>
        Candidate.VisibleArea > Best.VisibleArea ? Candidate : Best
    );
}

function OrderedPositions(Preferred: TooltipPosition): ReadonlyArray<TooltipPosition>
{
    const PreferredIndex: number = Positions.indexOf(Preferred);

    return [
        Positions[PreferredIndex] ?? "bottom",
        Positions[(PreferredIndex + 1) % Positions.length] ?? "right",
        Positions[(PreferredIndex + Positions.length - 1) % Positions.length] ?? "left",
        Positions[(PreferredIndex + 2) % Positions.length] ?? "top"
    ];
}

function MakePlacement(
    Position: TooltipPosition,
    Target: TooltipBounds,
    Tooltip: Readonly<{ readonly Height: number; readonly Width: number }>,
    Screen: TooltipScreen
): TooltipPlacement
{
    let Left: number;
    let Top: number;

    switch (Position)
    {
        case "top":
            Left = Target.Left + (Target.Width - Tooltip.Width) / 2;
            Top = Target.Top - Tooltip.Height;
            Left = ClampCrossAxis(Left, Tooltip.Width, Screen.Width);
            break;
        case "right":
            Left = Target.Left + Target.Width;
            Top = Target.Top + (Target.Height - Tooltip.Height) / 2;
            Top = ClampCrossAxis(Top, Tooltip.Height, Screen.Height);
            break;
        case "bottom":
            Left = Target.Left + (Target.Width - Tooltip.Width) / 2;
            Top = Target.Top + Target.Height;
            Left = ClampCrossAxis(Left, Tooltip.Width, Screen.Width);
            break;
        case "left":
            Left = Target.Left - Tooltip.Width;
            Top = Target.Top + (Target.Height - Tooltip.Height) / 2;
            Top = ClampCrossAxis(Top, Tooltip.Height, Screen.Height);
            break;
    }

    Left = Math.round(Left);
    Top = Math.round(Top);
    const VisibleWidth: number = Math.max(
        0,
        Math.min(Screen.Width, Left + Tooltip.Width) - Math.max(0, Left)
    );
    const VisibleHeight: number = Math.max(
        0,
        Math.min(Screen.Height, Top + Tooltip.Height) - Math.max(0, Top)
    );

    return {
        FullyVisible: Left >= 0
            && Top >= 0
            && Left + Tooltip.Width <= Screen.Width
            && Top + Tooltip.Height <= Screen.Height,
        Left,
        Position,
        Top,
        VisibleArea: VisibleWidth * VisibleHeight
    };
}

function ClampCrossAxis(Value: number, Size: number, Available: number): number
{
    if (Size > Available)
    {
        return Value;
    }

    return Math.max(0, Math.min(Available - Size, Value));
}
