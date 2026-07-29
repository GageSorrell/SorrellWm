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

/** Content and fill opacity rendered by one Focus proxy window. */
export interface FocusPreviewPresentation
{
    /** Raw base64-encoded PNG data for the represented application's icon. */
    readonly Icon?: string;

    /** Sampled-color fill opacity as a percentage from 0 through 100. */
    readonly Opacity: number;
}

export/** Determine whether an IPC value is a valid Focus proxy presentation. */
const IsFocusPreviewPresentation = (Value: unknown): Value is FocusPreviewPresentation =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<FocusPreviewPresentation>;

    return (Candidate.Icon === undefined || typeof Candidate.Icon === "string")
        && Number.isInteger(Candidate.Opacity)
        && Candidate.Opacity !== undefined
        && Candidate.Opacity >= 0
        && Candidate.Opacity <= 100;
};
