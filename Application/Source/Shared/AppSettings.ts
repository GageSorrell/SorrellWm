/**
 * Renderer-safe descriptions of user-configurable application settings.
 *
 * @module @sorrell/wm/Shared/AppSettings
 *
 * @file      AppSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** The Move overlay screen's configurable step sizes and press-and-hold speeds. */
export interface FloatingWindowSettingsDto
{
    /** The fixed speed, in pixels/second, used while the fine-step modifier is held. */
    readonly MoveFineSpeed: number;

    /** The distance, in pixels, a floating window moves per direction command. */
    readonly MoveStepPrimary: number;

    /** The primary step's press-and-hold speed, as a multiple of {@link MoveStepPrimary}. */
    readonly MoveStepPrimarySpeedFactor: number;

    /** The distance, in pixels, a floating window moves per direction command while the modifier is held. */
    readonly MoveStepSecondary: number;

    /** The secondary step's press-and-hold speed, as a multiple of {@link MoveStepSecondary}. */
    readonly MoveStepSecondarySpeedFactor: number;
}

/** A partial update to the floating-window settings; only the given fields are changed. */
export type FloatingWindowSettingsPatch = Partial<FloatingWindowSettingsDto>;

/** Settings that control the transient command overlay and its Focus previews. */
export interface OverlaySettingsDto
{
    /** Opacity percentage of the sampled-color fill in occluded-window Focus previews. */
    readonly FocusPreviewOpacity: number;
}

/** A partial update to the overlay settings; only the given fields are changed. */
export type OverlaySettingsPatch = Partial<OverlaySettingsDto>;

const IsFiniteNumber = (Value: unknown): Value is number =>
    typeof Value === "number" && Number.isFinite(Value);

const IsPercentage = (Value: unknown): Value is number =>
    Number.isInteger(Value) && (Value as number) >= 0 && (Value as number) <= 100;

export/** Determine whether an IPC value is a complete floating-window settings snapshot. */
const IsFloatingWindowSettingsDto = (Value: unknown): Value is FloatingWindowSettingsDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<FloatingWindowSettingsDto>;

    return IsFiniteNumber(Candidate.MoveFineSpeed)
        && IsFiniteNumber(Candidate.MoveStepPrimary)
        && IsFiniteNumber(Candidate.MoveStepPrimarySpeedFactor)
        && IsFiniteNumber(Candidate.MoveStepSecondary)
        && IsFiniteNumber(Candidate.MoveStepSecondarySpeedFactor);
};

export/** Determine whether an IPC value is a valid floating-window settings patch. */
const IsFloatingWindowSettingsPatch = (Value: unknown): Value is FloatingWindowSettingsPatch =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<FloatingWindowSettingsDto>;

    return (Candidate.MoveFineSpeed === undefined || IsFiniteNumber(Candidate.MoveFineSpeed))
        && (Candidate.MoveStepPrimary === undefined || IsFiniteNumber(Candidate.MoveStepPrimary))
        && (
            Candidate.MoveStepPrimarySpeedFactor === undefined
            || IsFiniteNumber(Candidate.MoveStepPrimarySpeedFactor)
        )
        && (Candidate.MoveStepSecondary === undefined || IsFiniteNumber(Candidate.MoveStepSecondary))
        && (
            Candidate.MoveStepSecondarySpeedFactor === undefined
            || IsFiniteNumber(Candidate.MoveStepSecondarySpeedFactor)
        );
};

export/** Determine whether an IPC value is a complete overlay-settings snapshot. */
const IsOverlaySettingsDto = (Value: unknown): Value is OverlaySettingsDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    return IsPercentage((Value as Partial<OverlaySettingsDto>).FocusPreviewOpacity);
};

export/** Determine whether an IPC value is a valid overlay-settings patch. */
const IsOverlaySettingsPatch = (Value: unknown): Value is OverlaySettingsPatch =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Opacity = (Value as Partial<OverlaySettingsDto>).FocusPreviewOpacity;
    return Opacity === undefined || IsPercentage(Opacity);
};
