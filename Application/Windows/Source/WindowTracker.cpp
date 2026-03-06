/* File:      WindowTracker.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#include "WindowTracker.h"
#include "Core/WindowUtilities.h"

static std::vector<HWND> TileableWindows;
static std::vector<HWND> TiledWindows;

Napi::Value UpdateTiledList(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    TiledWindows.empty();
    for (const Napi::Value& Window : CallbackInfo[0].As<Napi::Array>())
    {
        TiledWindows.emplace((HWND) DecodeHandle(Window.As<Napi::Object>()));
    }

    RETURN_NAPI();
}

bool IsWindowTiled(HWND WindowHandle)
{
    return std::find(TiledWindows.begin(), TiledWindows.end(), WindowHandle) != TiledWindows.end();
}

Napi::Value InitializeWindowTracker(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    RETURN_NAPI();
}
