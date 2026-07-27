/**
 *
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

const applicationApi: AppApi = Object.freeze({
    backdrop: Object.freeze({
        onShow: OnBackdropShow
    }),
    overlay: Object.freeze({
        back: BackOverlayScreen,
        get: GetOverlayScreen,
        invoke: InvokeOverlayCommand,
        onChanged: OnOverlayScreenChanged,
        preview: PreviewOverlayFocus
    }),
    platform: process.platform,
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
