#pragma once

#include "Core.h"
#include "Dispatcher.h"
#include "WindowUtilities.h"
#include <atomic>

class FWinEvent : public TDispatcher<DWORD>
{
public:
    FWinEvent();

    static Napi::Value Initialize(const Napi::CallbackInfo& CallbackInfo);

    static void DispatchFromEventProc_INTERNAL(DWORD Event);

    static void OnExit(void* _);

    inline static HWINEVENTHOOK EventHook = nullptr;

    Napi::Env Environment;
};
