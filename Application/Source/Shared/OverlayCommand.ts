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
    Home: "Home" as const
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
    Resize: "Resize" as const
} as const);

/** One of the overlay's primary commands. */
export type OverlayCommandId = typeof OverlayCommandId[keyof typeof OverlayCommandId];

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

export/** Get the ordered command definitions available on an overlay screen. */
const GetOverlayCommandDefinitions = (
    ScreenId: OverlayScreenId
): ReadonlyArray<OverlayCommandDefinition> => ScreenId === OverlayScreenId.Focus
    ? FocusCommandDefinitions
    : HomeCommandDefinitions;

/** A primary overlay command prepared for the renderer. */
export interface OverlayCommandTargetDto
{
    /** Raw base64-encoded PNG data for the target application's icon. */
    readonly Icon?: string;

    /** The target window's current title. */
    readonly Title: string;
}

/** A primary overlay command prepared for the renderer. */
export interface OverlayCommandDto extends OverlayCommandDefinition
{
    readonly Disabled: boolean;
    readonly Shortcut: ShortcutDto;
    readonly Target?: OverlayCommandTargetDto;
}

/** A complete renderer-safe snapshot of the current overlay screen. */
export interface OverlayScreenDto
{
    readonly CanGoBack: boolean;
    readonly Commands: ReadonlyArray<OverlayCommandDto>;
    readonly Id: OverlayScreenId;
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
    const Shortcut = Candidate.Shortcut;
    const Modifiers = Shortcut?.Modifiers;

    return IsOverlayCommandId(Candidate.Id)
        && IsHotkeyId(Candidate.HotkeyId)
        && IsBoolean(Candidate.Disabled)
        && typeof Shortcut?.KeyCode === "number"
        && typeof Shortcut.KeyLabel === "string"
        && IsBoolean(Modifiers?.Alt)
        && IsBoolean(Modifiers.Control)
        && IsBoolean(Modifiers.Shift)
        && IsBoolean(Modifiers.Super)
        && (
            Candidate.Target === undefined
            || IsOverlayCommandTargetDto(Candidate.Target)
        );
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
        && IsOverlayScreenId(Candidate.Id);
};
