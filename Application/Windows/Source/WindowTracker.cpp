/* File:      WindowTracker.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#include "WindowTracker.h"
#include "Core/WindowUtilities.h"

static TArray<HWND> TileableWindows;
static TArray<HWND> TiledWindows;

Napi::Value UpdateTiledList(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    TiledWindows.empty();
    for (auto Window : CallbackInfo[0].As<Napi::Array>())
    {
        Napi::Value HandleValue = Window.second;
        HWND Out = (HWND) DecodeHandle(HandleValue.As<Napi::Object>());
        TiledWindows.push_back(Out);
    }

    RETURN_NAPI();
}

bool IsWindowTiled(HWND Window)
{
    return std::find(TiledWindows.begin(), TiledWindows.end(), Window) != TiledWindows.end();
}

NAPI_VOID InitializeWindowTracker(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    RETURN_NAPI();
}
