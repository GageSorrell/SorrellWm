/* File:      InterProcessCommunication.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#include "InterProcessCommunication.h"
#include "Math.h"
#include "Utility.h"

FIpc::FIpc(Napi::Env Environment, Napi::Function InCallback) : Environment(Environment)
{
    Callback = Napi::Persistent(InCallback);
}

void FIpc::Send(const std::string& Channel, const Napi::Value& Message)
{
    Napi::HandleScope Scope(Environment);
    Callback.Call({ Napi::String::New(Environment, Channel), Message });
}

void FIpc::Send(const std::string& Channel)
{
    Napi::HandleScope Scope(Environment);
    Callback.Call({ Napi::String::New(Environment, Channel) });
}

Napi::Env FIpc::Env() const
{
    return Environment;
}

int FIpc::Bind(const std::string& Channel, const FIpcCallback& Callback)
{
    const int Id = GetRandomNumber<int>();
    BoundFunctions[Channel][Id] = Callback;
    return Id;
}

void FIpc::Unbind(int Id)
{
    for (auto& [ Channel, IdCallbackMap ] : BoundFunctions)
    {
        auto MatchesId = [Id](const auto& IdCallbackPair) -> bool
        {
            return IdCallbackPair.first == Id;
        };

        const bool bFoundMatch = RemoveFirstIfMap(IdCallbackMap, MatchesId);
        if (bFoundMatch)
        {
            return;
        }
    }
}

void FIpc::Broadcast(
    const std::string& InChannel,
    const Napi::Env& InEnvironment,
    const Napi::Value& Payload
)
{
    for (const auto& [ Channel, IdCallbackMap ] : BoundFunctions)
    {
        if (InChannel == Channel)
        {
            for (const auto& [ Id, Callback ] : IdCallbackMap)
            {
                Callback(InEnvironment, Payload);
            }
        }
    }
}

Napi::Value SendNativeIpc(const Napi::CallbackInfo& Information)
{
    Napi::Env Environment = Information.Env();

    std::string Channel = Information[0].As<Napi::String>();
    if (Information.Length() == 1)
    {
        GGlobals::Ipc->Broadcast(Channel, Environment, Environment.Undefined());
    }
    else
    {
        GGlobals::Ipc->Broadcast(Channel, Environment, Information[1]);
    }

    RETURN_NAPI();
}
