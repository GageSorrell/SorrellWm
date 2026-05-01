/* File:      WindowTracker.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#include "WindowTracker.h"
#include "Core/WindowUtilities.h"

static std::vector<HWND> TileableWindows;
static std::vector<HWND> TiledWindows;

void UpdateTiledList(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    TiledWindows.clear();
    for (auto Window : CallbackInfo[0].As<Napi::Array>())
    {
        Napi::Value HandleValue = Window.second;
        HWND Out = (HWND) DecodeHandle(HandleValue.As<Napi::Object>());
        TiledWindows.push_back(Out);
    }
}

bool IsWindowTiled(HWND Window)
{
    return std::find(TiledWindows.begin(), TiledWindows.end(), Window) != TiledWindows.end();
}

void InitializeWindowTracker(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
}
