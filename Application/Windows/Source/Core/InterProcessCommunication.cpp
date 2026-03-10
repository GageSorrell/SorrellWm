/* File:      InterProcessCommunication.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#include "InterProcessCommunication.h"
#include "Math.h"
#include "Utility.h"
#include "Globals.h"

FIpc::FIpc(Napi::Env Environment, Napi::Function InCallback) : Environment(Environment)
{
    OnMessage = Napi::Persistent(InCallback);
}

void FIpc::Send(const FString& Channel, const Napi::Value& Payload)
{
    Napi::HandleScope Scope(Environment);
    OnMessage.Call({ Napi::String::New(Environment, Channel), Payload });
}

void FIpc::Send(const FString& Channel)
{
    Napi::HandleScope Scope(Environment);
    OnMessage.Call({ Napi::String::New(Environment, Channel) });
}

Napi::Env FIpc::Env() const
{
    return Environment;
}

void FIpc::Unbind(const FDelegateHandle& Handle)
{
    for (auto& [ Channel, Wrappers ] : BoundFunctions)
    {
        const bool bFound = RemoveFirstIf(
            Wrappers,
            [&](const FCallbackWrapper& Wrapper) -> bool
            {
                return Wrapper.Handle == Handle;
            }
        );

        if (bFound)
        {
            break;
        }
    }
}

FIpc::FCallbackWrapper::FCallbackWrapper(bool bInCallOnce, const FIpcCallback& InCallback)
    : bCallOnce(bInCallOnce)
    , Callback(InCallback)
{
    Handle = FDelegateHandle(GetRandomNumber<int>());
}

FDelegateHandle FIpc::Bind(const FString& Channel, const FIpcCallback& Callback)
{
    return BindBase(Channel, Callback, false);
}

FDelegateHandle FIpc::BindOnce(const FString& Channel, const FIpcCallback& Callback)
{
    return BindBase(Channel, Callback, true);
}

FDelegateHandle FIpc::BindBase(const FString& Channel, const FIpcCallback& Callback, bool bCallOnce)
{
    FCallbackWrapper Wrapper(bCallOnce, Callback);
    BoundFunctions[Channel].push_back(Wrapper);
    return Wrapper.Handle;
}

void FIpc::Broadcast(const FString& Channel, const Napi::Value& Payload)
{
    std::vector<FDelegateHandle> HandlesToRemove;

    for (const auto& [ BoundChannel, CallbackWrappers ] : BoundFunctions)
    {
        if (Channel == BoundChannel)
        {
            for (const FCallbackWrapper& Wrapper : CallbackWrappers)
            {
                Wrapper.Callback(Environment, Payload);

                if (Wrapper.bCallOnce)
                {
                    HandlesToRemove.push_back(Wrapper.Handle);
                }
            }
        }
    }

    for (const FDelegateHandle& Handle : HandlesToRemove)
    {
        Unbind(Handle);
    }
}

void SendNativeIpc(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    FString Channel = CallbackInfo[0].As<Napi::String>();
    const Napi::Value& Payload = (CallbackInfo.Length() == 1)
        ? Environment.Undefined()
        : CallbackInfo[1];

    GGlobals::Ipc->Broadcast(Channel, Payload);
}

void TestIpc(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    GGlobals::Ipc->Bind("Test", [](const Napi::Env& Environment, const Napi::Value& Payload) -> void
    {
        std::cout << "RECEIVED TEST" << std::endl;
    });
}

void InitializeIpc(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    Napi::Function OnMessage = CallbackInfo[0].As<Napi::Function>();
    GGlobals::Ipc = new FIpc(Environment, OnMessage);
}
