/* File:      WinEvent.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "WinEvent.h"
#include "Globals.h"
#include "InterProcessCommunication.h"

FWinEvent::FWinEvent() : TDispatcher<FWinEventPayload>(), Environment(NULL)
{ }

void FWinEvent::DispatchFromEventProc_INTERNAL(FWinEventPayload Payload)
{
    Napi::HandleScope ScopeHandle(GGlobals::WinEvent->Environment);

    GGlobals::WinEvent->Dispatch(Payload);
    Napi::Object OutObject = Napi::Object::New(GGlobals::WinEvent->Environment);
    Napi::Number Event = Napi::Number::New(GGlobals::WinEvent->Environment, Payload.Event);
    Napi::Object Handle = EncodeHandle(GGlobals::WinEvent->Environment, (void*) Payload.Handle);
    Napi::Number IdObject = Napi::Number::New(GGlobals::WinEvent->Environment, Payload.IdObject);
    Napi::Number IdChild = Napi::Number::New(GGlobals::WinEvent->Environment, Payload.IdChild);
    Napi::Number EventThread = Napi::Number::New(GGlobals::WinEvent->Environment, Payload.EventThread);
    Napi::Number EventTime = Napi::Number::New(GGlobals::WinEvent->Environment, Payload.EventTime);
    OutObject.Set("Event", Event);
    OutObject.Set("Handle", Handle);
    OutObject.Set("IdObject", IdObject);
    OutObject.Set("IdChild", IdChild);
    OutObject.Set("EventThread", EventThread);
    OutObject.Set("EventTime", EventTime);
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
    FWinEvent::DispatchFromEventProc_INTERNAL({ Event, Handle, IdObject, IdChild, EventThread, EventTime });
}

Napi::Value FWinEvent::Initialize(const Napi::CallbackInfo& CallbackInfo)
{
    GGlobals::WinEvent->Environment = CallbackInfo.Env();

    HWINEVENTHOOK ObjectCreateEventHook = SetWinEventHook(
        EVENT_MIN,
        EVENT_MAX,
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
