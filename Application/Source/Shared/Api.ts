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

import type { OverlayCommandId, OverlayScreenDto } from "./OverlayCommand.js";
import type { BackdropPresentation } from "./Backdrop.js";
import type { RendererTheme } from "./Theme.js";

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
    readonly backdrop:
    {
        /** Observe a request to animate the transient backdrop into view. */
        readonly onShow: (
            Listener: (Presentation: BackdropPresentation) => void
        ) => () => void;
    };

    readonly overlay:
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

    readonly platform: string;
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
    OverlayBack: "overlay:back" as const,
    OverlayCommandInvoke: "overlay-command:invoke" as const,
    OverlayFocusPreview: "overlay-focus:preview" as const,
    OverlayScreenChanged: "overlay-screen:changed" as const,
    OverlayScreenGet: "overlay-screen:get" as const,
    ThemeChanged: "theme:changed",
    ThemeGet: "theme:get"
} as const);
