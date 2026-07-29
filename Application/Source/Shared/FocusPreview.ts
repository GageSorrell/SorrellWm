/**
 * Renderer-safe presentation for an occluded-window Focus proxy.
 *
 * @module @sorrell/wm/Shared/FocusPreview
 *
 * @file      FocusPreview.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A proxy-local rectangle hidden so a same-application proxy can show through. */
export interface FocusPreviewExcludedRegion
{
    readonly Bottom: number;
    readonly Left: number;
    readonly Right: number;
    readonly Top: number;
}

/** Content, fill opacity, and clipping rendered by one Focus proxy window. */
export interface FocusPreviewPresentation
{
    /** Explicit fill and border color, used when no application sampling is needed. */
    readonly Color?: `#${string}`;

    /** Regions already represented by an earlier proxy for the same application. */
    readonly ExcludedRegions: ReadonlyArray<FocusPreviewExcludedRegion>;

    /** Raw base64-encoded PNG data for the represented application's icon. */
    readonly Icon?: string;

    /** Sampled-color fill opacity as a percentage from 0 through 100. */
    readonly Opacity: number;

    /** Whether to render the represented application's icon. Defaults to true. */
    readonly ShowIcon?: boolean;
}

const IsFocusPreviewExcludedRegion = (
    Value: unknown
): Value is FocusPreviewExcludedRegion =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<FocusPreviewExcludedRegion>;
    return Number.isFinite(Candidate.Bottom)
        && Number.isFinite(Candidate.Left)
        && Number.isFinite(Candidate.Right)
        && Number.isFinite(Candidate.Top)
        && Candidate.Bottom !== undefined
        && Candidate.Left !== undefined
        && Candidate.Right !== undefined
        && Candidate.Top !== undefined
        && Candidate.Bottom > Candidate.Top
        && Candidate.Right > Candidate.Left;
};

export/** Determine whether an IPC value is a valid Focus proxy presentation. */
const IsFocusPreviewPresentation = (Value: unknown): Value is FocusPreviewPresentation =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<FocusPreviewPresentation>;
    const IsColor = Candidate.Color === undefined
        || /^#[0-9A-Fa-f]{6}$/u.test(Candidate.Color);

    return IsColor
        && Array.isArray(Candidate.ExcludedRegions)
        && Candidate.ExcludedRegions.every(IsFocusPreviewExcludedRegion)
        && (Candidate.Icon === undefined || typeof Candidate.Icon === "string")
        && (Candidate.ShowIcon === undefined || typeof Candidate.ShowIcon === "boolean")
        && Number.isInteger(Candidate.Opacity)
        && Candidate.Opacity !== undefined
        && Candidate.Opacity >= 0
        && Candidate.Opacity <= 100;
};
