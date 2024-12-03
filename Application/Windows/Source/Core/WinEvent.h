#pragma once

#include "Core.h"
#include "Globals.h"
#include "WindowUtilities.h"
#include <atomic>

class FWinEvent
{
public:
    // static void CALLBACK WinEventProc(HWINEVENTHOOK, DWORD event, HWND hwnd, LONG, LONG, DWORD, DWORD);

    static Napi::Value Initialize(const Napi::CallbackInfo& info);

    static Napi::Value CoverWindow(const Napi::CallbackInfo& Information);
    static Napi::Value Test(const Napi::CallbackInfo& Information);
    static Napi::Value TestTwo(const Napi::CallbackInfo& Information);

    // static Napi::ThreadSafeFunction threadSafeCallback;

    static void OnExit(void* _);

    inline static HWINEVENTHOOK eventHook = nullptr;
};
