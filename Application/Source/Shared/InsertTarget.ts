/**
 * Renderer-safe state for the temporary tiled Insert target.
 *
 * @module @sorrell/wm/Shared/InsertTarget
 *
 * @file      InsertTarget.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Describes the interactive state of the temporary tiled Insert target.
 *
 * @category models
 * @since 0.1.0
 */
export interface InsertTargetPresentation
{
    /** Whether the next eligible newly created window should be captured. */
    readonly CaptureNextWindow: boolean;

    /** Whether a floating window is currently in the native move loop. */
    readonly DragActive: boolean;
}

export/**
       * Checks whether an IPC value is a valid Insert target presentation.
       *
       * @category guards
       * @since 0.1.0
       */
const IsInsertTargetPresentation = (
    Value: unknown
): Value is InsertTargetPresentation =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<InsertTargetPresentation>;
    return typeof Candidate.CaptureNextWindow === "boolean"
        && typeof Candidate.DragActive === "boolean";
};
