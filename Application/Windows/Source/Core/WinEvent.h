/* File:      WinEvent.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"
#include "Dispatcher.h"
#include "WindowUtilities.h"
#include <atomic>

DECLARE_NAPI_FUNCTION(InitializeWinEvent, void);

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

    static void DispatchFromEventProc_INTERNAL(FWinEventPayload Payload);

    static void OnExit(void* _);

    inline static HWINEVENTHOOK EventHook = nullptr;

    Napi::Env Environment;
};
