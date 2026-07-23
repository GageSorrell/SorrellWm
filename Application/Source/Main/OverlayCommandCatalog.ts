/**
 * Project configured hotkeys into the overlay's renderer-safe command catalog.
 *
 * @module @sorrell/wm/Main/OverlayCommandCatalog
 *
 * @file      OverlayCommandCatalog.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "./Hotkey.js";
import {
    GetOverlayCommandDefinitions,
    type OverlayCommandDto,
    type OverlayScreenDto,
    OverlayScreenId
} from "../Shared/OverlayCommand.js";
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

export/** Create a complete overlay-screen snapshot from the current settings. */
const FromKeybindSettings = (
    ScreenId: OverlayScreenId,
    Values: ReadonlyArray<Hotkey.KeybindSetting>
): OverlayScreenDto =>
{
    const Keybinds = Hotkey.WithDefaultKeybindSettings(Values);
    const Commands = new Array<OverlayCommandDto>();

    for (const Definition of GetOverlayCommandDefinitions(ScreenId))
    {
        const Keybind = Keybinds.find((Value: Hotkey.KeybindSetting) =>
            Value.Id === Definition.HotkeyId);

        if (Keybind !== undefined)
        {
            Commands.push(Object.freeze({
                ...Definition,
                Shortcut: Object.freeze({
                    KeyCode: Keybind.Key,
                    KeyLabel: GetKeyLabel(Keybind.Key),
                    Modifiers: Object.freeze({ ...Keybind.Modifiers })
                })
            }));
        }
    }

    return Object.freeze({
        CanGoBack: ScreenId !== OverlayScreenId.Home,
        Commands: Object.freeze(Commands),
        Id: ScreenId
    });
};
