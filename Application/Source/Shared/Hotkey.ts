/**
 * Serializable hotkey values shared with the renderer.
 *
 * @module @sorrell/wm/Shared/Hotkey
 *
 * @file      Hotkey.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/** Stable identifiers understood by the application's hotkey matcher. */
const HotkeyId = Object.freeze({
    Activate: "Activate" as const,
    Back: "Back" as const,
    Cancel: "Cancel" as const,
    Commit: "Commit" as const,
    CycleNext: "CycleNext" as const,
    CyclePrevious: "CyclePrevious" as const,
    FineModifier: "FineModifier" as const,
    PrimaryModifier: "PrimaryModifier" as const,
    ResizeModifier: "ResizeModifier" as const,
    SelectDown: "SelectDown" as const,
    SelectFirst: "SelectFirst" as const,
    SelectLast: "SelectLast" as const,
    SelectLeft: "SelectLeft" as const,
    SelectMonitor1: "SelectMonitor1" as const,
    SelectMonitor2: "SelectMonitor2" as const,
    SelectMonitor3: "SelectMonitor3" as const,
    SelectMonitor4: "SelectMonitor4" as const,
    SelectMonitor5: "SelectMonitor5" as const,
    SelectMonitor6: "SelectMonitor6" as const,
    SelectMonitor7: "SelectMonitor7" as const,
    SelectMonitor8: "SelectMonitor8" as const,
    SelectMonitor9: "SelectMonitor9" as const,
    SelectRight: "SelectRight" as const,
    SelectUp: "SelectUp" as const,
    Toggle: "Toggle" as const
} as const);

/** One stable identifier understood by the application's hotkey matcher. */
export type HotkeyId = typeof HotkeyId[keyof typeof HotkeyId];

export/** Determine whether an IPC value is a recognized hotkey identifier. */
const IsHotkeyId = (Value: unknown): Value is HotkeyId =>
    typeof Value === "string"
    && (Object.values(HotkeyId) as ReadonlyArray<string>).includes(Value);

/** Modifier state suitable for transfer across the preload boundary. */
export interface ShortcutModifiersDto
{
    readonly Alt: boolean;
    readonly Control: boolean;
    readonly Shift: boolean;
    readonly Super: boolean;
}

/** A renderer-safe description of a configured keyboard shortcut. */
export interface ShortcutDto
{
    readonly KeyCode: number;
    readonly KeyLabel: string;
    readonly Modifiers: ShortcutModifiersDto;
}
