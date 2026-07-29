/**
 * Project configured hotkeys into the overlay's renderer-safe command catalog.
 *
 * @module @sorrell/wm/Main/Overlay/CommandCatalog
 *
 * @file      CommandCatalog.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "../Input/Hotkey.ts";
import * as OverlayCommand from "../../Shared/OverlayCommand.js";
import type { TiledResizeBehavior } from "../../Shared/AppSettings.ts";
import { VK } from "@sorrell/windows";

const VirtualKeyNames = new Map<number, string>();

for (const [ Name, Value ] of Object.entries(VK))
{
    if (Name !== "VK" && typeof Value === "number" && !VirtualKeyNames.has(Value))
    {
        VirtualKeyNames.set(Value, Name);
    }
}

const GetKeyLabel = (Key: number): string =>
{
    const Name = VirtualKeyNames.get(Key);

    if (Name === undefined)
    {
        return `0x${ Key.toString(16).toUpperCase() }`;
    }

    return /^D[0-9]$/u.test(Name) ? Name.slice(1) : Name.replaceAll("_", " ");
};

/** Target-window metadata keyed by a directional Focus command. */
export type FocusTargets = Readonly<Partial<
    Record<OverlayCommand.OverlayCommandId, OverlayCommand.OverlayCommandTargetDto>
>>;

/** The application over which an overlay is currently displayed. */
export interface OverlayApplicationTarget
{
    readonly Name?: string;
}

/** Renderer metadata and availability for one physical monitor shortcut. */
export interface MonitorCommandState
{
    readonly Disabled: boolean;
    readonly Target: OverlayCommand.OverlayCommandTargetDto;
}

/** Monitor command state indexed by its stable numeric-focus command ID. */
export type MonitorCommandStates = Readonly<Partial<Record<
    OverlayCommand.OverlayCommandId,
    MonitorCommandState
>>>;

export/** Create a complete overlay-screen snapshot from the current settings. */
const FromKeybindSettings = (
    ScreenId: OverlayCommand.OverlayScreenId,
    Values: ReadonlyArray<Hotkey.KeybindSetting>,
    FocusTargetValues: FocusTargets = { },
    ApplicationTarget?: OverlayApplicationTarget,
    PrimaryModifierHeld: boolean = false,
    FineModifierHeld: boolean = false,
    PrimaryDistance: number = OverlayCommand.MoveDistance.Primary,
    SecondaryDistance: number = OverlayCommand.MoveDistance.Secondary,
    CurrentResizeMode: OverlayCommand.ResizeMode = OverlayCommand.ResizeMode.Grow,
    IsRootPanelFocused: boolean = false,
    MonitorStates: MonitorCommandStates = { },
    CanTileAll: boolean = false,
    DisabledCommandIds: ReadonlySet<OverlayCommand.OverlayCommandId> = new Set(),
    IsTiledMovePanelTargeted: boolean = false,
    StackWindows: ReadonlyArray<OverlayCommand.OverlayStackWindowDto> = [ ],
    CurrentTiledResizeBehavior: TiledResizeBehavior = "PreserveRatios",
    InsertWindows: ReadonlyArray<OverlayCommand.OverlayInsertWindowDto> = [ ]
): OverlayCommand.OverlayScreenDto =>
{
    const Keybinds = Hotkey.WithDefaultKeybindSettings(Values);
    const Commands = new Array<OverlayCommand.OverlayCommandDto>();
    const MonitorCommands = new Array<OverlayCommand.OverlayCommandDto>();

    for (const Definition of OverlayCommand.GetOverlayCommandDefinitions(ScreenId))
    {
        if (Definition.Id === OverlayCommand.OverlayCommandId.TileAll && !CanTileAll)
        {
            continue;
        }

        const IsMonitorCommand = OverlayCommand.IsFocusMonitorCommandId(Definition.Id);
        const MonitorState = MonitorStates[Definition.Id];
        if (IsMonitorCommand && MonitorState === undefined)
        {
            continue;
        }

        const Keybind = Keybinds.find((Value: Hotkey.KeybindSetting) =>
            Value.Id === Definition.HotkeyId);

        if (Keybind !== undefined)
        {
            const Target = FocusTargetValues[Definition.Id];
            const CommandTarget = MonitorState?.Target ?? Target;
            const Command = Object.freeze({
                Disabled: DisabledCommandIds.has(Definition.Id)
                    || (
                        MonitorState?.Disabled ?? (
                            (
                                ScreenId === OverlayCommand.OverlayScreenId.FloatingFocus
                                || ScreenId === OverlayCommand.OverlayScreenId.TiledFocus
                            ) && CommandTarget === undefined
                        )
                    ),
                HotkeyId: Definition.HotkeyId,
                Id: Definition.Id,
                Shortcut: Object.freeze({
                    KeyCode: Keybind.Key,
                    KeyLabel: GetKeyLabel(Keybind.Key),
                    Modifiers: Object.freeze({
                        ...Keybind.Modifiers,
                        ...Definition.RequiredModifiers
                    })
                }),
                ...(CommandTarget === undefined
                    ? { }
                    : { Target: Object.freeze(CommandTarget) })
            });

            (IsMonitorCommand ? MonitorCommands : Commands).push(Command);
        }
    }

    const SecondaryDefinition = ApplicationTarget === undefined
        ? undefined
        : OverlayCommand.GetOverlaySecondaryCommandDefinition(ScreenId);
    const SecondaryKeybind = SecondaryDefinition === undefined
        ? undefined
        : Keybinds.find((Value: Hotkey.KeybindSetting) =>
            Value.Id === SecondaryDefinition.HotkeyId);
    const SecondaryCommand = SecondaryDefinition === undefined || SecondaryKeybind === undefined
        ? undefined
        : Object.freeze({
            ...SecondaryDefinition,
            Disabled: false,
            Shortcut: Object.freeze({
                KeyCode: SecondaryKeybind.Key,
                KeyLabel: GetKeyLabel(SecondaryKeybind.Key),
                Modifiers: Object.freeze({ ...SecondaryKeybind.Modifiers })
            }),
            ...(ApplicationTarget?.Name === undefined ? { } : { ApplicationName: ApplicationTarget.Name })
        });

    // The Resize screen reuses the Move screen's step-size functionality
    // exactly (same settings, same modifiers), so the same live indicator
    // applies to both.
    const UsesMoveDistances = ScreenId === OverlayCommand.OverlayScreenId.FloatingMove
        || ScreenId === OverlayCommand.OverlayScreenId.FloatingResize
        || ScreenId === OverlayCommand.OverlayScreenId.TiledResize;
    const ModifierKeybind = UsesMoveDistances
        ? Keybinds.find((Value: Hotkey.KeybindSetting) => Value.Id === Hotkey.Id.PrimaryModifier)
        : undefined;
    const FineModifierKeybind = UsesMoveDistances
        ? Keybinds.find((Value: Hotkey.KeybindSetting) => Value.Id === Hotkey.Id.FineModifier)
        : undefined;
    const DistanceToggle = ModifierKeybind === undefined || FineModifierKeybind === undefined
        ? undefined
        : Object.freeze({
            Active: PrimaryModifierHeld,
            FineActive: FineModifierHeld,
            FineDistance: OverlayCommand.MoveDistance.Fine,
            FineShortcut: Object.freeze({
                KeyCode: FineModifierKeybind.Key,
                KeyLabel: GetKeyLabel(FineModifierKeybind.Key),
                Modifiers: Object.freeze({ ...FineModifierKeybind.Modifiers })
            }),
            PrimaryDistance,
            SecondaryDistance,
            Shortcut: Object.freeze({
                KeyCode: ModifierKeybind.Key,
                KeyLabel: GetKeyLabel(ModifierKeybind.Key),
                Modifiers: Object.freeze({ ...ModifierKeybind.Modifiers })
            })
        });

    return Object.freeze({
        CanGoBack: ScreenId !== OverlayCommand.OverlayScreenId.FloatingHome
            && ScreenId !== OverlayCommand.OverlayScreenId.TiledHome,
        Commands: Object.freeze(Commands),
        Id: ScreenId,
        ...(InsertWindows.length === 0
            ? { }
            : { InsertWindows: Object.freeze([ ...InsertWindows ]) }),
        ...(IsRootPanelFocused ? { IsRootPanelFocused: true } : { }),
        ...(IsTiledMovePanelTargeted ? { IsTiledMovePanelTargeted: true } : { }),
        ...(MonitorCommands.length === 0
            ? { }
            : { MonitorCommands: Object.freeze(MonitorCommands) }),
        ...(DistanceToggle === undefined ? { } : { DistanceToggle }),
        ...(
            ScreenId === OverlayCommand.OverlayScreenId.FloatingResize
                || ScreenId === OverlayCommand.OverlayScreenId.TiledResize
                ? { ResizeMode: CurrentResizeMode }
                : { }
        ),
        ...(SecondaryCommand === undefined ? { } : { SecondaryCommand }),
        ...(StackWindows.length === 0
            ? { }
            : { StackWindows: Object.freeze([ ...StackWindows ]) }),
        ...(ScreenId === OverlayCommand.OverlayScreenId.TiledResize
            ? { TiledResizeBehavior: CurrentTiledResizeBehavior }
            : { })
    });
};
