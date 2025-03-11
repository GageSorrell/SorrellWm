#include "WinEvent.h"

void FWinEvent::DispatchFromEventProc(DWORD Event)
{
    GGlobals::WinEvent->Dispatch(Event);
}

void CALLBACK WinEventProc(HWINEVENTHOOK, DWORD Event, HWND Handle, LONG, LONG, DWORD, DWORD)
{
    FWinEvent::DispatchFromEventProc(Event);
}

Napi::Value FWinEvent::Initialize(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    eventHook = SetWinEventHook(
        EVENT_OBJECT_CREATE,
        EVENT_OBJECT_CREATE,
        nullptr,
        WinEventProc,
        0,
        0,
        WINEVENT_OUTOFCONTEXT
    );

    if (!eventHook)
    {
        Napi::Error::New(Environment, "Failed to set up event hook").ThrowAsJavaScriptException();
        return Environment.Null();
    }

    return Environment.Undefined();
}

// Napi::Value FWinEvent::Initialize(const Napi::CallbackInfo& info)
// {
//     Napi::Env env = info.Env();

//     if (info.Length() < 1 || !info[0].IsFunction())
//     {
//         Napi::TypeError::New(env, "Expected a function as the first argument").ThrowAsJavaScriptException();
//         return env.Null();
//     }

//     // Create a ThreadSafeFunction to call the provided JavaScript callback
//     Napi::Function jsCallback = info[0].As<Napi::Function>();
//     threadSafeCallback = Napi::ThreadSafeFunction::New(
//         env,
//         jsCallback,
//         "Window Monitoring Callback",
//         0,
//         1
//     );

//     // Set up the event hook
//     eventHook = SetWinEventHook(
//         EVENT_OBJECT_CREATE,   // Event type
//         EVENT_OBJECT_CREATE,   // Same for the end range
//         nullptr,               // No DLL handle
//         WinEventProc,          // Callback function
//         0,                     // Monitor all processes
//         0,                     // Monitor all threads
//         WINEVENT_OUTOFCONTEXT  // Hook type
//     );

//     if (!eventHook)
//     {
//         Napi::Error::New(env, "Failed to set up event hook").ThrowAsJavaScriptException();
//         return env.Null();
//     }

//     return Napi::Boolean::New(env, true);
// }

// @TODO Register this in `Initialization.cpp`
void FWinEvent::OnExit(void* _)
{
    if (FWinEvent::eventHook)
    {
        UnhookWinEvent(eventHook);
        eventHook = nullptr;

        // Release the ThreadSafeFunction
        // threadSafeCallback.Release();
    }
}
