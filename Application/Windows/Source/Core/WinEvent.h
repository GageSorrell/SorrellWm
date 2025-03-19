#pragma once

#include "Core.h"
#include "Dispatcher.h"
#include "WindowUtilities.h"
#include <atomic>

struct FWinEventPayload
{
    DWORD Event;
    HWND Handle;
    LONG IdObject;
    LONG IdChild;
    DWORD EventThread;
    DWORD EventTime;
};

class FWinEvent : public TDispatcher<FWinEventPayload>
{
public:
    FWinEvent();

    static Napi::Value Initialize(const Napi::CallbackInfo& CallbackInfo);

    static void DispatchFromEventProc_INTERNAL(FWinEventPayload Payload);

    static void OnExit(void* _);

    inline static HWINEVENTHOOK EventHook = nullptr;

    Napi::Env Environment;
};
