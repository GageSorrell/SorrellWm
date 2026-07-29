/**
 * The public hook for listing and jumping to registered settings components.
 *
 * @module @sorrell/settings-ui/UseSettingControls
 *
 * @file      UseSettingControls.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useContext } from "react";
import type { SettingControlEntry } from "./SettingControlsContext.js";
import { SettingControlsContext } from "./SettingControlsContext.js";

/** Return value of {@link UseSettingControls}. */
export interface UseSettingControlsResult
{
    /** Every addressable {@link Setting}/{@link SettingGroup}'s title and subtitle, by `Id`. */
    readonly Controls: Readonly<Record<string, SettingControlEntry>>;

    /**
     * Scroll to the {@link Setting}/{@link SettingGroup} registered under `Id`, if any, then
     * pulse its background.
     */
    readonly ScrollToAndPulse: (Id: string) => void;
}

/**
 * List every {@link Setting} and {@link SettingGroup} that declares an `Id`, and jump to one of
 * them on demand. Must be used beneath a {@link SettingControlsProvider}.
 */
export function UseSettingControls(): UseSettingControlsResult
{
    const Context = useContext(SettingControlsContext);

    if (Context === undefined)
    {
        throw new Error("UseSettingControls must be used within a SettingControlsProvider.");
    }

    return { Controls: Context.Entries, ScrollToAndPulse: Context.ScrollToAndPulse };
}
