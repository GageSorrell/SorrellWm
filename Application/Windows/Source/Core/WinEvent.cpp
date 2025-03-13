/* File:      WinEvent.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "WinEvent.h"
#include "Globals.h"
#include "InterProcessCommunication.h"

FWinEvent::FWinEvent() : TDispatcher<DWORD>(), Environment(NULL)
{ }

void FWinEvent::DispatchFromEventProc_INTERNAL(DWORD Event)
{
    GGlobals::WinEvent->Dispatch(Event);
    Napi::Object OutObject = Napi::Object::New(GGlobals::WinEvent->Environment);
    Napi::Number EventNum = Napi::Number::New(GGlobals::WinEvent->Environment, Event);
    OutObject.Set("Event", Event);
    GGlobals::Ipc->Send("WinEvent", OutObject);
}

void CALLBACK WinEventProc(
    HWINEVENTHOOK EventHook,
    DWORD Event,
    HWND Handle,
    LONG IdObject,
    LONG IdChild,
    DWORD EventThread,
    DWORD EventTime
)
{
    FWinEvent::DispatchFromEventProc_INTERNAL(Event);
}

Napi::Value FWinEvent::Initialize(const Napi::CallbackInfo& CallbackInfo)
{
    GGlobals::WinEvent->Environment = CallbackInfo.Env();

    HWINEVENTHOOK ObjectCreateEventHook = SetWinEventHook(
        EVENT_OBJECT_CREATE,
        EVENT_OBJECT_CREATE,
        nullptr,
        WinEventProc,
        0,
        0,
        WINEVENT_OUTOFCONTEXT
    );

    if (!ObjectCreateEventHook)
    {
        Napi::Error::New(GGlobals::WinEvent->Environment, "Failed to set up event hook").ThrowAsJavaScriptException();
        return GGlobals::WinEvent->Environment.Null();
    }
    else
    {
        EventHook = ObjectCreateEventHook;
    }

    return GGlobals::WinEvent->Environment.Undefined();
}

void FWinEvent::OnExit(void* _)
{
    if (EventHook != nullptr)
    {
        UnhookWinEvent(EventHook);
        EventHook = nullptr;
    }
}
