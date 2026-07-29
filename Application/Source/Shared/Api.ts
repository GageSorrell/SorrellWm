/**
 *
 *
 * @module @sorrell/wm/Shared/ApplicationProgrammingInterface
 *
 * @file      ApplicationProgrammingInterface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    FloatingWindowSettingsDto,
    FloatingWindowSettingsPatch,
    OverlaySettingsDto,
    OverlaySettingsPatch
} from "./AppSettings.js";
import type { OverlayCommandId, OverlayScreenDto } from "./OverlayCommand.js";
import type { BackdropPresentation } from "./Backdrop.js";
import type { FocusPreviewPresentation } from "./FocusPreview.js";
import type { RendererTheme } from "./Theme.js";
import type { Thunk } from "@sorrell/utility/Function";

/**
 * Runtime versions that are safe to expose to a renderer.
 */
export interface AppVersions
{
    readonly chrome: string;
    readonly electron: string;
    readonly node: string;
}

/**
 * The deliberately small, typed bridge exposed by the preload process.
 */
export interface AppApi
{
    readonly Backdrop:
    {
        /** Observe a request to animate the transient backdrop into view. */
        readonly OnShow: (Listener: (Presentation: BackdropPresentation) => void) => Thunk;
    };

    readonly FloatingWindowSettings:
    {
        /** Retrieve the Move overlay screen's current step sizes and hold speeds. */
        readonly Get: () => Promise<FloatingWindowSettingsDto>;

        /** Persist a partial update to the Move overlay screen's settings. */
        readonly Set: (Patch: FloatingWindowSettingsPatch) => Promise<FloatingWindowSettingsDto>;
    };

    readonly FocusPreview:
    {
        /** Observe presentation changes for this occluded-window Focus proxy. */
        readonly onChanged: (
            Listener: (Presentation: FocusPreviewPresentation) => void
        ) => () => void;
    };

    readonly Overlay:
    {
        /** Return to the preceding overlay screen. */
        readonly back: () => Promise<void>;

        /** Retrieve the current overlay-screen snapshot. */
        readonly get: () => Promise<OverlayScreenDto>;

        /** Execute a current-screen command through the main-process command pipeline. */
        readonly invoke: (Id: OverlayCommandId) => Promise<void>;

        /** Preview a directional Focus command, or clear the preview with `null`. */
        readonly preview: (Id: OverlayCommandId | null) => Promise<void>;

        /** Observe changes to the current overlay screen or its command catalog. */
        readonly onChanged: (
            Listener: (Screen: OverlayScreenDto) => void
        ) => () => void;
    };

    readonly OverlaySettings:
    {
        /** Retrieve settings that control the command overlay and Focus previews. */
        readonly get: () => Promise<OverlaySettingsDto>;

        /** Persist a partial update to the overlay settings. */
        readonly set: (Patch: OverlaySettingsPatch) => Promise<OverlaySettingsDto>;
    };

    readonly platform: string;
    readonly settings:
    {
        /** Observe requests to navigate the settings window to a given path. */
        readonly onNavigate: (Listener: (Path: string | null) => void) => () => void;
    };
    readonly theme:
    {
        /** Retrieve the theme currently resolved by Electron and Windows. */
        readonly get: () => Promise<RendererTheme>;

        /** Observe changes to Electron's color scheme or the Windows accent color. */
        readonly onChanged: (Listener: (Theme: RendererTheme) => void) => () => void;
    };
    readonly versions: AppVersions;
}

export/** IPC channel names shared by the main and preload processes. */
const AppApiChannel = Object.freeze({
    BackdropShow: "backdrop:show" as const,
    FloatingWindowSettingsGet: "floating-window-settings:get" as const,
    FloatingWindowSettingsSet: "floating-window-settings:set" as const,
    FocusPreviewChanged: "focus-preview:changed" as const,
    OverlayBack: "overlay:back" as const,
    OverlayCommandInvoke: "overlay-command:invoke" as const,
    OverlayFocusPreview: "overlay-focus:preview" as const,
    OverlayScreenChanged: "overlay-screen:changed" as const,
    OverlayScreenGet: "overlay-screen:get" as const,
    OverlaySettingsGet: "overlay-settings:get" as const,
    OverlaySettingsSet: "overlay-settings:set" as const,
    SettingsNavigate: "settings:navigate" as const,
    ThemeChanged: "theme:changed",
    ThemeGet: "theme:get"
} as const);
