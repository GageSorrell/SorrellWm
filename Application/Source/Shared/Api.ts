/**
 * Renderer-safe contracts and IPC channels for the application's preload bridge.
 *
 * @module @sorrell/wm/Shared/ApplicationProgrammingInterface
 *
 * @file      ApplicationProgrammingInterface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { AsyncThunk, Thunk } from "@sorrell/effect/Function";
import type {
    FloatingWindowSettingsDto,
    FloatingWindowSettingsPatch,
    GeneralSettingsDto,
    GeneralSettingsPatch,
    McpServerSettingsDto,
    McpServerSettingsPatch,
    OverlaySettingsDto,
    OverlaySettingsPatch,
    PerAppSettingPatch,
    PerAppSettingsApplicationDto,
    PerAppSettingsEntryDto
} from "./AppSettings.js";
import type { OverlayCommandId, OverlayScreenDto } from "./OverlayCommand.js";
import type { UpdateDownloadResultDto, UpdateStatusDto } from "./Update.js";
import type { BackdropPresentation } from "./Backdrop.js";
import type { FocusPreviewPresentation } from "./FocusPreview.js";
import type { InsertTargetPresentation } from "./InsertTarget.js";
import type { RendererLogEntry } from "./Logging.js";
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
        readonly onChanged: (Listener: (Presentation: FocusPreviewPresentation) => void) => Thunk;
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
        readonly cancel: AsyncThunk;

        /** Return to the floating-window list in the overlay. */
        readonly chooseWindow: AsyncThunk;

        /** Retrieve the current temporary Insert target state. */
        readonly get: () => Promise<InsertTargetPresentation>;

        /** Observe native drag and next-window-capture state changes. */
        readonly onChanged: (
            Listener: (Presentation: InsertTargetPresentation) => void
        ) => Thunk;

        /** Choose whether the next eligible new window should be inserted. */
        readonly setCaptureNext: (Enabled: boolean) => Promise<void>;
    };

    readonly log:
    {
        /** Forward a validated structured renderer log event to the main process. */
        readonly write: (Entry: RendererLogEntry) => void;
    };

    readonly mcpServerSettings:
    {
        /** Retrieve the local MCP server's current enabled state and port. */
        readonly get: () => Promise<McpServerSettingsDto>;

        /** Persist a partial update to the local MCP server's settings. */
        readonly set: (Patch: McpServerSettingsPatch) => Promise<McpServerSettingsDto>;
    };

    readonly overlay:
    {
        /** Return to the preceding overlay screen. */
        readonly back: AsyncThunk;

        /** Retrieve the current overlay-screen snapshot. */
        readonly get: () => Promise<OverlayScreenDto>;

        /** Execute a current-screen command through the main-process command pipeline. */
        readonly invoke: (Id: OverlayCommandId) => Promise<void>;

        /** Select one window from the stack panel currently shown by tiled Focus. */
        readonly selectStackWindow: (Index: number) => Promise<void>;

        /** Preview a directional Focus command, or clear the preview with `null`. */
        readonly preview: (Id: OverlayCommandId | null) => Promise<void>;

        /** Observe changes to the current overlay screen or its command catalog. */
        readonly onChanged: (Listener: (Screen: OverlayScreenDto) => void) => Thunk;
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
        /** Append default per-application settings, choosing an executable when omitted. */
        readonly add: (ExecutablePath?: string) => Promise<PerAppSettingsEntryDto | null>;

        /** Retrieve every configured executable and its presentation metadata. */
        readonly get: () => Promise<ReadonlyArray<PerAppSettingsEntryDto>>;

        /** Retrieve recently opened applications that do not have per-application settings. */
        readonly getRecent: () => Promise<ReadonlyArray<PerAppSettingsApplicationDto>>;

        /** Persist a partial behavior update for one configured executable. */
        readonly set: (
            ExecutablePath: string,
            Patch: PerAppSettingPatch
        ) => Promise<PerAppSettingsEntryDto>;
    };

    readonly platform: string;
    readonly settings:
    {
        /** Open the settings window at a given application settings path. */
        readonly open: (Path: string) => Promise<void>;

        /** Observe requests to navigate the settings window to a given path. */
        readonly onNavigate: (Listener: (Path: string | null) => void) => Thunk;
    };
    readonly theme:
    {
        /** Retrieve the theme currently resolved by Electron and Windows. */
        readonly get: () => Promise<RendererTheme>;

        /** Observe changes to Electron's color scheme or the Windows accent color. */
        readonly onChanged: (Listener: (Theme: RendererTheme) => void) => Thunk;
    };
    readonly update:
    {
        /** Download the latest release's installer and launch it, quitting the app on success. */
        readonly downloadAndInstall: () => Promise<UpdateDownloadResultDto>;

        /** Check GitHub Releases for a newer published version. */
        readonly getStatus: () => Promise<UpdateStatusDto>;
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
    McpServerSettingsGet: "mcp-server-settings:get" as const,
    McpServerSettingsSet: "mcp-server-settings:set" as const,
    OverlayBack: "overlay:back" as const,
    OverlayCommandInvoke: "overlay-command:invoke" as const,
    OverlayFocusPreview: "overlay-focus:preview" as const,
    OverlayScreenChanged: "overlay-screen:changed" as const,
    OverlayScreenGet: "overlay-screen:get" as const,
    OverlaySettingsGet: "overlay-settings:get" as const,
    OverlaySettingsSet: "overlay-settings:set" as const,
    OverlayStackWindowSelect: "overlay-stack-window:select" as const,
    PerAppSettingsAdd: "per-app-settings:add" as const,
    PerAppSettingsGet: "per-app-settings:get" as const,
    PerAppSettingsRecentGet: "per-app-settings:recent-get" as const,
    PerAppSettingsSet: "per-app-settings:set" as const,
    RendererLogWrite: "renderer-log:write" as const,
    SettingsNavigate: "settings:navigate" as const,
    SettingsOpen: "settings:open" as const,
    ThemeChanged: "theme:changed",
    ThemeGet: "theme:get",
    UpdateDownloadAndInstall: "update:download-and-install" as const,
    UpdateStatusGet: "update-status:get" as const
} as const);
