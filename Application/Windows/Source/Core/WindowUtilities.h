/* File:      WindowUtilities.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"
#include <string>
#include <sstream>
#include <gdiplus.h>
#include <dwmapi.h>
#include <iostream>
#include "String.h"
#include "Utility.h"
#include <cmath>
#include <chrono>
#include <thread>
#include "../../ThirdParty/Blur.h"

// DEFINE_LOG_CATEGORY(Window)

DECLARE_NAPI_FUNCTION(GetFocusedWindow, HWindow, Renderer, Hook)
DECLARE_NAPI_FUNCTION(CaptureWindowScreenshot, string, Handle, HWindow)
DECLARE_NAPI_FUNCTION(CloseApplication, void, Pid, number)
DECLARE_NAPI_FUNCTION(GetDwmWindowRectNode, FBox, ExportName="GetDwmWindowRect", Handle, HWindow)
DECLARE_NAPI_FUNCTION(GetWindowShape, FBox, Handle, HWindow)
DECLARE_NAPI_FUNCTION(GetTitlebarHeight, number)
DECLARE_NAPI_FUNCTION(SetForegroundWindowNode, void, ExportName="SetForegroundWindow", Handle, HWindow)
DECLARE_NAPI_FUNCTION(GetWindowByName, HWindow | undefined, Name, string)
DECLARE_NAPI_FUNCTION(GetIsLightMode, boolean, Renderer, Hook)
DECLARE_NAPI_FUNCTION(GetThemeColor, FHexColor, Renderer, Hook)
DECLARE_NAPI_FUNCTION(CanTile, boolean)
DECLARE_NAPI_FUNCTION(GetTileableWindowsNode, TArray<HWindow>, ExportName="GetTileableWindows")
DECLARE_NAPI_FUNCTION(GetMonitorFromWindow, HMonitor, Handle, HWindow)
DECLARE_NAPI_FUNCTION(SetWindowPosition, void, Handle, HWindow, Box, FBox)
DECLARE_NAPI_FUNCTION(GetWindowTitle, string, Handle, HWindow)
DECLARE_NAPI_FUNCTION(GetApplicationFriendlyName, string | undefined, Handle, HWindow)
DECLARE_NAPI_FUNCTION(MinimizeWindow, void, Handle, HWindow)
DECLARE_NAPI_FUNCTION(RestoreAllWindows, void)
DECLARE_NAPI_FUNCTION(RestoreInPlace, void, Handle, HWindow)
DECLARE_NAPI_FUNCTION(RestoreWindow, void, Handle, HWindow)
DECLARE_NAPI_FUNCTION(StealFocusNode, void, ExportName="StealFocus", Handle, HWindow)

std::string CaptureWindowScreenshot_Internal(HWND hwnd);
BOOL GetDwmWindowRect(HWND Handle, RECT* Rect);
HWND GetHandleArgument(const Napi::Env& Environment, const Napi::CallbackInfo& CallbackInfo, int Index);
HWND GetMainWindow();
TArray<HWND> GetTileableWindows();
bool IsTileableWindow(HWND WindowHandle);
bool IsWindowSnapped(HWND WindowHandle);
void StealFocus(HWND Window);

/** Is the main window the foreground window? */
bool IsWmForeground();
