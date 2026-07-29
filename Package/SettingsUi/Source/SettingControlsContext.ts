/**
 * The context shared by {@link SettingControlsProvider} and {@link UseSettingControls}.
 *
 * @module @sorrell/settings-ui/SettingControlsContext
 *
 * @file      SettingControlsContext.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { createContext } from "react";
import type { FluentIcon } from "@fluentui/react-icons";
import type { ReactNode } from "react";

/** The icon, title, and subtitle recorded for one addressable {@link Setting} or {@link SettingGroup}. */
export interface SettingControlEntry
{
    /** `Setting` always has one; `SettingGroup`'s is optional. */
    readonly Icon?: FluentIcon | undefined;

    readonly Subtitle?: ReactNode;
    readonly Title: ReactNode;
}

/** Shared state behind {@link SettingControlsProvider} and {@link UseSettingControls}. */
export interface SettingControlsContextValue
{
    /** Every registered {@link SettingControlEntry}, by `Id`. */
    readonly Entries: Readonly<Record<string, SettingControlEntry>>;

    /**
     * Register one addressable component's entry and element, called by {@link Setting} and
     * {@link SettingGroup}. Returns a cleanup function that unregisters it.
     */
    readonly Register: (Id: string, Entry: SettingControlEntry, Element: HTMLElement | null) => () => void;

    /** Scroll to the component registered under `Id`, if any, then pulse its background. */
    readonly ScrollToAndPulse: (Id: string) => void;

    /** Subscribe to pulse requests for `Id`, called by {@link Setting} and {@link SettingGroup}. */
    readonly SubscribePulse: (Id: string, Listener: () => void) => () => void;
}

/** Internal React context shared by the public provider and hooks. */
export const SettingControlsContext = createContext<SettingControlsContextValue | undefined>(undefined);
