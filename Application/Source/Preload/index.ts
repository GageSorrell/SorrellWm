/**
 * The preload script of `@sorrell/wm`.
 *
 * @module @sorrell/wm/Preload
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type AppApi, AppApiChannel } from "../Shared/Api.ts";
import {
    type BackdropPresentation,
    IsBackdropPresentation
} from "../Shared/Backdrop.ts";
import {
    type FloatingWindowSettingsDto,
    type FloatingWindowSettingsPatch,
    type GeneralSettingsDto,
    type GeneralSettingsPatch,
    IsFloatingWindowSettingsDto,
    IsGeneralSettingsDto,
    IsGeneralSettingsPatch,
    IsOverlaySettingsDto,
    IsPerAppSettingPatch,
    IsPerAppSettingsApplicationsDto,
    IsPerAppSettingsEntriesDto,
    IsPerAppSettingsEntryDto,
    type OverlaySettingsDto,
    type OverlaySettingsPatch,
    type PerAppSettingPatch,
    type PerAppSettingsApplicationDto,
    type PerAppSettingsEntryDto
} from "../Shared/AppSettings.ts";
import {
    type FocusPreviewPresentation,
    IsFocusPreviewPresentation
} from "../Shared/FocusPreview.ts";
import {
    type InsertTargetPresentation,
    IsInsertTargetPresentation
} from "../Shared/InsertTarget.ts";
import {
    IsOverlayCommandId,
    IsOverlayScreenDto,
    type OverlayCommandId,
    type OverlayScreenDto
} from "../Shared/OverlayCommand.ts";
import { IsRendererTheme, type RendererTheme } from "../Shared/Theme.ts";
import {
    IsUpdateDownloadResultDto,
    IsUpdateStatusDto,
    type UpdateDownloadResultDto,
    type UpdateStatusDto
} from "../Shared/Update.ts";
import type { IpcRendererEvent } from "electron";
import type { RendererLogEntry } from "../Shared/Logging.ts";
import electron from "electron";

const { contextBridge, ipcRenderer } = electron;

const WriteRendererLog = (Entry: RendererLogEntry): void =>
{
    ipcRenderer.send(AppApiChannel.RendererLogWrite, Entry);
};

const BackdropListeners = new Set<(Presentation: BackdropPresentation) => void>();
let LatestBackdropPresentation: BackdropPresentation | undefined;

ipcRenderer.on(AppApiChannel.BackdropShow, (_Event: IpcRendererEvent, Value: unknown): void =>
{
    if (!IsBackdropPresentation(Value))
    {
        return;
    }

    LatestBackdropPresentation = Value;
    for (const Listener of BackdropListeners)
    {
        Listener(Value);
    }
});

const OnBackdropShow = (
    Listener: (Presentation: BackdropPresentation) => void
): (() => void) =>
{
    BackdropListeners.add(Listener);

    if (LatestBackdropPresentation !== undefined)
    {
        const Presentation: BackdropPresentation = LatestBackdropPresentation;
        queueMicrotask((): void => Listener(Presentation));
    }

    return () => void BackdropListeners.delete(Listener);
};

const FocusPreviewListeners = new Set<(
    Presentation: FocusPreviewPresentation
) => void>();
let LatestFocusPreviewPresentation: FocusPreviewPresentation | undefined;

ipcRenderer.on(AppApiChannel.FocusPreviewChanged, (
    _Event: IpcRendererEvent,
    Value: unknown
): void =>
{
    if (!IsFocusPreviewPresentation(Value))
    {
        return;
    }

    LatestFocusPreviewPresentation = Value;
    for (const Listener of FocusPreviewListeners)
    {
        Listener(Value);
    }
});

const OnFocusPreviewChanged = (
    Listener: (Presentation: FocusPreviewPresentation) => void
): (() => void) =>
{
    FocusPreviewListeners.add(Listener);

    if (LatestFocusPreviewPresentation !== undefined)
    {
        const Presentation = LatestFocusPreviewPresentation;
        queueMicrotask((): void => Listener(Presentation));
    }

    return () => void FocusPreviewListeners.delete(Listener);
};

const SettingsNavigateListeners = new Set<(Path: string | null) => void>();
let LatestSettingsPath: string | null | undefined;

const IsSettingsPath = (Value: unknown): Value is string | null =>
    Value === null || typeof Value === "string";

ipcRenderer.on(AppApiChannel.SettingsNavigate, (_Event: IpcRendererEvent, Value: unknown): void =>
{
    if (!IsSettingsPath(Value))
    {
        return;
    }

    LatestSettingsPath = Value;
    for (const Listener of SettingsNavigateListeners)
    {
        Listener(Value);
    }
});

const OnSettingsNavigate = (
    Listener: (Path: string | null) => void
): (() => void) =>
{
    SettingsNavigateListeners.add(Listener);

    if (LatestSettingsPath !== undefined)
    {
        const Path: string | null = LatestSettingsPath;
        queueMicrotask((): void => Listener(Path));
    }

    return () => void SettingsNavigateListeners.delete(Listener);
};

const OpenSettings = async (Path: string): Promise<void> =>
    void await ipcRenderer.invoke(AppApiChannel.SettingsOpen, Path);

const BackOverlayScreen = async (): Promise<void> =>
    void await ipcRenderer.invoke(AppApiChannel.OverlayBack);

const GetOverlayScreen = async (): Promise<OverlayScreenDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.OverlayScreenGet);

    if (!IsOverlayScreenDto(Response))
    {
        throw new TypeError("The main process returned an invalid overlay screen.");
    }

    return Response;
};

const InvokeOverlayCommand = async (Id: OverlayCommandId): Promise<void> =>
{
    if (!IsOverlayCommandId(Id))
    {
        throw new TypeError("The requested overlay command is invalid.");
    }

    await ipcRenderer.invoke(AppApiChannel.OverlayCommandInvoke, Id);
};

const SelectOverlayStackWindow = async (Index: number): Promise<void> =>
{
    if (!Number.isSafeInteger(Index) || Index < 0)
    {
        throw new TypeError("The requested stack-window index is invalid.");
    }

    await ipcRenderer.invoke(AppApiChannel.OverlayStackWindowSelect, Index);
};

const PreviewOverlayFocus = async (
    Id: OverlayCommandId | null
): Promise<void> =>
{
    if (Id !== null && !IsOverlayCommandId(Id))
    {
        throw new TypeError("The requested Focus preview command is invalid.");
    }

    await ipcRenderer.invoke(AppApiChannel.OverlayFocusPreview, Id);
};

const OnOverlayScreenChanged = (
    Listener: (Screen: OverlayScreenDto) => void
): (() => void) =>
{
    const OnChanged = (_Event: IpcRendererEvent, Value: unknown): void =>
    {
        if (IsOverlayScreenDto(Value))
        {
            Listener(Value);
        }
    };

    ipcRenderer.on(AppApiChannel.OverlayScreenChanged, OnChanged);
    return (): void =>
    {
        ipcRenderer.removeListener(AppApiChannel.OverlayScreenChanged, OnChanged);
    };
};

const CancelInsertTarget = async (): Promise<void> =>
    void await ipcRenderer.invoke(AppApiChannel.InsertTargetCancel);

const ChooseInsertTargetWindow = async (): Promise<void> =>
    void await ipcRenderer.invoke(AppApiChannel.InsertTargetChooseWindow);

const GetInsertTarget = async (): Promise<InsertTargetPresentation> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.InsertTargetGet);

    if (!IsInsertTargetPresentation(Response))
    {
        throw new TypeError("The main process returned an invalid Insert target.");
    }

    return Response;
};

const OnInsertTargetChanged = (
    Listener: (Presentation: InsertTargetPresentation) => void
): (() => void) =>
{
    const OnChanged = (_Event: IpcRendererEvent, Value: unknown): void =>
    {
        if (IsInsertTargetPresentation(Value))
        {
            Listener(Value);
        }
    };

    ipcRenderer.on(AppApiChannel.InsertTargetChanged, OnChanged);
    return (): void =>
    {
        ipcRenderer.removeListener(AppApiChannel.InsertTargetChanged, OnChanged);
    };
};

const SetInsertTargetCaptureNext = async (Enabled: boolean): Promise<void> =>
{
    if (typeof Enabled !== "boolean")
    {
        throw new TypeError("The Insert target capture setting must be a boolean.");
    }

    void await ipcRenderer.invoke(AppApiChannel.InsertTargetSetCaptureNext, Enabled);
};

const GetRendererTheme = async (): Promise<RendererTheme> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.ThemeGet);

    if (!IsRendererTheme(Response))
    {
        throw new TypeError("The main process returned an invalid renderer theme.");
    }

    return Response;
};

const OnRendererThemeChanged = (
    Listener: (Theme: RendererTheme) => void
): (() => void) =>
{
    const OnChanged = (_Event: IpcRendererEvent, Value: unknown): void =>
    {
        if (IsRendererTheme(Value))
        {
            Listener(Value);
        }
    };

    ipcRenderer.on(AppApiChannel.ThemeChanged, OnChanged);
    return (): void =>
    {
        ipcRenderer.removeListener(AppApiChannel.ThemeChanged, OnChanged);
    };
};

const GetFloatingWindowSettings = async (): Promise<FloatingWindowSettingsDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.FloatingWindowSettingsGet);

    if (!IsFloatingWindowSettingsDto(Response))
    {
        throw new TypeError("The main process returned invalid floating-window settings.");
    }

    return Response;
};

const GetGeneralSettings = async (): Promise<GeneralSettingsDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.GeneralSettingsGet);

    if (!IsGeneralSettingsDto(Response))
    {
        throw new TypeError("The main process returned invalid general settings.");
    }

    return Response;
};

const SetGeneralSettings = async (
    Patch: GeneralSettingsPatch
): Promise<GeneralSettingsDto> =>
{
    if (!IsGeneralSettingsPatch(Patch))
    {
        throw new TypeError("The requested general-settings patch is invalid.");
    }

    const Response: unknown = await ipcRenderer.invoke(
        AppApiChannel.GeneralSettingsSet,
        Patch
    );

    if (!IsGeneralSettingsDto(Response))
    {
        throw new TypeError("The main process returned invalid general settings.");
    }

    return Response;
};

const SetFloatingWindowSettings = async (
    Patch: FloatingWindowSettingsPatch
): Promise<FloatingWindowSettingsDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.FloatingWindowSettingsSet, Patch);

    if (!IsFloatingWindowSettingsDto(Response))
    {
        throw new TypeError("The main process returned invalid floating-window settings.");
    }

    return Response;
};

const GetOverlaySettings = async (): Promise<OverlaySettingsDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.OverlaySettingsGet);

    if (!IsOverlaySettingsDto(Response))
    {
        throw new TypeError("The main process returned invalid overlay settings.");
    }

    return Response;
};

const SetOverlaySettings = async (
    Patch: OverlaySettingsPatch
): Promise<OverlaySettingsDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.OverlaySettingsSet, Patch);

    if (!IsOverlaySettingsDto(Response))
    {
        throw new TypeError("The main process returned invalid overlay settings.");
    }

    return Response;
};

const GetPerAppSettings = async (): Promise<ReadonlyArray<PerAppSettingsEntryDto>> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.PerAppSettingsGet);

    if (!IsPerAppSettingsEntriesDto(Response))
    {
        throw new TypeError("The main process returned invalid per-application settings.");
    }

    return Response;
};

const GetRecentPerAppSettingsApplications = async (): Promise<
    ReadonlyArray<PerAppSettingsApplicationDto>
> =>
{
    const Response: unknown = await ipcRenderer.invoke(
        AppApiChannel.PerAppSettingsRecentGet
    );

    if (!IsPerAppSettingsApplicationsDto(Response))
    {
        throw new TypeError("The main process returned invalid recent applications.");
    }

    return Response;
};

const AddPerAppSettings = async (
    ExecutablePath?: string
): Promise<PerAppSettingsEntryDto | null> =>
{
    if (ExecutablePath !== undefined && ExecutablePath.trim().length === 0)
    {
        throw new TypeError("The requested application executable path is invalid.");
    }

    const Response: unknown = await ipcRenderer.invoke(
        AppApiChannel.PerAppSettingsAdd,
        ExecutablePath
    );

    if (Response !== null && !IsPerAppSettingsEntryDto(Response))
    {
        throw new TypeError("The main process returned invalid per-application settings.");
    }

    return Response;
};

const SetPerAppSettings = async (
    ExecutablePath: string,
    Patch: PerAppSettingPatch
): Promise<PerAppSettingsEntryDto> =>
{
    if (ExecutablePath.trim().length === 0 || !IsPerAppSettingPatch(Patch))
    {
        throw new TypeError("The requested per-application settings patch is invalid.");
    }

    const Response: unknown = await ipcRenderer.invoke(
        AppApiChannel.PerAppSettingsSet,
        ExecutablePath,
        Patch
    );

    if (!IsPerAppSettingsEntryDto(Response))
    {
        throw new TypeError("The main process returned invalid per-application settings.");
    }

    return Response;
};

const GetUpdateStatus = async (): Promise<UpdateStatusDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.UpdateStatusGet);

    if (!IsUpdateStatusDto(Response))
    {
        throw new TypeError("The main process returned an invalid update status.");
    }

    return Response;
};

const DownloadAndInstallUpdate = async (): Promise<UpdateDownloadResultDto> =>
{
    const Response: unknown = await ipcRenderer.invoke(AppApiChannel.UpdateDownloadAndInstall);

    if (!IsUpdateDownloadResultDto(Response))
    {
        throw new TypeError("The main process returned an invalid update download result.");
    }

    return Response;
};

const applicationApi: AppApi = Object.freeze({
    backdrop: Object.freeze({
        onShow: OnBackdropShow
    }),
    floatingWindowSettings: Object.freeze({
        get: GetFloatingWindowSettings,
        set: SetFloatingWindowSettings
    }),
    focusPreview: Object.freeze({
        onChanged: OnFocusPreviewChanged
    }),
    generalSettings: Object.freeze({
        get: GetGeneralSettings,
        set: SetGeneralSettings
    }),
    insertTarget: Object.freeze({
        cancel: CancelInsertTarget,
        chooseWindow: ChooseInsertTargetWindow,
        get: GetInsertTarget,
        onChanged: OnInsertTargetChanged,
        setCaptureNext: SetInsertTargetCaptureNext
    }),
    log: Object.freeze({
        write: WriteRendererLog
    }),
    overlay: Object.freeze({
        back: BackOverlayScreen,
        get: GetOverlayScreen,
        invoke: InvokeOverlayCommand,
        onChanged: OnOverlayScreenChanged,
        preview: PreviewOverlayFocus,
        selectStackWindow: SelectOverlayStackWindow
    }),
    overlaySettings: Object.freeze({
        get: GetOverlaySettings,
        set: SetOverlaySettings
    }),
    perAppSettings: Object.freeze({
        add: AddPerAppSettings,
        get: GetPerAppSettings,
        getRecent: GetRecentPerAppSettingsApplications,
        set: SetPerAppSettings
    }),
    platform: process.platform,
    settings: Object.freeze({
        onNavigate: OnSettingsNavigate,
        open: OpenSettings
    }),
    theme: Object.freeze({
        get: GetRendererTheme,
        onChanged: OnRendererThemeChanged
    }),
    update: Object.freeze({
        downloadAndInstall: DownloadAndInstallUpdate,
        getStatus: GetUpdateStatus
    }),
    versions:
    {
        chrome: process.versions.chrome ?? "unknown",
        electron: process.versions.electron ?? "unknown",
        node: process.versions.node
    }
});

contextBridge.exposeInMainWorld("sorrell", applicationApi);
