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
    GeneralSettingsDto,
    GeneralSettingsPatch,
    OverlaySettingsDto,
    OverlaySettingsPatch,
    PerAppSettingPatch,
    PerAppSettingsEntryDto
} from "./AppSettings.js";
import type { OverlayCommandId, OverlayScreenDto } from "./OverlayCommand.js";
import type { BackdropPresentation } from "./Backdrop.js";
import type { FocusPreviewPresentation } from "./FocusPreview.js";
import type { InsertTargetPresentation } from "./InsertTarget.js";
import type { RendererLogEntry } from "./Logging.js";
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
    readonly backdrop:
    {
        /** Observe a request to animate the transient backdrop into view. */
        readonly onShow: (Listener: (Presentation: BackdropPresentation) => void) => Thunk;
    };

    readonly floatingWindowSettings:
    {
        /** Retrieve the Move overlay screen's current step sizes and hold speeds. */
        readonly get: () => Promise<FloatingWindowSettingsDto>;

        /** Persist a partial update to the Move overlay screen's settings. */
        readonly set: (Patch: FloatingWindowSettingsPatch) => Promise<FloatingWindowSettingsDto>;
    };

    readonly focusPreview:
    {
        /** Observe presentation changes for this occluded-window Focus proxy. */
        readonly onChanged: (
            Listener: (Presentation: FocusPreviewPresentation) => void
        ) => () => void;
    };

    readonly generalSettings:
    {
        /** Retrieve general window-manager behavior settings. */
        readonly get: () => Promise<GeneralSettingsDto>;

        /** Persist a partial update to general window-manager behavior. */
        readonly set: (Patch: GeneralSettingsPatch) => Promise<GeneralSettingsDto>;
    };

    readonly insertTarget:
    {
        /** Cancel the tiled Insert flow and close the temporary target. */
        readonly cancel: () => Promise<void>;

        /** Return to the floating-window list in the overlay. */
        readonly chooseWindow: () => Promise<void>;

        /** Retrieve the current temporary Insert target state. */
        readonly get: () => Promise<InsertTargetPresentation>;

        /** Observe native drag and next-window-capture state changes. */
        readonly onChanged: (
            Listener: (Presentation: InsertTargetPresentation) => void
        ) => () => void;

        /** Choose whether the next eligible new window should be inserted. */
        readonly setCaptureNext: (Enabled: boolean) => Promise<void>;
    };

    readonly log:
    {
        /** Forward a validated structured renderer log event to the main process. */
        readonly write: (Entry: RendererLogEntry) => void;
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

    readonly overlaySettings:
    {
        /** Retrieve settings that control the command overlay and Focus previews. */
        readonly get: () => Promise<OverlaySettingsDto>;

        /** Persist a partial update to the overlay settings. */
        readonly set: (Patch: OverlaySettingsPatch) => Promise<OverlaySettingsDto>;
    };

    readonly perAppSettings:
    {
        /** Choose an executable and append its default per-application settings. */
        readonly add: () => Promise<PerAppSettingsEntryDto | null>;

        /** Retrieve every configured executable and its presentation metadata. */
        readonly get: () => Promise<ReadonlyArray<PerAppSettingsEntryDto>>;

        /** Persist a partial behavior update for one configured executable. */
        readonly set: (
            ExecutablePath: string,
            Patch: PerAppSettingPatch
        ) => Promise<PerAppSettingsEntryDto>;
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
    GeneralSettingsGet: "general-settings:get" as const,
    GeneralSettingsSet: "general-settings:set" as const,
    InsertTargetCancel: "insert-target:cancel" as const,
    InsertTargetChanged: "insert-target:changed" as const,
    InsertTargetChooseWindow: "insert-target:choose-window" as const,
    InsertTargetGet: "insert-target:get" as const,
    InsertTargetSetCaptureNext: "insert-target:set-capture-next" as const,
    OverlayBack: "overlay:back" as const,
    OverlayCommandInvoke: "overlay-command:invoke" as const,
    OverlayFocusPreview: "overlay-focus:preview" as const,
    OverlayScreenChanged: "overlay-screen:changed" as const,
    OverlayScreenGet: "overlay-screen:get" as const,
    OverlaySettingsGet: "overlay-settings:get" as const,
    OverlaySettingsSet: "overlay-settings:set" as const,
    PerAppSettingsAdd: "per-app-settings:add" as const,
    PerAppSettingsGet: "per-app-settings:get" as const,
    PerAppSettingsSet: "per-app-settings:set" as const,
    RendererLogWrite: "renderer-log:write" as const,
    SettingsNavigate: "settings:navigate" as const,
    ThemeChanged: "theme:changed",
    ThemeGet: "theme:get"
} as const);
