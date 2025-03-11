#pragma once

#include "Core.h"
#include "Dispatcher.h"
#include "Globals.h"
#include "WindowUtilities.h"
#include <atomic>

class FWinEvent : public TDispatcher<DWORD>
{
public:
    static Napi::Value Initialize(const Napi::CallbackInfo& info);

    static void DispatchFromEventProc(DWORD Event);

    static void OnExit(void* _);
    inline static HWINEVENTHOOK eventHook = nullptr;
};
