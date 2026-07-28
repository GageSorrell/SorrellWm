/**
 * Renderer-safe descriptions of the overlay's top-level commands.
 *
 * @module @sorrell/wm/Shared/OverlayCommand
 *
 * @file      OverlayCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { HotkeyId, IsHotkeyId, type ShortcutDto } from "./Hotkey.js";

export/** Stable identifiers for the overlay's navigable screens. */
const OverlayScreenId = Object.freeze({
    Focus: "Focus" as const,
    Home: "Home" as const,
    Move: "Move" as const
} as const);

/** One of the overlay's navigable screens. */
export type OverlayScreenId = typeof OverlayScreenId[keyof typeof OverlayScreenId];

export/** Stable identifiers for the overlay's primary commands. */
const OverlayCommandId = Object.freeze({
    Focus: "Focus" as const,
    FocusMoveDown: "FocusMoveDown" as const,
    FocusMoveLeft: "FocusMoveLeft" as const,
    FocusMoveRight: "FocusMoveRight" as const,
    FocusMoveUp: "FocusMoveUp" as const,
    Insert: "Insert" as const,
    Move: "Move" as const,
    MoveWindowDown: "MoveWindowDown" as const,
    MoveWindowLeft: "MoveWindowLeft" as const,
    MoveWindowRight: "MoveWindowRight" as const,
    MoveWindowUp: "MoveWindowUp" as const,
    OpenPerAppSettings: "OpenPerAppSettings" as const,
    Resize: "Resize" as const
} as const);

/** One of the overlay's primary commands. */
export type OverlayCommandId = typeof OverlayCommandId[keyof typeof OverlayCommandId];

export/** The distance, in pixels, a floating window moves per direction command. */
const MoveDistance = Object.freeze({
    Primary: 20 as const,
    Secondary: 50 as const
});

/** The hotkey action that selects a primary overlay command. */
export interface OverlayCommandDefinition
{
    readonly HotkeyId: HotkeyId;
    readonly Id: OverlayCommandId;
}

const HomeCommandDefinitions = Object.freeze([
    { HotkeyId: HotkeyId.SelectLeft, Id: OverlayCommandId.Focus },
    { HotkeyId: HotkeyId.SelectUp, Id: OverlayCommandId.Insert },
    { HotkeyId: HotkeyId.SelectDown, Id: OverlayCommandId.Move },
    { HotkeyId: HotkeyId.SelectRight, Id: OverlayCommandId.Resize }
] as const satisfies ReadonlyArray<OverlayCommandDefinition>);

const FocusCommandDefinitions = Object.freeze([
    { HotkeyId: HotkeyId.SelectLeft, Id: OverlayCommandId.FocusMoveLeft },
    { HotkeyId: HotkeyId.SelectUp, Id: OverlayCommandId.FocusMoveUp },
    { HotkeyId: HotkeyId.SelectDown, Id: OverlayCommandId.FocusMoveDown },
    { HotkeyId: HotkeyId.SelectRight, Id: OverlayCommandId.FocusMoveRight }
] as const satisfies ReadonlyArray<OverlayCommandDefinition>);

const MoveCommandDefinitions = Object.freeze([
    { HotkeyId: HotkeyId.SelectLeft, Id: OverlayCommandId.MoveWindowLeft },
    { HotkeyId: HotkeyId.SelectUp, Id: OverlayCommandId.MoveWindowUp },
    { HotkeyId: HotkeyId.SelectDown, Id: OverlayCommandId.MoveWindowDown },
    { HotkeyId: HotkeyId.SelectRight, Id: OverlayCommandId.MoveWindowRight }
] as const satisfies ReadonlyArray<OverlayCommandDefinition>);

const HomeSecondaryCommandDefinition = Object.freeze({
    HotkeyId: HotkeyId.Toggle,
    Id: OverlayCommandId.OpenPerAppSettings
} as const satisfies OverlayCommandDefinition);

export/** Get the ordered command definitions available on an overlay screen. */
const GetOverlayCommandDefinitions = (
    ScreenId: OverlayScreenId
): ReadonlyArray<OverlayCommandDefinition> =>
{
    switch (ScreenId)
    {
        case OverlayScreenId.Focus:
            return FocusCommandDefinitions;
        case OverlayScreenId.Move:
            return MoveCommandDefinitions;
        case OverlayScreenId.Home:
        default:
            return HomeCommandDefinitions;
    }
};

export/** Get the secondary command definition available on an overlay screen, if any. */
const GetOverlaySecondaryCommandDefinition = (
    ScreenId: OverlayScreenId
): OverlayCommandDefinition | undefined => ScreenId === OverlayScreenId.Home
    ? HomeSecondaryCommandDefinition
    : undefined;

/** A primary overlay command prepared for the renderer. */
export interface OverlayCommandTargetDto
{
    /** Raw base64-encoded PNG data for the target application's icon. */
    readonly Icon: string | undefined;

    /** The target window's current title. */
    readonly Title: string;
}

export/** {@inheritDoc OverlayCommandTargetDto:type} */
const OverlayCommandTargetDto = (Args: Partial<OverlayCommandTargetDto>): OverlayCommandTargetDto =>
    ({ Icon: Args.Icon, Title: Args.Title ?? "Untitled window" });

/** A primary overlay command prepared for the renderer. */
export interface OverlayCommandDto extends OverlayCommandDefinition
{
    readonly Disabled: boolean;
    readonly Shortcut: ShortcutDto;
    readonly Target?: OverlayCommandTargetDto;
}

/** A compact secondary overlay command prepared for the renderer. */
export interface OverlaySecondaryCommandDto extends OverlayCommandDto
{
    /** The name of the application this command applies to, when known. */
    readonly ApplicationName?: string;

    readonly Target?: never;
}

/** The Move screen's live indicator of which move distance is currently active. */
export interface OverlayDistanceToggleDto
{
    /** Whether the secondary distance is currently active (the modifier is held). */
    readonly Active: boolean;

    /** The move distance, in pixels, used while the modifier is not held. */
    readonly PrimaryDistance: number;

    /** The move distance, in pixels, used while the modifier is held. */
    readonly SecondaryDistance: number;

    /** The keybind that toggles between the two distances while held. */
    readonly Shortcut: ShortcutDto;
}

/** Explains why the Focus screen could not move focus to a window. */
export interface OverlayFocusFailureDto
{
    /** The title of the window that could not be focused. */
    readonly WindowTitle: string;
}

/** A complete renderer-safe snapshot of the current overlay screen. */
export interface OverlayScreenDto
{
    readonly CanGoBack: boolean;
    readonly Commands: ReadonlyArray<OverlayCommandDto>;
    readonly DistanceToggle?: OverlayDistanceToggleDto;
    readonly FocusFailure?: OverlayFocusFailureDto;
    readonly Id: OverlayScreenId;
    readonly SecondaryCommand?: OverlaySecondaryCommandDto;
}

export/** Determine whether an IPC value names a primary overlay command. */
const IsOverlayCommandId = (Value: unknown): Value is OverlayCommandId =>
    typeof Value === "string"
    && (Object.values(OverlayCommandId) as ReadonlyArray<string>).includes(Value);

export/** Determine whether an IPC value names a navigable overlay screen. */
const IsOverlayScreenId = (Value: unknown): Value is OverlayScreenId =>
    typeof Value === "string"
    && (Object.values(OverlayScreenId) as ReadonlyArray<string>).includes(Value);

const IsBoolean = (Value: unknown): Value is boolean => typeof Value === "boolean";

const IsOverlayCommandTargetDto = (Value: unknown): Value is OverlayCommandTargetDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<OverlayCommandTargetDto>;

    return typeof Candidate.Title === "string"
        && (Candidate.Icon === undefined || typeof Candidate.Icon === "string");
};

const IsOverlayCommandDto = (Value: unknown): Value is OverlayCommandDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<OverlayCommandDto>;

    return IsOverlayCommandId(Candidate.Id)
        && IsHotkeyId(Candidate.HotkeyId)
        && IsBoolean(Candidate.Disabled)
        && IsShortcutDto(Candidate.Shortcut)
        && (
            Candidate.Target === undefined
            || IsOverlayCommandTargetDto(Candidate.Target)
        );
};

const IsShortcutDto = (Value: unknown): Value is ShortcutDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<ShortcutDto>;
    const Modifiers = Candidate.Modifiers;

    return typeof Candidate.KeyCode === "number"
        && typeof Candidate.KeyLabel === "string"
        && IsBoolean(Modifiers?.Alt)
        && IsBoolean(Modifiers.Control)
        && IsBoolean(Modifiers.Shift)
        && IsBoolean(Modifiers.Super);
};

const IsOverlayDistanceToggleDto = (Value: unknown): Value is OverlayDistanceToggleDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<OverlayDistanceToggleDto>;

    return IsBoolean(Candidate.Active)
        && typeof Candidate.PrimaryDistance === "number"
        && typeof Candidate.SecondaryDistance === "number"
        && IsShortcutDto(Candidate.Shortcut);
};

const IsOverlayFocusFailureDto = (Value: unknown): Value is OverlayFocusFailureDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<OverlayFocusFailureDto>;

    return typeof Candidate.WindowTitle === "string";
};

const IsOverlaySecondaryCommandDto = (Value: unknown): Value is OverlaySecondaryCommandDto =>
{
    if (!IsOverlayCommandDto(Value))
    {
        return false;
    }

    const Candidate = Value as Partial<OverlaySecondaryCommandDto>;

    return Candidate.Target === undefined
        && (Candidate.ApplicationName === undefined || typeof Candidate.ApplicationName === "string");
};

export/** Determine whether an IPC value is a complete valid overlay-screen snapshot. */
const IsOverlayScreenDto = (Value: unknown): Value is OverlayScreenDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<OverlayScreenDto>;

    return IsBoolean(Candidate.CanGoBack)
        && Array.isArray(Candidate.Commands)
        && Candidate.Commands.every(IsOverlayCommandDto)
        && IsOverlayScreenId(Candidate.Id)
        && (
            Candidate.SecondaryCommand === undefined
            || IsOverlaySecondaryCommandDto(Candidate.SecondaryCommand)
        )
        && (
            Candidate.DistanceToggle === undefined
            || IsOverlayDistanceToggleDto(Candidate.DistanceToggle)
        )
        && (
            Candidate.FocusFailure === undefined
            || IsOverlayFocusFailureDto(Candidate.FocusFailure)
        );
};
