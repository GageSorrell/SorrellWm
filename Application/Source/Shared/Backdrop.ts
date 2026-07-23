/**
 * Data shared with the renderer when presenting the transient backdrop.
 *
 * @module @sorrell/wm/Shared/Backdrop
 *
 * @file      Backdrop.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** The target appearance and timing of one backdrop presentation. */
export interface BackdropPresentation
{
    readonly DurationMilliseconds: number;
    readonly Intensity: number;
}

export/** Determine whether an IPC value is a valid backdrop presentation. */
const IsBackdropPresentation = (
    Value: unknown
): Value is BackdropPresentation =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<BackdropPresentation>;

    return Number.isInteger(Candidate.DurationMilliseconds)
        && (Candidate.DurationMilliseconds ?? -1) >= 0
        && Number.isInteger(Candidate.Intensity)
        && (Candidate.Intensity ?? -1) >= 0
        && (Candidate.Intensity ?? 101) <= 100;
};
