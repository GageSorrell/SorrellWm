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

/** General window-manager behavior exposed to the settings renderer. */
export interface GeneralSettingsDto
{
    /** Tile existing floating windows when SorrellWm starts. */
    readonly TileExistingWindowsOnStartup: boolean;

    /** Pixels between tiled windows and between tiles and their monitor edges. */
    readonly TiledWindowGap: number;
}

/** A partial update to the general window-manager settings. */
export type GeneralSettingsPatch = Partial<GeneralSettingsDto>;

/** Settings that control the transient command overlay and its Focus previews. */
export interface OverlaySettingsDto
{
    /** Opacity percentage of the sampled-color fill in occluded-window Focus previews. */
    readonly FocusPreviewOpacity: number;
}

/** A partial update to the overlay settings; only the given fields are changed. */
export type OverlaySettingsPatch = Partial<OverlaySettingsDto>;

export/** Every supported behavior for a newly created application window. */
const NewWindowBehaviors = Object.freeze([
    "InsertBeforeCurrent",
    "InsertAfterCurrent",
    "FloatCenter",
    "FloatCurrent",
    "RPC"
] as const);

/** How a newly created application window should enter the managed desktop. */
export type NewWindowBehavior = typeof NewWindowBehaviors[number];

/** User-configurable behavior for one executable. */
export interface PerAppSettingDto
{
    readonly IgnoreModal: boolean;
    readonly NewWindowBehavior: NewWindowBehavior;
}

/** Renderer-safe settings and presentation metadata for one executable. */
export interface PerAppSettingsEntryDto extends PerAppSettingDto
{
    readonly ExecutablePath: string;
    readonly FriendlyName: string;
    readonly Icon?: string;
}

/** A partial update to one executable's window-manager behavior. */
export type PerAppSettingPatch = Partial<PerAppSettingDto>;

const IsFiniteNumber = (Value: unknown): Value is number =>
    typeof Value === "number" && Number.isFinite(Value);

const IsNonNegativeInteger = (Value: unknown): Value is number =>
    Number.isInteger(Value) && (Value as number) >= 0;

export/** Determine whether an IPC value is a complete general-settings snapshot. */
const IsGeneralSettingsDto = (Value: unknown): Value is GeneralSettingsDto =>
    typeof Value === "object"
    && Value !== null
    && typeof (Value as Partial<GeneralSettingsDto>).TileExistingWindowsOnStartup === "boolean"
    && IsNonNegativeInteger((Value as Partial<GeneralSettingsDto>).TiledWindowGap);

export/** Determine whether an IPC value is a valid general-settings patch. */
const IsGeneralSettingsPatch = (Value: unknown): Value is GeneralSettingsPatch =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<GeneralSettingsDto>;
    return (
        Candidate.TileExistingWindowsOnStartup === undefined
        || typeof Candidate.TileExistingWindowsOnStartup === "boolean"
    ) && (
        Candidate.TiledWindowGap === undefined
        || IsNonNegativeInteger(Candidate.TiledWindowGap)
    );
};

const IsPercentage = (Value: unknown): Value is number =>
    Number.isInteger(Value) && (Value as number) >= 0 && (Value as number) <= 100;

export/** Determine whether a value is a supported new-window behavior. */
const IsNewWindowBehavior = (Value: unknown): Value is NewWindowBehavior =>
    typeof Value === "string"
    && (NewWindowBehaviors as ReadonlyArray<string>).includes(Value);

export/** Determine whether an IPC value is a complete per-executable settings entry. */
const IsPerAppSettingsEntryDto = (Value: unknown): Value is PerAppSettingsEntryDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<PerAppSettingsEntryDto>;
    return typeof Candidate.ExecutablePath === "string"
        && Candidate.ExecutablePath.trim().length > 0
        && typeof Candidate.FriendlyName === "string"
        && Candidate.FriendlyName.trim().length > 0
        && (Candidate.Icon === undefined || typeof Candidate.Icon === "string")
        && typeof Candidate.IgnoreModal === "boolean"
        && IsNewWindowBehavior(Candidate.NewWindowBehavior);
};

export/** Determine whether an IPC value is a list of per-executable settings entries. */
const IsPerAppSettingsEntriesDto = (
    Value: unknown
): Value is ReadonlyArray<PerAppSettingsEntryDto> =>
    Array.isArray(Value) && Value.every(IsPerAppSettingsEntryDto);

export/** Determine whether an IPC value is a valid per-executable settings patch. */
const IsPerAppSettingPatch = (Value: unknown): Value is PerAppSettingPatch =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<PerAppSettingDto>;
    return (Candidate.IgnoreModal === undefined || typeof Candidate.IgnoreModal === "boolean")
        && (
            Candidate.NewWindowBehavior === undefined
            || IsNewWindowBehavior(Candidate.NewWindowBehavior)
        );
};

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
