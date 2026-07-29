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
    IsFloatingWindowSettingsDto,
    IsOverlaySettingsDto,
    type OverlaySettingsDto,
    type OverlaySettingsPatch
} from "../Shared/AppSettings.ts";
import {
    type FocusPreviewPresentation,
    IsFocusPreviewPresentation
} from "../Shared/FocusPreview.ts";
import {
    IsOverlayCommandId,
    IsOverlayScreenDto,
    type OverlayCommandId,
    type OverlayScreenDto
} from "../Shared/OverlayCommand.ts";
import { IsRendererTheme, type RendererTheme } from "../Shared/Theme.ts";
import type { IpcRendererEvent } from "electron";
import electron from "electron";

const { contextBridge, ipcRenderer } = electron;

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
    overlay: Object.freeze({
        back: BackOverlayScreen,
        get: GetOverlayScreen,
        invoke: InvokeOverlayCommand,
        onChanged: OnOverlayScreenChanged,
        preview: PreviewOverlayFocus
    }),
    overlaySettings: Object.freeze({
        get: GetOverlaySettings,
        set: SetOverlaySettings
    }),
    platform: process.platform,
    settings: Object.freeze({
        onNavigate: OnSettingsNavigate
    }),
    theme: Object.freeze({
        get: GetRendererTheme,
        onChanged: OnRendererThemeChanged
    }),
    versions:
    {
        chrome: process.versions.chrome ?? "unknown",
        electron: process.versions.electron ?? "unknown",
        node: process.versions.node
    }
});

contextBridge.exposeInMainWorld("sorrell", applicationApi);
