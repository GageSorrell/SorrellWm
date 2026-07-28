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

export/** Create a complete overlay-screen snapshot from the current settings. */
const FromKeybindSettings = (
    ScreenId: OverlayCommand.OverlayScreenId,
    Values: ReadonlyArray<Hotkey.KeybindSetting>,
    FocusTargetValues: FocusTargets = { },
    ApplicationTarget?: OverlayApplicationTarget
): OverlayCommand.OverlayScreenDto =>
{
    const Keybinds = Hotkey.WithDefaultKeybindSettings(Values);
    const Commands = new Array<OverlayCommand.OverlayCommandDto>();

    for (const Definition of OverlayCommand.GetOverlayCommandDefinitions(ScreenId))
    {
        const Keybind = Keybinds.find((Value: Hotkey.KeybindSetting) =>
            Value.Id === Definition.HotkeyId);

        if (Keybind !== undefined)
        {
            const Target = FocusTargetValues[Definition.Id];

            Commands.push(Object.freeze({
                ...Definition,
                Disabled: ScreenId === OverlayCommand.OverlayScreenId.Focus && Target === undefined,
                Shortcut: Object.freeze({
                    KeyCode: Keybind.Key,
                    KeyLabel: GetKeyLabel(Keybind.Key),
                    Modifiers: Object.freeze({ ...Keybind.Modifiers })
                }),
                ...(Target === undefined ? { } : { Target: Object.freeze(Target) })
            }));
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

    return Object.freeze({
        CanGoBack: ScreenId !== OverlayCommand.OverlayScreenId.Home,
        Commands: Object.freeze(Commands),
        Id: ScreenId,
        ...(SecondaryCommand === undefined ? { } : { SecondaryCommand })
    });
};
